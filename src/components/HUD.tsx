import { useEffect, useRef, useState } from 'react'
import { useStore, SCENE_NAMES } from '../store'
import { HoverScramble } from './Scramble'
import { scrollTo } from '../lib/scroll'
import { PLAYER } from '../data'

// Fixed HUD chrome: hairlines, mono labels, clock, scene index, progress.

const NAV = [
  { label: 'WORK', id: '#work' },
  { label: 'EXPERIENCE', id: '#experience' },
  { label: 'ABOUT', id: '#about' },
  { label: 'CONTACT', id: '#contact' },
]

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

export default function HUD() {
  const activeScene = useStore((s) => s.activeScene)
  const loaded = useStore((s) => s.loaded)
  const time = useClock()
  const progress = useRef<HTMLDivElement>(null)

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
          {NAV.map((n) => (
            <button key={n.label} className="hud-link mono" onClick={() => scrollTo(n.id)}>
              <HoverScramble text={n.label} />
            </button>
          ))}
        </nav>
        <div className="hud-meta mono">
          <span className="hud-clock">KHH {time}</span>
        </div>
      </header>

      <footer className="hud-bottom">
        <div className="hud-scene mono">
          <span className="hud-scene-num">{String(activeScene + 1).padStart(2, '0')}</span>
          <span className="hud-scene-sep">/</span>
          <span>{SCENE_NAMES[activeScene]}</span>
        </div>
        <div className="hud-avail mono">
          <span className="hud-avail-dot" />
          OPEN TO WORK — JUL 2026 · TAIWAN & APAC
        </div>
        <div className="hud-hint mono">
          <a href={PLAYER.github} target="_blank" rel="noreferrer" className="hud-gh">
            GITHUB ↗
          </a>
          <span className="hud-scroll">SCROLL</span>
        </div>
      </footer>
    </div>
  )
}
