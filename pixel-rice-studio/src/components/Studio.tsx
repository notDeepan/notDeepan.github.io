'use client';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { scrollEngine, ScrollEngine } from '@/lib/scrollEngine';
import { PROJECT_WINDOWS, SECTIONS, type SectionId } from '@/lib/constants';
import { founders, site } from '@/data/site';
import { projects } from '@/data/projects';
import { assetPath } from '@/lib/assetPath';
import PeopleDepth from './PeopleDepth';
import { PRESENTATION } from '@/lib/presentation';
import ContactDialog from './contact/ContactDialog';
import ProjectDialog from './projects/ProjectDialog';
import ProjectMedia from './projects/ProjectMedia';
import NavigationDialog from './navigation/NavigationDialog';
const ExperienceCanvas=dynamic(()=>import('./world/ExperienceCanvas'),{ssr:false});

function RiceMark({className=''}:{className?:string}) {
  return <svg className={className} width="31" height="31" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="12" rx="4" ry="9" transform="rotate(-35 12 12)"/><ellipse cx="28" cy="13" rx="4" ry="9" transform="rotate(35 28 13)"/><ellipse cx="21" cy="30" rx="4" ry="9" transform="rotate(-65 21 30)"/></svg>;
}

export default function Studio() {
  const root=useRef<HTMLDivElement>(null),overlay=useRef<HTMLDivElement>(null);
  const layerRefs=useRef<Array<HTMLElement>>([]);
  const projectCaption=useRef<HTMLDivElement>(null);
  const projectLink=useRef<HTMLAnchorElement>(null);
  const lastFrame=useRef({section:-1,project:-1,founder:-2});
  const burst=useRef({value:0,index:0});
  const [webgl,setWebgl]=useState<boolean|null>(null);
  const [section,setSection]=useState(0),[projectIndex,setProjectIndex]=useState(0),[founderIndex,setFounderIndex]=useState(-1);
  const [menu,setMenu]=useState(false),[contact,setContact]=useState(false),[projectOpen,setProjectOpen]=useState<number|null>(null);
  const [simple,setSimple]=useState(false);
  const [systemCalm,setSystemCalm]=useState(false);
  const calm=simple||systemCalm||webgl===false;
  const project=projects[projectIndex] || projects[0];
  const onFrame=useCallback((dt=0)=>{
    const e=scrollEngine;
    root.current?.style.setProperty('--scroll-offset',`${e.raw}px`);
    const active=e.transition>.5?e.index2:e.index1;
    if(lastFrame.current.section!==active){lastFrame.current.section=active;setSection(active);}
    const p=e.progressOf('projects');
    let closest=0,maximum=0;
    PROJECT_WINDOWS.forEach((w,i)=>{const f=ScrollEngine.focal(p,w.peak,.08);if(f>maximum){maximum=f;closest=i;}});
    closest=Math.min(closest,projects.length-1);
    if(projectCaption.current){
      const readable=e.reducedMotion||maximum>.15;
      projectCaption.current.inert=!readable;
      projectCaption.current.style.visibility=readable?'inherit':'hidden';
      projectCaption.current.setAttribute('aria-hidden',String(!readable));
    }
    if(maximum>.2 && lastFrame.current.project!==closest){lastFrame.current.project=closest;setProjectIndex(closest);}
    const ip=ScrollEngine.stage(e.progressOf('founder'),.12,.9);
    const fi=founders.findIndex(f=>ip>=f.range[0] && ip<f.range[1]);
    if(lastFrame.current.founder!==fi){lastFrame.current.founder=fi;setFounderIndex(fi);}
    const aspect=window.innerWidth/window.innerHeight,slant=-.099*aspect;
    const cutLeft=(1-e.transition)*(1-slant)*100,cutRight=cutLeft+slant*100;
    layerRefs.current.forEach((el,i)=>{
      const visible=i===e.index1||(i===e.index2&&e.transition>0);
      el.style.visibility=visible?'visible':'hidden';
      el.setAttribute('aria-hidden',i===active?'false':'true');
      el.inert=i!==active;
      el.style.clipPath=e.transition===0?'none':i===e.index1?`polygon(0 0,100% 0,100% ${cutRight}%,0 ${cutLeft}%)`:`polygon(0 ${cutLeft}%,100% ${cutRight}%,100% 100%,0 100%)`;
    });
    if(overlay.current){
      overlay.current.style.setProperty('--progress',String(e.overall));
      overlay.current.style.setProperty('--hero-drift',String(e.reducedMotion?0:ip));
      overlay.current.style.setProperty('--studio-progress',String(e.reducedMotion?1:ScrollEngine.stage(e.progressOf('identity'),.1,.7)));
      overlay.current.style.setProperty('--people-progress',String(e.reducedMotion?0:e.progressOf('reviews')));
      overlay.current.style.setProperty('--project-reveal',String(e.reducedMotion?1:maximum));
      overlay.current.style.setProperty('--project-progress',String(p));
      overlay.current.style.setProperty('--takeover',String(ScrollEngine.stage(ip,.88,1)));
      overlay.current.style.setProperty('--pointer-x',`${e.pointer.x*8}px`);
    }
    burst.current.value=projectOpen!==null ? Math.min(1,burst.current.value+dt*2.2) : Math.max(0,burst.current.value-dt*2.2);
    if(projectOpen!==null)burst.current.index=projectOpen;
  },[projectOpen]);

  useEffect(()=>{
    if(!root.current)return;
    const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncPreference=()=>setSystemCalm(preference.matches);
    syncPreference();preference.addEventListener('change',syncPreference);
    scrollEngine.attach(root.current);
    layerRefs.current=Array.from(overlay.current?.querySelectorAll<HTMLElement>('[data-scene]') || []);
    let supported=false;
    try {const probe=document.createElement('canvas');const context=probe.getContext('webgl2');supported=Boolean(context);context?.getExtension('WEBGL_lose_context')?.loseContext();} catch { supported=false; }
    setWebgl(supported);
    onFrame();
    const onKey=(event:KeyboardEvent)=>{
      if(scrollEngine.isLocked || menu || event.ctrlKey || event.metaKey || event.altKey)return;
      const target=event.target as HTMLElement;
      if(target.matches('input,textarea,select,button,a') || target.isContentEditable)return;
      const step=event.key==='ArrowDown'?80:event.key==='ArrowUp'?-80:event.key==='PageDown'||event.key===' '?window.innerHeight*.8:event.key==='PageUp'?-window.innerHeight*.8:0;
      if(step){event.preventDefault();scrollEngine.scrollToOffset(scrollEngine.raw+step);}
      if(event.key==='Home'||event.key==='End'){event.preventDefault();scrollEngine.scrollToOffset(event.key==='Home'?0:scrollEngine.maxScroll);}
    };
    window.addEventListener('keydown',onKey);
    return ()=>{scrollEngine.detach();window.removeEventListener('keydown',onKey);preference.removeEventListener('change',syncPreference);};
    // Setup owns the engine; the frame callback reads current modal state through its own render loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  useEffect(()=>{
    scrollEngine.setMotionOverride(simple);
    return ()=>scrollEngine.setMotionOverride(false);
  },[simple]);
  useEffect(()=>{
    if(!calm)return;
    let frame=0,last=performance.now();
    const draw=(time:number)=>{const dt=(time-last)/1000;scrollEngine.update(dt);last=time;onFrame(dt);frame=requestAnimationFrame(draw);};
    frame=requestAnimationFrame(draw);return ()=>cancelAnimationFrame(frame);
  },[calm,onFrame]);
  const go=(id:SectionId)=>{setMenu(false);scrollEngine.scrollToSection(id,true);root.current?.focus({preventScroll:true});};
  const toProject=(index:number)=>{scrollEngine.scrollToProgress('projects',PROJECT_WINDOWS[index].peak,true);root.current?.focus({preventScroll:true});};

  return <main className={`studio immersive-redesign ${calm?'simple-mode':''}`} style={{'--motion-micro':`${PRESENTATION.micro}ms`,'--motion-hover':`${PRESENTATION.hover}ms`,'--motion-reveal':`${PRESENTATION.reveal}ms`,'--motion-chapter':`${PRESENTATION.chapter}ms`,'--motion-ease':PRESENTATION.ease} as React.CSSProperties}>
    <a className="skip-link" href="#projects" onClick={e=>{e.preventDefault();go('projects');}}>Skip to selected work</a>
    {webgl&&!calm ? <ExperienceCanvas onFrame={onFrame} burst={burst} projectLink={projectLink} onUnavailable={()=>setWebgl(false)}/> : <div className="ambient-fallback" aria-hidden="true"><span/><span/><span/></div>}
    <div id="scroll-root" ref={root} tabIndex={0} aria-label="Explore Pixel Rice. Scroll or use the arrow keys.">{SECTIONS.map(s=><div key={s.id} data-section={s.id} style={{height:`${s.units*100}svh`}}/>)}
      {webgl&&!calm && <a ref={projectLink} className="project-artwork-link" hidden href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} website (opens in a new tab)`}/>}
      {calm && section===2 && <div className="fallback-project-media"><a href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} website (opens in a new tab)`}><ProjectMedia project={project}/></a></div>}
    </div>
    <div id="overlay" ref={overlay}>
      <header className="site-header">
        <button className="wordmark interactive" aria-label="Pixel Rice home" onClick={()=>go('founder')}><RiceMark/><span>pixel rice<span className="wordmark-dot">✳</span></span></button>
        <span className="header-descriptor">INDEPENDENT DESIGN<br/>& TECHNOLOGY STUDIO</span>
        <div className="header-actions interactive"><button className="contact-link" onClick={()=>setContact(true)}>Let’s talk <span>↗</span></button><button className={`menu-toggle ${menu?'is-open':''}`} aria-expanded={menu} aria-label={menu?'Close navigation':'Open navigation'} onClick={()=>setMenu(!menu)}><span/><span/></button></div>
      </header>

      <section className="scene-overlay founder-scene" data-scene="founder" aria-label="Meet the studio">
        <div className="hero-light" aria-hidden="true"/><span className="hero-coordinate" aria-hidden="true">DESIGN / TECHNOLOGY / PEOPLE</span>
        <div className={`founder-image ${founderIndex>=0?'has-focus':''}`} aria-hidden={founderIndex>=0}>
          <img src={assetPath('/assets/founders/founders.webp')} alt="Pixel Rice founders: Deepan, Junes and Shikhar" fetchPriority="high" width="1536" height="1024"/>
        </div>
        <div className={`founder-portraits ${founderIndex>=0?'is-focused':''}`} aria-hidden={founderIndex<0}>
          {founders.map((founder,index)=>{
            const active=index===founderIndex;
            const others=founders.map((_,i)=>i).filter(i=>i!==founderIndex);
            const slot=active?'center':others.indexOf(index)===0?'left':'right';
            return <img key={founder.name} className={`founder-person ${active?'is-active':''}`} data-slot={slot}
              src={assetPath(`/assets/founders/${founder.name.toLowerCase()}-portrait.webp`)} alt={`${founder.name}, ${founder.role}`}
              width="1024" height="1536" decoding="async"/>;
          })}
        </div>
        <div className="hero-copy">
          <span className="eyebrow"><span className="small-star">✳</span> A SHARED APPETITE FOR THE UNEXPECTED</span>
          <h1 className={founderIndex>=0?'has-founder':''}>{founderIndex<0?<><span className="hero-first-line">Small grains.</span><em className="hero-second-line">Big ideas.</em></>:<><span>{founders[founderIndex].name}<sup>{founders[founderIndex].role}</sup></span><em className="founder-line">{founders[founderIndex].line}</em></>}</h1>
          <p className="hero-description">{founderIndex<0?site.description:founders[founderIndex].description}</p>
          <button className="text-button hero-work interactive" onClick={()=>toProject(0)}>A taste of our work <span>↗</span></button>
        </div>
        <div className="founder-caption"><span>THREE MINDS. ONE STUDIO.</span><div>Deepan <i>·</i> Junes <i>·</i> Shikhar</div></div>
        <div className="hero-bottom"><button className="scroll-invite interactive" onClick={()=>scrollEngine.scrollToProgress('founder',.34)}><span className="scroll-circle">↓</span><span>SCROLL FOR<br/>THE GOOD STUFF</span></button><p>Good things start<br/>with a little curiosity.</p><span className="chapter-mark">THE STUDIO <i>01 / 06</i></span></div>
        <div className="founder-takeover" aria-hidden="true">pixel rice<span>DESIGN · BUILD · GROW</span></div>
      </section>

      <section className="scene-overlay identity-scene" data-scene="identity" aria-label="Our approach">
        <span className="eyebrow">DIFFERENT INGREDIENTS. ONE SHARED VISION.</span>
        <h2 className="studio-statement"><span>Different</span><em>ingredients.</em><span className="shared-vision">One shared vision.</span></h2><p className="studio-manifesto">Thoughtfully made. Unexpectedly good.</p>
        <div className="identity-bottom"><p>A small independent studio at the intersection of design and technology. We bring the curiosity. You bring the ambition. Together, we make something worth experiencing.</p><div className="service-list"><span>Brand & digital design</span><span>Websites & development</span><span>Interactive experiences</span></div></div>
      </section>

      <section id="projects" className="scene-overlay projects-scene" data-scene="projects" aria-label="Selected projects">
        <div className="project-heading"><span className="eyebrow">A FEW THINGS WE’VE MADE</span><p>Selected <em>work.</em><span className="work-count">01—05</span></p></div>
        {project && <div ref={projectCaption} className="project-caption" data-project={projectIndex}>
          <span className="project-number" aria-hidden="true">{String(projectIndex+1).padStart(2,'0')}</span><span className="eyebrow">{project.category}</span><h2><a className="interactive" href={project.liveUrl} target="_blank" rel="noopener noreferrer">{project.title}<span aria-hidden="true">↗</span><span className="sr-only"> website (opens in a new tab)</span></a></h2>
          <p>{project.description}</p><span className="project-status">{project.status}</span><div className="project-actions"><a className="text-button interactive" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit website <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a><button className="project-details-button interactive" onClick={()=>setProjectOpen(projectIndex)}>Project details</button></div>
        </div>}
        <div className="project-bottom"><span className="food-footnote">FIVE PROJECTS. DIFFERENT POSSIBILITIES.<br/>SCROLL TO EXPLORE. CLICK TO ENTER.</span><div className="project-control interactive"><button aria-label="Previous project" disabled={projectIndex===0} onClick={()=>toProject(Math.max(0,projectIndex-1))}>←</button><span><b>{String(projectIndex+1).padStart(2,'0')}</b><i>/ {String(projects.length).padStart(2,'0')}</i></span><button aria-label="Next project" disabled={projectIndex===projects.length-1} onClick={()=>toProject(Math.min(projects.length-1,projectIndex+1))}>→</button><div className="project-progress"/></div></div>
      </section>

      <section className="scene-overlay reviews-scene" data-scene="reviews" aria-label="The people behind Pixel Rice"><PeopleDepth/></section>

      <section className="scene-overlay brand-scene" data-scene="brand" aria-label="Pixel Rice identity"><span className="eyebrow">SMALL DETAILS. A WORLD OF DIFFERENCE.</span><RiceMark className="brand-mark"/><h2>pixel rice</h2><p>{site.tagline}</p></section>

      <section className="scene-overlay contact-scene" data-scene="contact" aria-label="Contact Pixel Rice">
        <span className="eyebrow">GOOD PEOPLE. GOOD CHEMISTRY.</span><h2>Let’s make<br/><em>something good.</em></h2><p className="conversation-note">The best work starts with a good conversation.</p><div className="conversation-actions"><button className="conversation-primary interactive" onClick={()=>setContact(true)}>Start a conversation <span>↗</span></button><button className="text-button interactive" onClick={()=>toProject(0)}>See our work <span>→</span></button></div>
        <div className="contact-footer"><RiceMark/><span>© {new Date().getFullYear()} Pixel Rice</span><span>Made with a little extra flavour.</span><button className="interactive" onClick={()=>go('founder')}>Back to the top ↑</button></div>
      </section>

      <div className="chapter-nav interactive is-visible" aria-label="Section navigation">{[['founder','Studio'],['projects','Work'],['reviews','People'],['contact','Contact']].map(([id,label])=><button key={id} onClick={()=>go(id as SectionId)} aria-current={(SECTIONS[section]?.id===id||(id==='founder'&&section===1))?'location':undefined} className={(SECTIONS[section]?.id===id||(id==='founder'&&section===1))?'active':''}>{label}</button>)}</div>
      <div className="global-progress" aria-hidden="true"/>
      <button className="experience-toggle interactive" aria-pressed={calm} disabled={systemCalm} onClick={()=>setSimple(!simple)}>{systemCalm?'Reduced motion':simple?'Immersive view':'Simple view'} <span>◌</span></button>
    </div>
    {menu && <NavigationDialog close={()=>setMenu(false)} navigate={go}/>}
    {contact && <ContactDialog close={()=>setContact(false)}/>}
    {projectOpen!==null && <ProjectDialog project={projects[projectOpen]} close={()=>setProjectOpen(null)}/>}
    <noscript><div className="noscript-content"><h1>Pixel Rice</h1><p>{site.description}</p><h2>Selected work</h2>{projects.map(p=><article key={p.id}><h3>{p.title}</h3><p>{p.description}</p>{p.liveUrl&&<a href={p.liveUrl}>Visit project</a>}</article>)}<p>Enable JavaScript to explore the interactive studio.</p></div></noscript>
  </main>;
}
