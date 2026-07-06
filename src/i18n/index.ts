import { useStore } from '../store'
import { UI, UIStrings } from './ui'
import { getContent, ContentT } from './content'

export * from './config'
export type { UIStrings, Mega } from './ui'
export type { ContentT, ProjT, NodeT } from './content'

// Hook: UI string bundle for the current language.
export function useT(): UIStrings {
  const lang = useStore((s) => s.lang)
  return UI[lang]
}

// Hook: localized structured content (experience, projects, etc.).
export function useContent(): ContentT {
  const lang = useStore((s) => s.lang)
  return getContent(lang)
}
