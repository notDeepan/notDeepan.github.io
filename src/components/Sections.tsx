import { useRef, useState } from 'react'
import { useStore, carousel } from '../store'
import { Scramble, HoverScramble } from './Scramble'
import { scrollTo } from '../lib/scroll'
import {
  PLAYER,
  HERO_STATS,
  MARQUEE,
  LANGUAGES,
  EXPERIENCE,
  CAROUSEL_PROJECTS,
  SKILL_GROUPS,
  EDUCATION,
  CERTS,
} from '../data'

import { PLANE_W } from './Carousel3D'

// world-space math shared with the WebGL carousel
const VIEW_H = 2 * 9 * Math.tan((45 * Math.PI) / 360) // camera z=9, fov=45

function carouselMetrics() {
  const aspect = window.innerWidth / window.innerHeight
  const vwWorld = VIEW_H * aspect
  const scale = Math.min(1, vwWorld / 10.5)
  return { vwWorld, scale, wpp: VIEW_H / window.innerHeight }
}

// ── HERO ──────────────────────────────────────────────────────────────────

export function Hero() {
  const loaded = useStore((s) => s.loaded)

  return (
    <section id="hero" data-scene="0" className="hero">
      <div className="hero-frame">
        <p className="hero-eyebrow mono">
          <Scramble text="PORTFOLIO © 2026 — KAOHSIUNG, TAIWAN" play={loaded} speed={20} />
        </p>
        <h1 className="mega" aria-label="Deepan Goswami">
          <span className="mega-line">
            <span className="mega-word">DEEPAN</span>
          </span>
          <span className="mega-line">
            <span className="mega-word accent">GOSWAMI</span>
          </span>
        </h1>
        <div className="hero-sub mono">
          <span>SENIOR ANALYST — DIGITAL & DATA TRANSFORMATION</span>
          <span className="hero-sub-right">MBA @ NSYSU · EX-HCL TECHNOLOGIES</span>
        </div>
        <div className="hero-stats">
          {HERO_STATS.map((s) => (
            <div className="hero-stat" key={s.label}>
              <span className="hero-stat-value">
                {s.value}
                {s.unit && <em>{s.unit}</em>}
              </span>
              <span className="hero-stat-label mono">{s.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── WORK (WebGL carousel lives behind; this owns input + caption) ────────

export function Work() {
  const activeProject = useStore((s) => s.activeProject)
  const p = CAROUSEL_PROJECTS[activeProject]
  const n = CAROUSEL_PROJECTS.length
  const drag = useRef({ on: false, startX: 0, startTarget: 0, moved: 0 })

  const goTo = (i: number) => {
    const idx = Math.max(0, Math.min(n - 1, i))
    carousel.target = idx * carousel.gap
    // update the caption immediately — don't wait for the lerp to cross over
    useStore.getState().setActiveProject(idx)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    drag.current = { on: true, startX: e.clientX, startTarget: carousel.target, moved: 0 }
    carousel.dragging = true
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.on) return
    const dx = e.clientX - d.startX
    d.moved = Math.max(d.moved, Math.abs(dx))
    const { wpp, scale } = carouselMetrics()
    carousel.target = Math.max(
      -0.6,
      Math.min((n - 1) * carousel.gap + 0.6, d.startTarget - (dx * wpp * 1.25) / scale),
    )
  }

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d.on) return
    d.on = false
    carousel.dragging = false

    if (d.moved < 8) {
      // click: focus the clicked card, open it if already centered
      const { vwWorld, scale } = carouselMetrics()
      const worldX = (e.clientX / window.innerWidth - 0.5) * vwWorld
      const localX = worldX / scale
      const idx = Math.round((localX + carousel.current) / carousel.gap)
      if (idx >= 0 && idx < n && Math.abs(localX - (idx * carousel.gap - carousel.current)) < PLANE_W / 2 + 0.2) {
        const centered = Math.abs(idx * carousel.gap - carousel.current) < carousel.gap / 2
        if (centered) {
          useStore.getState().openBoard(idx)
        } else {
          goTo(idx)
        }
      }
    } else {
      // snap to nearest card
      goTo(Math.round(carousel.target / carousel.gap))
    }
  }

  return (
    <section id="work" data-scene="1" className="work">
      <div className="work-head">
        <span className="sec-tag mono">01 — SELECTED WORK · 2026 → 2023</span>
        <span className="sec-tag mono dim">DRAG TO EXPLORE / CLICK A CARD TO OPEN ITS CASE FILE</span>
      </div>

      <div
        className="work-stage"
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      <div className="work-caption" key={activeProject}>
        <div className="work-caption-left">
          <span className="work-cat mono" style={{ color: p.color }}>
            {p.category}
          </span>
          <h3 className="work-name">{p.name.toUpperCase()}</h3>
        </div>
        <div className="work-caption-right">
          <p className="work-desc">{p.desc}</p>
          <div className="work-cta-row">
            <button
              className="work-cta mono"
              onClick={() => useStore.getState().openBoard(useStore.getState().activeProject)}
            >
              OPEN CASE FILE ▸
            </button>
            {p.live && (
              <a className="work-cta mono ghost" href={p.live} target="_blank" rel="noreferrer">
                LIVE SITE ↗
              </a>
            )}
            {!p.live && p.repo && (
              <a className="work-cta mono ghost" href={p.repo} target="_blank" rel="noreferrer">
                SOURCE ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="work-nav">
        <button
          className="work-arrow mono"
          onClick={() => goTo(useStore.getState().activeProject - 1)}
          aria-label="Previous project"
        >
          ←
        </button>
        <span className="work-index mono">
          {String(activeProject + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </span>
        <button
          className="work-arrow mono"
          onClick={() => goTo(useStore.getState().activeProject + 1)}
          aria-label="Next project"
        >
          →
        </button>
      </div>
    </section>
  )
}

// ── EXPERIENCE ────────────────────────────────────────────────────────────

export function ExperienceSec() {
  const [open, setOpen] = useState(0)

  return (
    <section id="experience" data-scene="2" className="xp">
      <div className="sec-header">
        <span className="sec-tag mono">02 — EXPERIENCE</span>
        <h2 className="sec-mega">
          WHERE I'VE
          <br />
          <span className="accent">DELIVERED</span>
        </h2>
      </div>
      <div className="xp-list">
        {EXPERIENCE.map((x, i) => (
          <div
            key={x.role}
            className={`xrow ${open === i ? 'open' : ''}`}
            onMouseEnter={() => setOpen(i)}
            onClick={() => setOpen(i)}
          >
            <div className="xrow-head">
              <span className="xrow-idx mono">{String(i + 1).padStart(2, '0')}</span>
              <div className="xrow-main">
                <h3 className="xrow-role">
                  <HoverScramble text={x.role.toUpperCase()} />
                </h3>
                <span className="xrow-org mono">{x.org.toUpperCase()}</span>
              </div>
              <span className="xrow-badge mono">{x.badge}</span>
              <span className="xrow-period mono">{x.period.toUpperCase()}</span>
            </div>
            <div className="xrow-detail">
              <div className="xrow-detail-inner">
                <ul>
                  {x.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── ABOUT (statement + skills + education) ───────────────────────────────

export function AboutSec() {
  return (
    <section id="about" data-scene="3" className="about">
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <div className="marquee-group" key={dup}>
              {MARQUEE.map((m) => (
                <span className="marquee-item mono" key={m}>
                  {m.toUpperCase()} <span className="marquee-star">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="sec-header">
        <span className="sec-tag mono">03 — ABOUT</span>
        <h2 className="sec-mega">
          ANALYST BY TRAINING,
          <br />
          <span className="accent">BUILDER</span> BY HABIT
        </h2>
      </div>

      <div className="about-grid">
        <p className="about-statement">{PLAYER.summary}</p>

        <div className="about-side">
          <div className="about-block">
            <span className="about-block-title mono">LANGUAGES</span>
            {LANGUAGES.map((l) => (
              <div className="about-lang mono" key={l.name}>
                <span>{l.name.toUpperCase()}</span>
                <span className="dim">{l.level.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div className="about-block">
            <span className="about-block-title mono">CERTIFICATIONS</span>
            {CERTS.map((c) => (
              <div className="about-lang mono" key={c.name}>
                <span>{c.name.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {SKILL_GROUPS.map((g) => (
          <div className="skill-col" key={g.title}>
            <span className="about-block-title mono">{g.title.toUpperCase()}</span>
            <div className="skill-chips">
              {g.skills.map((s) => (
                <span className="chip mono" key={s.name}>
                  {s.name.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="edu-strip">
        {EDUCATION.map((e) => (
          <div className="edu-item" key={e.school}>
            <span className="edu-period mono">{e.period}</span>
            <h3 className="edu-school">{e.school.toUpperCase()}</h3>
            <span className="edu-degree mono">{e.degree.toUpperCase()}</span>
            <span className="edu-detail mono dim">{e.detail.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────

export function ContactSec() {
  return (
    <section id="contact" data-scene="4" className="contactsec">
      <div className="sec-header">
        <span className="sec-tag mono">04 — CONTACT</span>
        <h2 className="sec-mega">
          LET'S BUILD
          <br />
          SOMETHING <span className="accent">MEASURABLE</span>
        </h2>
      </div>

      <a className="contact-mail" href={`mailto:${PLAYER.email}?subject=Regarding your portfolio`}>
        <span className="contact-mail-text">{PLAYER.email.toUpperCase()}</span>
        <span className="contact-mail-arrow">↗</span>
      </a>

      <div className="contact-links mono">
        <a href={PLAYER.linkedin} target="_blank" rel="noreferrer">
          <HoverScramble text="LINKEDIN ↗" />
        </a>
        <a href={PLAYER.github} target="_blank" rel="noreferrer">
          <HoverScramble text="GITHUB ↗" />
        </a>
        <a href={`tel:${PLAYER.phone.replace(/\s/g, '')}`}>
          <HoverScramble text={PLAYER.phone.replace(/\s/g, ' ')} />
        </a>
        <span className="dim">KAOHSIUNG, TAIWAN</span>
      </div>

      <footer className="site-footer mono">
        <span>© 2026 DEEPAN GOSWAMI</span>
        <button className="dim" onClick={() => scrollTo(0)} data-cursor="link">
          BACK TO TOP ↑
        </button>
        <span className="dim">REACT + THREE.JS / WEBGL</span>
      </footer>
    </section>
  )
}
