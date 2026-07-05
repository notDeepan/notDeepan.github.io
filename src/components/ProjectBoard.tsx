import { useEffect, useMemo, useRef, useState } from 'react'
import { useStore } from '../store'
import { lockScroll, unlockScroll } from '../lib/scroll'
import { CAROUSEL_PROJECTS, BoardNode } from '../data'

// ─────────────────────────────────────────────────────────────────────────
//  The Evidence Board — click a project and its case file pins up like a
//  detective board: blurred backdrop, 3D pop-in, nodes strung to the
//  center with drawn-in threads. Every node is draggable.
// ─────────────────────────────────────────────────────────────────────────

const BW = 1280 // design-space width
const BH = 760 // design-space height

interface Pos {
  x: number
  y: number
}

function useBoardScale() {
  const calc = () => {
    const sw = (window.innerWidth - 36) / BW
    const sh = (window.innerHeight - 110) / BH
    return Math.max(0.3, Math.min(sw, sh, 1))
  }
  const [scale, setScale] = useState(calc)
  useEffect(() => {
    const onResize = () => setScale(calc())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return scale
}

function NodeBody({ node, color }: { node: BoardNode; color: string }) {
  switch (node.kind) {
    case 'stat':
      return (
        <>
          <span className="bnode-label mono" style={{ color }}>{node.label}</span>
          <span className="bnode-stat">{node.title}</span>
          {node.text && <p className="bnode-text">{node.text}</p>}
        </>
      )
    case 'quote':
      return (
        <>
          <span className="bnode-label mono" style={{ color }}>{node.label}</span>
          <p className="bnode-quote">{node.text}</p>
        </>
      )
    case 'photo':
      return (
        <>
          <img className="bnode-img" src={node.img} alt={node.label} draggable={false} />
          <span className="bnode-caption mono">{node.label}</span>
        </>
      )
    case 'tags':
      return (
        <>
          <span className="bnode-label mono" style={{ color }}>{node.label}</span>
          <span className="bnode-tags">
            {node.tags?.map((t) => (
              <span className="bnode-tag mono" key={t}>{t}</span>
            ))}
          </span>
        </>
      )
    default:
      return (
        <>
          <span className="bnode-label mono" style={{ color }}>{node.label}</span>
          <p className="bnode-text">{node.text}</p>
        </>
      )
  }
}

export default function ProjectBoard() {
  const boardProject = useStore((s) => s.boardProject)
  const closeBoard = useStore((s) => s.closeBoard)
  const project = boardProject !== null ? CAROUSEL_PROJECTS[boardProject] : null

  const scale = useBoardScale()
  const [positions, setPositions] = useState<Pos[]>([])
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const drag = useRef<{ i: number; startX: number; startY: number; ox: number; oy: number } | null>(null)

  // reset node positions whenever a new case file opens
  useEffect(() => {
    if (project) {
      setPositions(project.board.map((n) => ({ x: n.x, y: n.y })))
      lockScroll()
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeBoard()
      window.addEventListener('keydown', onKey)
      return () => {
        window.removeEventListener('keydown', onKey)
        unlockScroll()
      }
    }
  }, [boardProject]) // eslint-disable-line react-hooks/exhaustive-deps

  const strings = useMemo(() => {
    if (!project) return []
    const cx = BW / 2
    const cy = BH / 2
    return positions.map((p) => {
      const x = (p.x / 100) * BW
      const y = (p.y / 100) * BH
      // slight sag in the thread, like real string
      const mx = (cx + x) / 2
      const my = (cy + y) / 2 + 26
      return `M ${cx} ${cy} Q ${mx} ${my} ${x} ${y}`
    })
  }, [positions, project])

  if (!project) return null

  const onNodeDown = (i: number) => (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    drag.current = { i, startX: e.clientX, startY: e.clientY, ox: positions[i].x, oy: positions[i].y }
  }
  const onNodeMove = (e: React.PointerEvent) => {
    const d = drag.current
    if (!d) return
    const dx = (((e.clientX - d.startX) / scale) / BW) * 100
    const dy = (((e.clientY - d.startY) / scale) / BH) * 100
    setPositions((prev) =>
      prev.map((p, idx) =>
        idx === d.i
          ? { x: Math.min(95, Math.max(5, d.ox + dx)), y: Math.min(93, Math.max(6, d.oy + dy)) }
          : p,
      ),
    )
  }
  const onNodeUp = () => {
    drag.current = null
  }

  const onOverlayMove = (e: React.MouseEvent) => {
    if (drag.current) return
    setTilt({
      x: (e.clientY / window.innerHeight - 0.5) * -3,
      y: (e.clientX / window.innerWidth - 0.5) * 3.5,
    })
  }

  const primaryUrl = project.live ?? project.repo

  return (
    <div
      className="board-overlay"
      onMouseMove={onOverlayMove}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) closeBoard()
      }}
    >
      <div className="board-topbar">
        <span className="mono board-file">
          CASE FILE — {String((boardProject ?? 0) + 1).padStart(2, '0')} · {project.year}
        </span>
        <button className="board-close mono" onClick={closeBoard} data-cursor="link">
          CLOSE ✕
        </button>
      </div>

      <div
        className="board-frame"
        style={{
          width: BW * scale,
          height: BH * scale,
          transform: `perspective(1400px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div
          className="board"
          style={{ width: BW, height: BH, transform: `scale(${scale})` }}
        >
          {/* threads */}
          <svg className="board-strings" viewBox={`0 0 ${BW} ${BH}`} aria-hidden>
            {strings.map((d, i) => (
              <path
                key={i}
                d={d}
                pathLength={1}
                fill="none"
                stroke={project.color}
                strokeWidth={1.4}
                opacity={0.55}
                style={{ animationDelay: `${0.25 + i * 0.07}s` }}
              />
            ))}
            {positions.map((p, i) => (
              <circle
                key={i}
                cx={(p.x / 100) * BW}
                cy={(p.y / 100) * BH}
                r={4}
                fill={project.color}
              />
            ))}
            <circle cx={BW / 2} cy={BH / 2} r={5} fill={project.color} />
          </svg>

          {/* center node — the case card */}
          <div className="bnode bnode-center" style={{ left: '50%', top: '50%' }}>
            <span className="bnode-label mono" style={{ color: project.color }}>
              {project.category} · {project.year}
            </span>
            <h3 className="bnode-title">{project.name.toUpperCase()}</h3>
            <div className="bnode-ctas">
              {project.live && (
                <a className="bnode-cta mono" href={project.live} target="_blank" rel="noreferrer">
                  OPEN LIVE SITE ↗
                </a>
              )}
              {project.repo && (
                <a
                  className={`bnode-cta mono ${project.live ? 'ghost' : ''}`}
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  VIEW SOURCE ↗
                </a>
              )}
              {!primaryUrl && <span className="bnode-note mono">{project.note}</span>}
            </div>
          </div>

          {/* satellite nodes */}
          {project.board.map((node, i) => (
            <div
              key={node.label + i}
              className={`bnode bnode-${node.kind}`}
              data-cursor="drag"
              style={{
                left: `${positions[i]?.x ?? node.x}%`,
                top: `${positions[i]?.y ?? node.y}%`,
                ['--rot' as string]: `${((i * 7) % 5) - 2}deg`,
                animationDelay: `${0.18 + i * 0.06}s`,
              }}
              onPointerDown={onNodeDown(i)}
              onPointerMove={onNodeMove}
              onPointerUp={onNodeUp}
              onPointerCancel={onNodeUp}
            >
              <NodeBody node={node} color={project.color} />
            </div>
          ))}
        </div>
      </div>

      <p className="board-hint mono">DRAG THE EVIDENCE · ESC TO CLOSE</p>
    </div>
  )
}
