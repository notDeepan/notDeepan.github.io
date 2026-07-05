// ── Text-to-speech: the guide's voice (male, composed) ──

let cachedVoice: SpeechSynthesisVoice | null = null

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice
  if (!('speechSynthesis' in window)) return null
  const voices = window.speechSynthesis.getVoices()
  if (!voices.length) return null
  // Prefer natural-sounding male English voices, then any known male voice
  const ranked: Array<(v: SpeechSynthesisVoice) => boolean> = [
    (v) =>
      /^en/i.test(v.lang) &&
      /natural|neural|online/i.test(v.name) &&
      /andrew|brian|guy|christopher|eric|davis|steffan|ryan|thomas|william/i.test(v.name),
    (v) => /^en/i.test(v.lang) && /google uk english male/i.test(v.name),
    (v) =>
      /^en/i.test(v.lang) &&
      /david|mark|james|george|daniel|alex\b|fred|richard/i.test(v.name),
    (v) => /^en/i.test(v.lang) && /male/i.test(v.name),
    (v) => v.lang === 'en-US',
    (v) => /^en/i.test(v.lang),
  ]
  for (const test of ranked) {
    const found = voices.find(test)
    if (found) {
      cachedVoice = found
      return found
    }
  }
  return null
}

if ('speechSynthesis' in window) {
  // Voice list loads asynchronously in some browsers
  window.speechSynthesis.onvoiceschanged = () => pickVoice()
}

let keepAlive: number | null = null

export function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  stopSpeaking()
  const clean = text.replace(/\s+/g, ' ').trim()
  const utter = new SpeechSynthesisUtterance(clean)
  const voice = pickVoice()
  if (voice) utter.voice = voice
  utter.rate = 1.0
  utter.pitch = 0.98
  utter.volume = 0.95
  // Chrome silently stops long utterances after ~15s; periodic
  // pause/resume keeps the engine awake for longer lines.
  keepAlive = window.setInterval(() => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause()
      window.speechSynthesis.resume()
    }
  }, 10000)
  utter.onend = utter.onerror = () => {
    if (keepAlive) window.clearInterval(keepAlive)
    keepAlive = null
  }
  window.speechSynthesis.speak(utter)
}

export function stopSpeaking() {
  if (!('speechSynthesis' in window)) return
  if (keepAlive) window.clearInterval(keepAlive)
  keepAlive = null
  window.speechSynthesis.cancel()
}

// ── A single, soft UI sound (synthesized — no audio files) ──

let audioCtx: AudioContext | null = null

export function softPop() {
  try {
    if (!audioCtx) audioCtx = new AudioContext()
    if (audioCtx.state === 'suspended') audioCtx.resume()
    const osc = audioCtx.createOscillator()
    const g = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(540, audioCtx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(720, audioCtx.currentTime + 0.08)
    g.gain.setValueAtTime(0.045, audioCtx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.12)
    osc.connect(g).connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + 0.12)
  } catch {
    /* audio unavailable — fine */
  }
}
