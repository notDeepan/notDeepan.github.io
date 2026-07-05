import { useEffect, useRef, useState } from 'react'

// Active Theory-style text scramble: characters cycle through glyphs
// before settling on the target string.

const GLYPHS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function useScramble(text: string, play: boolean, speed = 28) {
  const [out, setOut] = useState(play ? '' : text)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    if (!play) {
      setOut(text)
      return
    }
    let i = 0
    const total = text.length
    const start = performance.now()
    const tick = (now: number) => {
      const elapsed = now - start
      i = Math.floor(elapsed / speed)
      if (i >= total + 6) {
        setOut(text)
        return
      }
      let s = ''
      for (let c = 0; c < total; c++) {
        if (text[c] === ' ') {
          s += ' '
        } else if (c < i - 4) {
          s += text[c]
        } else {
          s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
      }
      setOut(s)
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [text, play, speed])

  return out
}

export function Scramble({
  text,
  play = true,
  className = '',
  speed,
}: {
  text: string
  play?: boolean
  className?: string
  speed?: number
}) {
  const out = useScramble(text, play, speed)
  return <span className={className}>{out}</span>
}

// Scrambles on hover — for nav links and list rows
export function HoverScramble({ text, className = '' }: { text: string; className?: string }) {
  const [hovering, setHovering] = useState(false)
  const [tick, setTick] = useState(0)
  const out = useScramble(text, hovering, 18)
  return (
    <span
      className={className}
      key={tick}
      onMouseEnter={() => {
        setHovering(true)
        setTick((t) => t + 1)
      }}
      onMouseLeave={() => setHovering(false)}
    >
      {hovering ? out : text}
    </span>
  )
}
