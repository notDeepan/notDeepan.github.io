import { NextResponse } from 'next/server';
import { validateContact } from '@/components/contact/validation';
export const runtime = 'nodejs';
const configured = () => Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_FROM && process.env.CONTACT_TO);
export async function GET() { return NextResponse.json({configured:configured()}); }
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({error:'Request origin is not allowed.'},{status:403});
  if (Number(request.headers.get('content-length') || 0) > 16000) return NextResponse.json({error:'Please shorten your message.'},{status:413});
  let input: unknown;
  try { const raw = await request.text(); if(raw.length>16000) return NextResponse.json({error:'Please shorten your message.'},{status:413}); input=JSON.parse(raw); }
  catch { return NextResponse.json({error:'Please check your message and try again.'},{status:400}); }
  const result = validateContact(input);
  if (!result.ok) return NextResponse.json({error:result.error},{status:400});
  if (result.data.website) return NextResponse.json({ok:true});
  if (!configured()) return NextResponse.json({error:'Our inquiry inbox is not connected yet. Your message has not been sent.'},{status:503});
  const {name,email,company,message} = result.data;
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({from:process.env.CONTACT_FROM,to:[process.env.CONTACT_TO],reply_to:email,subject:`New website inquiry from ${name}`,text:`Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\n${message}`}),
      signal:AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error('Email delivery failed');
    return NextResponse.json({ok:true});
  } catch { return NextResponse.json({error:'We could not deliver your message. Please try again shortly.'},{status:502}); }
}
