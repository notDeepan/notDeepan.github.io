// Dev tooling: dumps the localized project intro texts to a JSON manifest
// that the Python edge-tts generator reads. Run with: npx tsx scripts/gen-audio-manifest.ts
import { writeFileSync, mkdirSync } from 'fs'
import { getContent } from '../src/i18n/content'
import { CAROUSEL_PROJECTS } from '../src/data'
import { LANGS } from '../src/i18n/config'

interface Item {
  file: string
  lang: string
  voice: string
  text: string
}

const VOICE: Record<string, string> = {
  en: 'en-US-ChristopherNeural',
  zh: 'zh-TW-YunJheNeural',
  ja: 'ja-JP-KeitaNeural',
  ko: 'ko-KR-InJoonNeural',
  vi: 'vi-VN-NamMinhNeural',
  id: 'id-ID-ArdiNeural',
}

const items: Item[] = []
for (let i = 0; i < CAROUSEL_PROJECTS.length; i++) {
  for (const l of LANGS) {
    const c = getContent(l.code)
    // speak the localized one-line intro (em dashes read cleaner as commas)
    const text = c.projects[i].desc.replace(/—/g, ', ').replace(/\s+/g, ' ').trim()
    items.push({ file: `p${i}-${l.code}`, lang: l.code, voice: VOICE[l.code], text })
  }
}

mkdirSync('public/audio', { recursive: true })
writeFileSync('public/audio/scripts.json', JSON.stringify(items, null, 2))
console.log(`wrote ${items.length} audio scripts to public/audio/scripts.json`)
