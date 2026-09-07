'use client';
import { useEffect, useRef } from 'react';
import { scrollEngine } from '@/lib/scrollEngine';
import type { SectionId } from '@/lib/constants';
import { site } from '@/data/site';

export default function NavigationDialog({close,navigate}:{close:()=>void;navigate:(id:SectionId)=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const trigger=document.activeElement as HTMLElement;
    scrollEngine.lock();dialog.current?.showModal();
    return ()=>{scrollEngine.unlock();trigger?.focus({preventScroll:true});};
  },[]);
  const visit=(id:SectionId)=>{scrollEngine.unlock();navigate(id);};
  return <dialog ref={dialog} className="menu-panel" aria-label="Navigation" onCancel={event=>{event.preventDefault();close();}}>
    <span className="eyebrow">TAKE YOUR PICK</span>
    <nav>{([['founder','The studio'],['projects','Selected work'],['reviews','Good company'],['contact','Let’s talk']] as const).map(([id,label],i)=><button key={id} onClick={()=>visit(id)}><span>0{i+1}</span>{label}<i>↗</i></button>)}</nav>
    <span className="menu-tagline">{site.tagline}</span>
    <button className="round-button menu-close" onClick={close} aria-label="Close navigation">×</button>
  </dialog>;
}
