import Lenis from 'lenis'

// Smooth-scroll singleton (Active Theory-style inertial scrolling)

let lenis: Lenis | null = null

export function initScroll(): Lenis {
  if (lenis) return lenis
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.05 })
  const raf = (time: number) => {
    lenis!.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
  return lenis
}

export function scrollTo(target: string | number) {
  lenis?.scrollTo(target, { offset: 0, duration: 1.4 })
}

// Freeze page scrolling while a modal (evidence board) is open
export function lockScroll() {
  lenis?.stop()
}

export function unlockScroll() {
  lenis?.start()
}
