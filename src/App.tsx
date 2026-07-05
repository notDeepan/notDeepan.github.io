import { useEffect } from 'react'
import Scene from './components/Scene'
import HUD from './components/HUD'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import ProjectBoard from './components/ProjectBoard'
import { Hero, Work, ExperienceSec, AboutSec, ContactSec } from './components/Sections'
import { useStore } from './store'
import { initScroll } from './lib/scroll'

export default function App() {
  const setActiveScene = useStore((s) => s.setActiveScene)
  const loaded = useStore((s) => s.loaded)

  useEffect(() => {
    history.scrollRestoration = 'manual'
    // deep links: /#work jumps straight to that section
    const target = window.location.hash ? document.querySelector(window.location.hash) : null
    if (target) target.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    else window.scrollTo(0, 0)
    initScroll()
  }, [])

  // Track which scene occupies the middle of the viewport
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[data-scene]'))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActiveScene(Number((e.target as HTMLElement).dataset.scene))
          }
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [setActiveScene])

  return (
    <div className={loaded ? 'app loaded' : 'app'}>
      <Loader />
      <Cursor />
      <div className="noise" aria-hidden />
      <Scene />
      <HUD />
      <main className="content">
        <Hero />
        <Work />
        <ExperienceSec />
        <AboutSec />
        <ContactSec />
      </main>
      <ProjectBoard />
    </div>
  )
}
