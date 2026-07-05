import { create } from 'zustand'

// ── UI state ──────────────────────────────────────────────────────────────

interface UIState {
  loaded: boolean
  activeScene: number
  activeProject: number
  boardProject: number | null // which project's evidence board is open
  setLoaded: (v: boolean) => void
  setActiveScene: (i: number) => void
  setActiveProject: (i: number) => void
  openBoard: (i: number) => void
  closeBoard: () => void
}

export const useStore = create<UIState>((set) => ({
  loaded: false,
  activeScene: 0,
  activeProject: 0,
  boardProject: null,
  setLoaded: (v) => set({ loaded: v }),
  setActiveScene: (i) => set({ activeScene: i }),
  setActiveProject: (i) => set({ activeProject: i }),
  openBoard: (i) => set({ boardProject: i }),
  closeBoard: () => set({ boardProject: null }),
}))

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
