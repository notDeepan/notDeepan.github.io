'use client';
import { useState } from 'react';
import { founders } from '@/data/site';
import { assetPath } from '@/lib/assetPath';

export default function PeopleDepth() {
  const [active, setActive] = useState(0);
  const person = founders[active];
  return <div className="people-depth">
    <div className="people-intro"><span className="eyebrow">THE PEOPLE BEHIND THE PIXELS</span><h2>Three minds.<br/><em>One studio.</em></h2></div>
    <div className="people-stage" aria-hidden="true">
      {founders.map((founder, i) => <div key={founder.name} className={`people-layer ${i === active ? 'is-active' : ''}`} style={{'--person-offset': [0,-1,1][i], '--portrait-grain': `url(${assetPath('/assets/portrait-grain.svg')})`} as React.CSSProperties}>
        <img src={assetPath(`/assets/founders/${founder.name.toLowerCase()}-portrait.webp`)} alt="" width="1024" height="1536" loading="lazy" decoding="async"/>
      </div>)}
    </div>
    <div className="people-information">
      <div className="people-select interactive" role="group" aria-label="Meet the founders">
        {[1,0,2].map(i => {const founder=founders[i];return <button key={founder.name} aria-pressed={i === active} onPointerEnter={e => {if(e.pointerType === 'mouse')setActive(i);}} onFocus={() => setActive(i)} onClick={() => setActive(i)} aria-controls="person-description"><span>{founder.name}</span><small>{founder.role}</small><i aria-hidden="true">↗</i></button>;})}
      </div>
      <div id="person-description" className="person-description" aria-live="polite" aria-atomic="true"><span className="eyebrow">{person.name} · {person.role}</span><h3>{person.line}</h3><p>{person.description}</p></div>
    </div>
  </div>;
}
