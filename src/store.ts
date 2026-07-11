import { create } from 'zustand'
import { Lang, DEFAULT_LANG, LANG_STORAGE_KEY, detectLang } from './i18n/config'

// ── UI state ──────────────────────────────────────────────────────────────

// Read a previously chosen language (returns null on first-ever visit)
function storedLang(): Lang | null {
  try {
    const v = localStorage.getItem(LANG_STORAGE_KEY)
    return v ? (v as Lang) : null
  } catch {
    return null
  }
}

export type Theme = 'dark' | 'light'
const THEME_STORAGE_KEY = 'dg-portfolio-theme'

function storedTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* storage blocked */
  }
  return 'dark'
}

// Reflect the theme on <html data-theme> so CSS variables switch.
export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
}

interface UIState {
  loaded: boolean
  activeScene: number
  activeProject: number
  boardProject: number | null // which project's evidence board is open
  lang: Lang
  langChosen: boolean // has the visitor picked a language (splash dismissed)?
  playingAudio: number | null // index of the project whose intro is playing
  audioLoading: number | null // index whose clip is currently loading
  theme: Theme
  setLoaded: (v: boolean) => void
  setActiveScene: (i: number) => void
  setActiveProject: (i: number) => void
  openBoard: (i: number) => void
  closeBoard: () => void
  chooseLang: (lang: Lang) => void
  setLang: (lang: Lang) => void
  toggleAudio: (i: number) => void
  stopAudio: () => void
  toggleTheme: () => void
}

// A single shared <audio> element for the spoken project intros.
let audioEl: HTMLAudioElement | null = null

export const useStore = create<UIState>((set, get) => {
  const saved = storedLang()

  const halt = () => {
    if (audioEl) {
      audioEl.pause()
      audioEl.src = ''
      audioEl = null
    }
  }

  return {
    loaded: false,
    activeScene: 0,
    activeProject: 0,
    boardProject: null,
    // suggest the browser's language on the splash, but don't commit it
    lang: saved ?? detectLang() ?? DEFAULT_LANG,
    langChosen: saved !== null,
    playingAudio: null,
    audioLoading: null,
    theme: storedTheme(),
    setLoaded: (v) => set({ loaded: v }),
    setActiveScene: (i) => set({ activeScene: i }),
    setActiveProject: (i) => {
      // a different card centred → stop any playing intro
      if (get().activeProject !== i) {
        halt()
        set({ playingAudio: null, audioLoading: null })
      }
      set({ activeProject: i })
    },
    openBoard: (i) => set({ boardProject: i }),
    closeBoard: () => {
      halt()
      set({ boardProject: null, playingAudio: null, audioLoading: null })
    },
    chooseLang: (lang) => {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lang)
      } catch {
        /* storage blocked — fine */
      }
      document.documentElement.lang = lang
      set({ lang, langChosen: true })
    },
    setLang: (lang) => {
      // clips are language-specific — stop playback when the language changes
      halt()
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lang)
      } catch {
        /* storage blocked — fine */
      }
      document.documentElement.lang = lang
      set({ lang, playingAudio: null, audioLoading: null })
    },
    stopAudio: () => {
      halt()
      set({ playingAudio: null, audioLoading: null })
    },
    toggleAudio: (i) => {
      const { playingAudio, lang } = get()
      halt()
      if (playingAudio === i) {
        set({ playingAudio: null, audioLoading: null })
        return
      }
      const a = new Audio(`${import.meta.env.BASE_URL}audio/p${i}-${lang}.mp3`)
      audioEl = a
      set({ audioLoading: i, playingAudio: null })
      const done = () => {
        if (audioEl === a) {
          audioEl = null
          set({ playingAudio: null, audioLoading: null })
        }
      }
      a.onplaying = () => {
        if (audioEl === a) set({ playingAudio: i, audioLoading: null })
      }
      a.onended = done
      a.onerror = done
      a.play().catch(done)
    },
    toggleTheme: () => {
      const theme: Theme = get().theme === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme)
      } catch {
        /* storage blocked */
      }
      applyTheme(theme)
      set({ theme })
    },
  }
})

// ── Carousel state — mutated at pointer-speed, read per-frame in WebGL ────
// (kept outside React/zustand on purpose: no re-renders on drag)

export const carousel = {
  target: 0,
  current: 0,
  velocity: 0,
  hovered: -1,
  dragging: false,
  gap: 3.7,
}

export const SCENE_NAMES = ['HERO', 'WORK', 'EXPERIENCE', 'ABOUT', 'CONTACT']
