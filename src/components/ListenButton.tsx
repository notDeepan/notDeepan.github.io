import { useStore } from '../store'
import { useT } from '../i18n'

// A "listen to this project" control — plays the pre-generated soft male
// neural-voice intro in the visitor's chosen language. Toggles play/stop.

export default function ListenButton({ index, className = '' }: { index: number; className?: string }) {
  const lang = useStore((s) => s.lang)
  const playing = useStore((s) => s.playingAudio === index)
  const loading = useStore((s) => s.audioLoading === index)
  const toggleAudio = useStore((s) => s.toggleAudio)
  const t = useT()

  return (
    <button
      className={`listen-btn mono ${playing ? 'playing' : ''} ${className}`}
      lang={lang}
      onClick={(e) => {
        e.stopPropagation()
        toggleAudio(index)
      }}
      aria-label={playing ? t.stopListen : t.listen}
    >
      <span className="listen-ic" aria-hidden>
        {loading ? (
          <span className="listen-spin" />
        ) : playing ? (
          <span className="listen-eq">
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
      {playing ? t.stopListen : t.listen}
    </button>
  )
}
