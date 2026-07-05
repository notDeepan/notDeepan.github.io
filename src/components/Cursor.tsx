import { useEffect, useRef } from 'react'

// Custom cursor: instant dot + inertial ring. Ring grows over interactive
// elements; over the carousel it becomes a DRAG chip.

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return

    const pos = { x: -100, y: -100 }
    const ringPos = { x: -100, y: -100 }
    let mode: 'default' | 'link' | 'drag' = 'default'
    let raf = 0

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      const t = e.target as HTMLElement
      if (t.closest('a, button, [data-cursor="link"]')) mode = 'link'
      else if (t.closest('[data-cursor="drag"]')) mode = 'drag'
      else mode = 'default'
    }

    const loop = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      if (dot.current) {
        dot.current.style.transform = `translate(${pos.x}px, ${pos.y}px)`
        dot.current.style.opacity = mode === 'drag' ? '0' : '1'
      }
      if (ring.current) {
        const scale = mode === 'drag' ? 2.6 : mode === 'link' ? 1.7 : 1
        ring.current.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) scale(${scale})`
        ring.current.classList.toggle('drag', mode === 'drag')
      }
      if (label.current) {
        label.current.style.opacity = mode === 'drag' ? '1' : '0'
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    document.body.classList.add('has-cursor')
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      document.body.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span ref={label} className="cursor-label mono">
          DRAG
        </span>
      </div>
    </>
  )
}
