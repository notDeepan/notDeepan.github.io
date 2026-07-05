import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar'
import { useStore } from '../store'
import { GUIDE_NAME, GUIDE_ROLE, SECTIONS, PLAYER } from '../data'

// ── Chatbot-style overlay: launcher stays put, panel slides up above it ──

export default function GuideWidget() {
  const widgetOpen = useStore((s) => s.widgetOpen)
  const muted = useStore((s) => s.muted)
  const tourStarted = useStore((s) => s.tourStarted)
  const activeSection = useStore((s) => s.activeSection)
  const bubbleText = useStore((s) => s.bubbleText)
  const bubbleId = useStore((s) => s.bubbleId)
  const toggleWidget = useStore((s) => s.toggleWidget)
  const toggleMute = useStore((s) => s.toggleMute)
  const startTour = useStore((s) => s.startTour)
  const nextSection = useStore((s) => s.nextSection)

  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!bubbleText) return
    setShown('')
    setDone(false)
    let i = 0
    if (timer.current) window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      i += 2
      setShown(bubbleText.slice(0, i))
      if (i >= bubbleText.length) {
        setDone(true)
        if (timer.current) window.clearInterval(timer.current)
      }
    }, 22)
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [bubbleText, bubbleId])

  const isLast = activeSection >= SECTIONS.length - 1
  const nextLabel = !isLast ? SECTIONS[activeSection + 1].label : null

  return (
    <div className="guide">
      <div className={`guide-panel ${widgetOpen ? 'open' : ''}`} role="dialog" aria-label="Portfolio guide">
        <div className="guide-head">
          <div className="guide-id">
            <span className="guide-name">{GUIDE_NAME}</span>
            <span className="guide-role">
              <span className="guide-status" /> {GUIDE_ROLE}
            </span>
          </div>
          <div className="guide-controls">
            <button
              className="guide-ctl"
              onClick={toggleMute}
              title={muted ? 'Unmute voice' : 'Mute voice'}
              aria-label={muted ? 'Unmute voice' : 'Mute voice'}
            >
              {muted ? (
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
              )}
            </button>
            <button className="guide-ctl" onClick={toggleWidget} title="Minimize" aria-label="Minimize guide">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>

        <div className="guide-body">
          <p className="guide-text">
            {shown}
            {!done && <span className="guide-caret">▎</span>}
          </p>
        </div>

        <div className="guide-foot">
          <span className="guide-progress">
            {String(activeSection + 1).padStart(2, '0')} / {String(SECTIONS.length).padStart(2, '0')}
          </span>
          {!tourStarted ? (
            <button className="guide-next" onClick={startTour}>
              Begin walkthrough
            </button>
          ) : !isLast ? (
            <button className="guide-next" onClick={nextSection}>
              Next · {nextLabel} →
            </button>
          ) : (
            <a className="guide-next" href={`mailto:${PLAYER.email}?subject=Regarding your portfolio`}>
              Email Deepan →
            </a>
          )}
        </div>
      </div>

      <button
        className={`guide-launcher ${widgetOpen ? '' : 'attention'}`}
        onClick={toggleWidget}
        aria-label={widgetOpen ? 'Minimize portfolio guide' : 'Open portfolio guide'}
      >
        <div className="guide-avatar">
          <Avatar />
        </div>
        <span className="guide-online" />
      </button>
    </div>
  )
}
