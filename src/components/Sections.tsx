import { useRef, useState } from 'react'
import { useStore, carousel } from '../store'
import { Scramble, HoverScramble } from './Scramble'
import { scrollTo } from '../lib/scroll'
import { PLAYER, HERO_STATS, MARQUEE, EXPERIENCE, CAROUSEL_PROJECTS, SKILL_GROUPS, EDUCATION } from '../data'
import { useT, useContent } from '../i18n'
import { Mega } from '../i18n/ui'
import { PLANE_W, carouselScale } from './Carousel3D'
import ListenButton from './ListenButton'

// world-space math shared with the WebGL carousel
const VIEW_H = 2 * 9 * Math.tan((45 * Math.PI) / 360) // camera z=9, fov=45

function carouselMetrics() {
  const aspect = window.innerWidth / window.innerHeight
  const vwWorld = VIEW_H * aspect
  const scale = carouselScale(vwWorld)
  return { vwWorld, scale, wpp: VIEW_H / window.innerHeight }
}

function MegaHeading({ mega }: { mega: Mega }) {
  return (
    <h2 className="sec-mega">
      {mega.pre}
      <span className="accent">{mega.accent}</span>
      {mega.post}
    </h2>
  )
}

// ── HERO ──────────────────────────────────────────────────────────────────

export function Hero() {
  const loaded = useStore((s) => s.loaded)
  const lang = useStore((s) => s.lang)
  const t = useT()

  return (
    <section id="hero" data-scene="0" className="hero">
      <div className="hero-frame">
        <div className="hero-id">
          <span className="hero-photo">
            <img src="/deepan.jpg" alt="Deepan Goswami" />
            <span className="hero-photo-dot" />
          </span>
          <div className="hero-id-text">
            <p className="hero-eyebrow mono" lang={lang}>
              <Scramble text={t.heroEyebrow} play={loaded} speed={20} key={t.heroEyebrow} />
            </p>
            <p className="hero-id-avail mono" lang={lang}>
              {t.openToWork}
            </p>
          </div>
        </div>

        <h1 className="mega" aria-label="Deepan Goswami">
          <span className="mega-line">
            <span className="mega-word">DEEPAN</span>
          </span>
          <span className="mega-line">
            <span className="mega-word accent">GOSWAMI</span>
          </span>
        </h1>

        <div className="hero-sub mono" lang={lang}>
          <span>{t.heroRole}</span>
          <span className="hero-sub-right">{t.heroMba}</span>
        </div>

        <div className="hero-stats">
          {HERO_STATS.map((s, i) => (
            <div className="hero-stat" key={i}>
              <span className="hero-stat-value">
                {s.value}
                {s.unit && <em>{s.unit}</em>}
              </span>
              <span className="hero-stat-label mono" lang={lang}>
                {t.statLabels[i]}
              </span>
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
  const lang = useStore((s) => s.lang)
  const t = useT()
  const content = useContent()
  const p = CAROUSEL_PROJECTS[activeProject]
  const cp = content.projects[activeProject]
  const n = CAROUSEL_PROJECTS.length
  const drag = useRef({ on: false, startX: 0, startTarget: 0, moved: 0 })

  const goTo = (i: number) => {
    const idx = Math.max(0, Math.min(n - 1, i))
    carousel.target = idx * carousel.gap
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
      const { vwWorld, scale } = carouselMetrics()
      const worldX = (e.clientX / window.innerWidth - 0.5) * vwWorld
      const localX = worldX / scale
      const idx = Math.round((localX + carousel.current) / carousel.gap)
      if (idx >= 0 && idx < n && Math.abs(localX - (idx * carousel.gap - carousel.current)) < PLANE_W / 2 + 0.2) {
        const centered = Math.abs(idx * carousel.gap - carousel.current) < carousel.gap / 2
        if (centered) useStore.getState().openBoard(idx)
        else goTo(idx)
      }
    } else {
      goTo(Math.round(carousel.target / carousel.gap))
    }
  }

  return (
    <section id="work" data-scene="1" className="work">
      <div className="work-head">
        <span className="sec-tag mono" lang={lang}>01 — {t.workLabel}</span>
        <span className="sec-tag mono dim" lang={lang}>{t.workHint}</span>
      </div>

      <div
        className="work-stage"
        data-cursor="drag"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />

      <div className="work-caption" key={`${activeProject}-${lang}`}>
        <div className="work-caption-left">
          <span className="work-cat mono" style={{ color: p.color }} lang={lang}>
            {cp.category}
          </span>
          <h3 className="work-name">{p.name.toUpperCase()}</h3>
        </div>
        <div className="work-caption-right">
          <p className="work-desc" lang={lang}>{cp.desc}</p>
          <div className="work-cta-row">
            <button
              className="work-cta mono"
              lang={lang}
              onClick={() => useStore.getState().openBoard(useStore.getState().activeProject)}
            >
              {t.openCase} ▸
            </button>
            <ListenButton index={activeProject} className="work-cta" />
            {p.live && (
              <a className="work-cta mono ghost" href={p.live} target="_blank" rel="noreferrer" lang={lang}>
                {t.liveSite} ↗
              </a>
            )}
            {!p.live && p.repo && (
              <a className="work-cta mono ghost" href={p.repo} target="_blank" rel="noreferrer" lang={lang}>
                {t.source} ↗
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
  const lang = useStore((s) => s.lang)
  const t = useT()
  const content = useContent()

  return (
    <section id="experience" data-scene="2" className="xp">
      <div className="sec-header">
        <span className="sec-tag mono" lang={lang}>02 — {t.expLabel}</span>
        <MegaHeading mega={t.expMega} />
      </div>
      <div className="xp-list">
        {EXPERIENCE.map((x, i) => {
          const cx = content.experience[i]
          return (
            <div
              key={i}
              className={`xrow ${open === i ? 'open' : ''}`}
              onMouseEnter={() => setOpen(i)}
              onClick={() => setOpen(i)}
            >
              <div className="xrow-head">
                <span className="xrow-idx mono">{String(i + 1).padStart(2, '0')}</span>
                <div className="xrow-main">
                  <h3 className="xrow-role" lang={lang}>
                    <HoverScramble text={cx.role.toUpperCase()} />
                  </h3>
                  <span className="xrow-org mono">{x.org.toUpperCase()}</span>
                </div>
                <span className="xrow-badge mono">{x.badge}</span>
                <span className="xrow-period mono">{x.period.toUpperCase()}</span>
              </div>
              <div className="xrow-detail">
                <div className="xrow-detail-inner">
                  <ul lang={lang}>
                    {cx.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── ABOUT (statement + skills + education) ───────────────────────────────

export function AboutSec() {
  const lang = useStore((s) => s.lang)
  const t = useT()
  const content = useContent()

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
        <span className="sec-tag mono" lang={lang}>03 — {t.aboutLabel}</span>
        <MegaHeading mega={t.aboutMega} />
      </div>

      <div className="about-grid">
        <p className="about-statement" lang={lang}>{t.aboutStatement}</p>

        <div className="about-side">
          <div className="about-block">
            <span className="about-block-title mono" lang={lang}>{t.langTitle}</span>
            {content.languages.map((l, i) => (
              <div className="about-lang mono" key={i} lang={lang}>
                <span>{l.name.toUpperCase()}</span>
                <span className="dim">{l.level.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <div className="about-block">
            <span className="about-block-title mono" lang={lang}>{t.certTitle}</span>
            {content.certs.map((c, i) => (
              <div className="about-lang mono" key={i} lang={lang}>
                <span>{c.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="skills-grid">
        {SKILL_GROUPS.map((g, gi) => (
          <div className="skill-col" key={gi}>
            <span className="about-block-title mono" lang={lang}>{t.skillTitles[gi]}</span>
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
        {EDUCATION.map((e, i) => (
          <div className="edu-item" key={i}>
            <span className="edu-period mono">{e.period}</span>
            <h3 className="edu-school">{e.school.toUpperCase()}</h3>
            <span className="edu-degree mono" lang={lang}>{content.education[i].degree.toUpperCase()}</span>
            <span className="edu-detail mono dim" lang={lang}>{content.education[i].detail.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── CONTACT ───────────────────────────────────────────────────────────────

export function ContactSec() {
  const lang = useStore((s) => s.lang)
  const t = useT()

  return (
    <section id="contact" data-scene="4" className="contactsec">
      <div className="sec-header">
        <span className="sec-tag mono" lang={lang}>04 — {t.contactLabel}</span>
        <MegaHeading mega={t.contactMega} />
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
        <button className="dim" onClick={() => scrollTo(0)} data-cursor="link" lang={lang}>
          {t.backToTop}
        </button>
        <span className="dim" lang={lang}>{t.builtWith}</span>
      </footer>
    </section>
  )
}
