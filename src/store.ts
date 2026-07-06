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

interface UIState {
  loaded: boolean
  activeScene: number
  activeProject: number
  boardProject: number | null // which project's evidence board is open
  lang: Lang
  langChosen: boolean // has the visitor picked a language (splash dismissed)?
  setLoaded: (v: boolean) => void
  setActiveScene: (i: number) => void
  setActiveProject: (i: number) => void
  openBoard: (i: number) => void
  closeBoard: () => void
  chooseLang: (lang: Lang) => void
  setLang: (lang: Lang) => void
}

export const useStore = create<UIState>((set) => {
  const saved = storedLang()
  return {
    loaded: false,
    activeScene: 0,
    activeProject: 0,
    boardProject: null,
    // suggest the browser's language on the splash, but don't commit it
    lang: saved ?? detectLang() ?? DEFAULT_LANG,
    langChosen: saved !== null,
    setLoaded: (v) => set({ loaded: v }),
    setActiveScene: (i) => set({ activeScene: i }),
    setActiveProject: (i) => set({ activeProject: i }),
    openBoard: (i) => set({ boardProject: i }),
    closeBoard: () => set({ boardProject: null }),
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
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lang)
      } catch {
        /* storage blocked — fine */
      }
      document.documentElement.lang = lang
      set({ lang })
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
