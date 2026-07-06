export type Lang = 'en' | 'zh' | 'ja' | 'ko' | 'vi' | 'id'

export interface LangDef {
  code: Lang
  native: string // shown in its own language
  english: string // English name
  short: string // 2-letter chip label
}

export const LANGS: LangDef[] = [
  { code: 'en', native: 'English', english: 'English', short: 'EN' },
  { code: 'zh', native: '繁體中文', english: 'Traditional Chinese', short: '中' },
  { code: 'ja', native: '日本語', english: 'Japanese', short: '日' },
  { code: 'ko', native: '한국어', english: 'Korean', short: '한' },
  { code: 'vi', native: 'Tiếng Việt', english: 'Vietnamese', short: 'VI' },
  { code: 'id', native: 'Bahasa Indonesia', english: 'Indonesian', short: 'ID' },
]

export const DEFAULT_LANG: Lang = 'en'
export const LANG_STORAGE_KEY = 'dg-portfolio-lang'

// Map a browser locale (e.g. "zh-TW") to one of our supported languages.
export function detectLang(): Lang | null {
  const list = (navigator.languages || [navigator.language]).map((l) => l.toLowerCase())
  for (const l of list) {
    if (l.startsWith('zh')) return 'zh'
    if (l.startsWith('ja')) return 'ja'
    if (l.startsWith('ko')) return 'ko'
    if (l.startsWith('vi')) return 'vi'
    if (l.startsWith('id')) return 'id'
    if (l.startsWith('en')) return 'en'
  }
  return null
}
