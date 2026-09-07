export function validateContact(input: unknown): {ok:true;data:{name:string;email:string;company:string;message:string;website:string}} | {ok:false;error:string} {
  if(!input || typeof input!=='object') return {ok:false,error:'Please complete the form.'};
  const body = input as Record<string,unknown>;
  const field = (key:string) => typeof body[key]==='string' ? (body[key] as string).trim() : '';
  const name=field('name'), email=field('email'), company=field('company'), message=field('message'), website=field('website');
  if(name.length<1 || name.length>100 || /[\r\n]/.test(name)) return {ok:false,error:'Please enter your name (up to 100 characters).'};
  if(email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return {ok:false,error:'Please enter a valid email address.'};
  if(company.length>150) return {ok:false,error:'Please shorten the company name.'};
  if(message.length<10 || message.length>5000) return {ok:false,error:'Please tell us about your idea in 10–5,000 characters.'};
  return {ok:true,data:{name,email,company,message,website}};
}
