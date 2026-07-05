import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store'

// Percentage preloader — counts up, then the curtain lifts.

export default function Loader() {
  const [pct, setPct] = useState(0)
  const [done, setDone] = useState(false)
  const [gone, setGone] = useState(false)
  const setLoaded = useStore((s) => s.setLoaded)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const t0 = performance.now()
    const DUR = 1700
    // rAF freezes in background tabs — this fallback finishes the load anyway
    const fallback = window.setTimeout(() => {
      setPct(100)
      setDone(true)
      setLoaded(true)
      setTimeout(() => setGone(true), 1000)
    }, DUR + 1500)
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / DUR)
      // ease-out with a believable stall around 80%
      const eased = p < 0.8 ? p * 1.05 : 0.84 + (p - 0.8) * 0.8
      setPct(Math.min(100, Math.floor(eased * 100)))
      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        window.clearTimeout(fallback)
        setPct(100)
        setTimeout(() => {
          setDone(true)
          setLoaded(true)
          setTimeout(() => setGone(true), 1000)
        }, 250)
      }
    }
    requestAnimationFrame(tick)
    return () => window.clearTimeout(fallback)
  }, [setLoaded])

  if (gone) return null

  return (
    <div className={`loader ${done ? 'done' : ''}`} aria-hidden>
      <div className="loader-inner">
        <span className="loader-label mono">DEEPAN GOSWAMI — PORTFOLIO © 2026</span>
        <span className="loader-pct">{String(pct).padStart(3, '0')}</span>
        <div className="loader-bar">
          <div className="loader-bar-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  )
}
