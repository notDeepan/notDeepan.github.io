'use client';
import { useEffect, useRef, useState } from 'react';
import { scrollEngine } from '@/lib/scrollEngine';
import { assetPath } from '@/lib/assetPath';

export default function ContactDialog({ close }: {close: () => void}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'saved'|'error'>('idle');
  const [error, setError] = useState('');
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement;
    scrollEngine.lock();
    dialog.current?.showModal();
    const controller = new AbortController();
    if(process.env.NEXT_PUBLIC_STATIC_EXPORT==='1')setConfigured(false);
    else fetch(assetPath('/api/contact'), {signal:controller.signal}).then(r=>r.json()).then(r=>setConfigured(r.configured === true)).catch(()=>setConfigured(false));
    return () => { controller.abort(); scrollEngine.unlock(); trigger?.focus(); };
  }, []);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    if (!configured) {
      const text = `PROJECT BRIEF — PIXEL RICE\n\nName: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || '—'}\n\n${data.message}\n\nSaved locally. This brief has not been sent.\n`;
      const url = URL.createObjectURL(new Blob([text], {type:'text/plain;charset=utf-8'}));
      const link = document.createElement('a'); link.href=url; link.download='pixel-rice-project-brief.txt'; link.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000); setStatus('saved'); return;
    }
    setStatus('sending');
    try {
      const result = await fetch(assetPath('/api/contact'), {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if (!result.ok) { const body = await result.json(); throw new Error(body.error || 'Your message could not be sent. Please try again.'); }
      setStatus('sent');
    } catch (err) { setError(err instanceof Error ? err.message : 'Please try again.'); setStatus('error'); }
  };
  return <dialog ref={dialog} className="modal contact-modal" aria-labelledby="contact-title" onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget) close();}}>
    <div className="modal-shell">
      <button className="round-button modal-close" onClick={close} aria-label="Close contact">×</button>
      <span className="eyebrow">A GOOD PLACE TO START</span>
      <h2 id="contact-title">What’s<br/><em>cooking?</em></h2>
      {status==='sent' ? <div className="form-result" role="status"><p>Your message is on its way.</p><span>Thanks for telling us about your idea.</span><button className="text-button" onClick={close}>Back to the studio ↗</button></div> : <form onSubmit={submit}>
        <div className="form-row"><label>Your name<input autoComplete="name" name="name" required maxLength={100} placeholder="Alex Chen"/></label><label>Email address<input autoComplete="email" name="email" type="email" required maxLength={254} placeholder="alex@company.com"/></label></div>
        <label>Company <span className="optional">(optional)</span><input autoComplete="organization" name="company" maxLength={150} placeholder="Where you make things happen"/></label>
        <label>A little about your idea<textarea name="message" required minLength={10} maxLength={5000} rows={3} placeholder="The ambition, the challenge, the wild idea…"/></label>
        <input className="honeypot" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
        {configured === false && <p className="form-note">Our inquiry inbox is being connected. You can save your brief now; nothing will be sent.</p>}
        {status==='saved' && <p role="status" className="form-note success">Your brief was downloaded. It has not been sent.</p>}
        {status==='error' && <p role="alert" className="form-note error">{error}</p>}
        <button className="solid-button" disabled={status==='sending'||configured===null}>{configured===null ? 'Getting ready…' : status==='sending' ? 'Sending…' : configured ? 'Send your idea' : 'Save project brief'} <span>↗</span></button>
      </form>}
    </div>
  </dialog>;
}
