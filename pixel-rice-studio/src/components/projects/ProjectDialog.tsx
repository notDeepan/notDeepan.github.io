'use client';

import { useEffect, useRef } from 'react';
import type { Project } from '@/data/projects';
import { scrollEngine } from '@/lib/scrollEngine';
import ProjectMedia from './ProjectMedia';

type ProjectDialogProps = { project: Project; close: () => void };

function isOutside(dialog: HTMLDialogElement, x: number, y: number) {
  const rect = dialog.getBoundingClientRect();
  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
}

function publicUrl(value?: string) {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : undefined;
  } catch {
    return undefined;
  }
}

export default function ProjectDialog({ project, close }: ProjectDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const backdropPointerDown = useRef(false);
  const titleId = `project-${project.id}-title`;
  const descriptionId = `project-${project.id}-description`;
  const liveUrl = publicUrl(project.liveUrl);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const trigger = document.activeElement;
    const ownsScrollLock = !scrollEngine.isLocked;
    if (ownsScrollLock) scrollEngine.lock();
    if (!element.open) element.showModal();
    return () => {
      if (element.open) element.close();
      if (ownsScrollLock) scrollEngine.unlock();
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={dialog}
      className="modal project-modal"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={event => { event.preventDefault(); close(); }}
      onPointerDown={event => {
        backdropPointerDown.current = event.target === event.currentTarget &&
          isOutside(event.currentTarget, event.clientX, event.clientY);
      }}
      onClick={event => {
        if (backdropPointerDown.current && event.target === event.currentTarget &&
          isOutside(event.currentTarget, event.clientX, event.clientY)) close();
        backdropPointerDown.current = false;
      }}
    >
      <article className="modal-shell">
        <button type="button" className="round-button modal-close" onClick={close} aria-label="Close project" autoFocus>×</button>
        <div className="project-detail">
          <span className="eyebrow">SELECTED WORK · {project.category}</span>
          <h2 id={titleId}>{project.title}</h2>
        </div>
        {liveUrl ? <a href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} website (opens in a new tab)`}><ProjectMedia project={project} priority /></a> : <ProjectMedia project={project} priority />}
        <div className="project-detail">
          <p id={descriptionId}>{project.description}</p>
          <div className="project-meta">
            {project.status && <p className="eyebrow">{project.status}</p>}
            {project.technologies.length > 0 && (
              <ul className="project-technologies" aria-label="Technologies">
                {project.technologies.map(technology => <li className="tag" key={technology}>{technology}</li>)}
              </ul>
            )}
          </div>
          {liveUrl && (
            <nav className="project-links" aria-label="Project links">
              {liveUrl && <a className="text-button" href={liveUrl} target="_blank" rel="noopener noreferrer">Visit project <span aria-hidden="true">↗</span><span className="sr-only"> (opens in a new tab)</span></a>}
            </nav>
          )}
        </div>
      </article>
    </dialog>
  );
}
