import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'
import { HoverScramble } from './Scramble'
import { scrollTo } from '../lib/scroll'
import { PLAYER } from '../data'
import { useT, LANGS, Lang } from '../i18n'

// Fixed HUD chrome: hairlines, mono labels, clock, scene index, progress.

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Taipei',
      hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

function LangMenu() {
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const [open, setOpen] = useState(false)
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0]

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [open])

  return (
    <div className="hud-lang">
      <button
        className="hud-lang-btn mono"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
        data-cursor="link"
        aria-label="Change language"
      >
        <span className="hud-lang-globe" aria-hidden>◍</span>
        {current.short}
      </button>
      {open && (
        <div className="hud-lang-menu" onClick={(e) => e.stopPropagation()}>
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`hud-lang-opt ${l.code === lang ? 'active' : ''}`}
              lang={l.code}
              onClick={() => {
                setLang(l.code as Lang)
                setOpen(false)
              }}
            >
              <span className="hud-lang-opt-native">{l.native}</span>
              <span className="hud-lang-opt-short mono">{l.short}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HUD() {
  const activeScene = useStore((s) => s.activeScene)
  const loaded = useStore((s) => s.loaded)
  const t = useT()
  const time = useClock()
  const progress = useRef<HTMLDivElement>(null)

  const nav = [
    { label: t.navWork, id: '#work' },
    { label: t.navExperience, id: '#experience' },
    { label: t.navAbout, id: '#about' },
    { label: t.navContact, id: '#contact' },
  ]
  const sceneNames = [t.sceneHero, t.navWork, t.navExperience, t.navAbout, t.navContact]

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) {
        progress.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`hud ${loaded ? 'show' : ''}`}>
      <div className="hud-progress" aria-hidden>
        <div ref={progress} className="hud-progress-fill" />
      </div>

      <header className="hud-top">
        <button className="hud-brand mono" onClick={() => scrollTo(0)} data-cursor="link">
          DG<span className="hud-brand-dim">®</span> — PORTFOLIO
        </button>
        <nav className="hud-nav" aria-label="Primary">
          {nav.map((n) => (
            <button key={n.id} className="hud-link mono" onClick={() => scrollTo(n.id)}>
              <HoverScramble text={n.label} />
            </button>
          ))}
        </nav>
        <div className="hud-meta mono">
          <LangMenu />
          <span className="hud-clock">KHH {time}</span>
        </div>
      </header>

      <footer className="hud-bottom">
        <div className="hud-scene mono">
          <span className="hud-scene-num">{String(activeScene + 1).padStart(2, '0')}</span>
          <span className="hud-scene-sep">/</span>
          <span>{sceneNames[activeScene]}</span>
        </div>
        <div className="hud-avail mono">
          <span className="hud-avail-dot" />
          {t.openToWork}
        </div>
        <div className="hud-hint mono">
          <a href={PLAYER.github} target="_blank" rel="noreferrer" className="hud-gh">
            GITHUB ↗
          </a>
          <span className="hud-scroll">{t.scroll}</span>
        </div>
      </footer>
    </div>
  )
}
