import { useState } from 'react'
import { useStore } from '../store'
import { LANGS, Lang } from '../i18n'
import { UI } from '../i18n/ui'

// First-visit language selector — shown once the loader lifts, until the
// visitor picks a language. Choice persists in localStorage.

export default function LanguageSplash() {
  const langChosen = useStore((s) => s.langChosen)
  const loaded = useStore((s) => s.loaded)
  const suggested = useStore((s) => s.lang)
  const chooseLang = useStore((s) => s.chooseLang)
  const [hover, setHover] = useState<Lang | null>(null)

  if (langChosen) return null

  const active = hover ?? suggested
  const ui = UI[active]

  return (
    <div className={`splash ${loaded ? 'show' : ''}`}>
      <div className="splash-inner">
        <span className="splash-brand mono">DEEPAN GOSWAMI — PORTFOLIO</span>
        <h2 className="splash-title" lang={active}>
          {ui.splashTitle}
        </h2>
        <div className="splash-grid">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className="splash-lang"
              onMouseEnter={() => setHover(l.code)}
              onMouseLeave={() => setHover(null)}
              onClick={() => chooseLang(l.code)}
              lang={l.code}
            >
              <span className="splash-lang-short mono">{l.short}</span>
              <span className="splash-lang-native">{l.native}</span>
              <span className="splash-lang-en mono">{l.english}</span>
            </button>
          ))}
        </div>
        <span className="splash-sub" lang={active}>
          {ui.splashSub}
        </span>
      </div>
    </div>
  )
}
