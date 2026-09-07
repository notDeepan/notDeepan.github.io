'use client';

import { useEffect, useState } from 'react';
import type { Project } from '@/data/projects';

type ProjectMediaProps = {
  project: Project;
  className?: string;
  priority?: boolean;
};

/** Real project media when available; explicitly labeled abstract artwork otherwise. */
export default function ProjectMedia({ project, className = '', priority = false }: ProjectMediaProps) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [project.cover]);
  const coverAvailable = Boolean(project.cover) && !failed;

  if (coverAvailable) {
    return (
      <figure className={`project-cover ${className}`}>
        {/* The supplied covers are local optimized project assets. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover}
          alt={`${project.coverKind==='screenshot'?'Website screenshot':'Original portfolio artwork'} for ${project.title}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => setFailed(true)}
        />
        <figcaption className="cover-note">{project.coverKind==='screenshot'?'Website screenshot':'Original portfolio artwork'}</figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={`project-cover project-cover-abstract ${className}`}
      style={{
        position: 'relative',
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 80% 20%, #74774666, transparent 56%), linear-gradient(125deg, #1b2018, #33352a)',
      }}
    >
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {[0, 1, 2, 3].map(index => (
          <span key={index} style={{
            position: 'absolute',
            width: `${54 + index * 13}%`,
            height: `${26 + index * 8}%`,
            left: `${47 - index * 8}%`,
            top: `${26 - index * 2}%`,
            border: '1px solid #d6d3a94d',
            borderRadius: '50%',
            transform: 'rotate(-34deg)',
          }} />
        ))}
        <span style={{ position: 'absolute', width: '13%', height: '5%', left: '67%', top: '34%', borderRadius: '50%', background: '#dad8b8', boxShadow: '0 10px 44px #0008', transform: 'rotate(-34deg)' }} />
      </div>
      <figcaption style={{ position: 'absolute', inset: 'auto 7% 10%', color: '#f3f1df', display: 'grid', gap: '0.8rem' }}>
        <span className="eyebrow">CONCEPT ARTWORK</span>
        <span style={{ fontSize: 'clamp(1.5rem, 4vw, 3.8rem)', lineHeight: 1.02, letterSpacing: '-0.055em' }}>{project.title}</span>
        <span className="eyebrow">{project.category}</span>
      </figcaption>
    </figure>
  );
}
