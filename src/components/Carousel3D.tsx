import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { carousel, useStore } from '../store'
import { CAROUSEL_PROJECTS, CarouselProject } from '../data'
import { useT, useContent } from '../i18n'

// ─────────────────────────────────────────────────────────────────────────
//  WebGL work carousel — draggable strip of landscape poster planes that
//  bend and RGB-shift with drag velocity (Active Theory-style).
//  Posters show real project screenshots with a typographic overlay;
//  projects without imagery fall back to a generative art-directed card.
// ─────────────────────────────────────────────────────────────────────────

export const PLANE_W = 3.3
export const PLANE_H = PLANE_W * (800 / 1280)
const W = 1280
const H = 800

interface PosterLoc {
  category: string
  badge: string
}

function drawPoster(
  ctx: CanvasRenderingContext2D,
  p: CarouselProject,
  index: number,
  img: HTMLImageElement | null,
  loc: PosterLoc,
) {
  const c = p.color

  if (img) {
    // ── screenshot poster: cover-fit image ──
    const s = Math.max(W / img.width, H / img.height)
    const dw = img.width * s
    const dh = img.height * s
    ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh)
    // legibility overlays
    const bottom = ctx.createLinearGradient(0, H, 0, H * 0.4)
    bottom.addColorStop(0, 'rgba(6,6,12,0.92)')
    bottom.addColorStop(0.55, 'rgba(6,6,12,0.45)')
    bottom.addColorStop(1, 'transparent')
    ctx.fillStyle = bottom
    ctx.fillRect(0, 0, W, H)
    const top = ctx.createLinearGradient(0, 0, 0, 140)
    top.addColorStop(0, 'rgba(6,6,12,0.55)')
    top.addColorStop(1, 'transparent')
    ctx.fillStyle = top
    ctx.fillRect(0, 0, W, 140)
  } else {
    // ── generative fallback poster ──
    ctx.fillStyle = '#12121c'
    ctx.fillRect(0, 0, W, H)
    const bgGrad = ctx.createLinearGradient(0, H, 0, 0)
    bgGrad.addColorStop(0, c + '4a')
    bgGrad.addColorStop(0.55, c + '0d')
    bgGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, W, H)
    // grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)'
    ctx.lineWidth = 1
    for (let x = 128; x < W; x += 128) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, H)
      ctx.stroke()
    }
    for (let y = 128; y < H; y += 128) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(W, y)
      ctx.stroke()
    }
    // geometric accent
    ctx.strokeStyle = c + '55'
    ctx.lineWidth = 2
    if (index % 2 === 0) {
      ctx.beginPath()
      ctx.arc(W * 0.74, H * 0.36, 190, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(W * 0.74, H * 0.36, 130, 0, Math.PI * 2)
      ctx.stroke()
    } else {
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(W * 0.55 + i * 60, H * 0.08)
        ctx.lineTo(W * 0.85 + i * 60, H * 0.5)
        ctx.stroke()
      }
    }
    // giant outlined index numeral
    ctx.font = '400 300px Anton, sans-serif'
    ctx.textBaseline = 'alphabetic'
    ctx.strokeStyle = c + '48'
    ctx.lineWidth = 3
    ctx.strokeText(String(index + 1).padStart(2, '0'), 34, 320)
  }

  // ── shared typographic layer ──
  // index (top-left)
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'left'
  ctx.font = '500 26px "JetBrains Mono", monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.7)'
  ctx.fillText(String(index + 1).padStart(2, '0'), 44, 66)

  // status badge (top-right)
  ctx.font = '700 26px "JetBrains Mono", monospace'
  ctx.textAlign = 'right'
  if (p.badge === 'LIVE') {
    ctx.fillStyle = '#34d399'
    ctx.fillText('● ' + loc.badge, W - 44, 66)
  } else if (p.badge === 'RESEARCH') {
    ctx.fillStyle = c
    ctx.fillText('▲ ' + loc.badge, W - 44, 66)
  } else if (p.badge === 'CONSULTING') {
    ctx.fillStyle = c
    ctx.fillText('◆ ' + loc.badge, W - 44, 66)
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    ctx.fillText('‹ ' + loc.badge + ' ›', W - 44, 66)
  }

  // year (bottom-right)
  ctx.font = '500 30px "JetBrains Mono", monospace'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText(p.year, W - 44, H - 46)
  ctx.textAlign = 'left'

  // category
  ctx.font = '500 27px "JetBrains Mono", monospace'
  ctx.fillStyle = c
  ctx.fillText(loc.category, 46, H - 158)

  // project name — wrapped, big
  ctx.font = '400 76px Anton, sans-serif'
  ctx.fillStyle = '#f4f5f9'
  const words = p.name.toUpperCase().split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? line + ' ' + w : w
    if (ctx.measureText(test).width > W - 320 && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  lines.push(line)
  const shown = lines.slice(0, 2)
  let y = H - 60 - (shown.length - 1) * 82
  for (const l of shown) {
    ctx.fillText(l, 44, y)
    y += 82
  }

  // hairline frame
  ctx.strokeStyle = 'rgba(255,255,255,0.22)'
  ctx.lineWidth = 2
  ctx.strokeRect(5, 5, W - 10, H - 10)
}

const vertexShader = /* glsl */ `
  uniform float uVel;
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    // bend with drag velocity
    p.z += sin(uv.x * 3.14159) * uVel * 0.55;
    p.x += sin(uv.y * 3.14159) * uVel * 0.12;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uVel;
  uniform float uHover;
  uniform float uDim;
  varying vec2 vUv;
  void main() {
    float shift = uVel * 0.03 + uHover * 0.004;
    float r = texture2D(uMap, vUv + vec2(shift, 0.0)).r;
    float g = texture2D(uMap, vUv).g;
    float b = texture2D(uMap, vUv - vec2(shift, 0.0)).b;
    vec3 col = vec3(r, g, b);
    col *= 0.82 + uDim * 0.18 + uHover * 0.1;
    gl_FragColor = vec4(col, 1.0);
  }
`

interface PlaneData {
  texture: THREE.CanvasTexture
  material: THREE.ShaderMaterial
  draw: (loc: PosterLoc) => void
}

const BADGE_KEY = {
  LIVE: 'badgeLive',
  RESEARCH: 'badgeResearch',
  CONSULTING: 'badgeConsulting',
  CODE: 'badgeCode',
} as const

function usePlanes(): PlaneData[] {
  const content = useContent()
  const t = useT()

  const planes = useMemo(
    () =>
      CAROUSEL_PROJECTS.map((p, i) => {
        const canvas = document.createElement('canvas')
        canvas.width = W
        canvas.height = H
        const ctx = canvas.getContext('2d')!
        const texture = new THREE.CanvasTexture(canvas)
        texture.anisotropy = 8
        texture.colorSpace = THREE.SRGBColorSpace
        // holder keeps the latest image + localized strings across redraws
        const holder = {
          img: null as HTMLImageElement | null,
          loc: { category: p.category, badge: p.badge } as PosterLoc,
        }
        const draw = (loc: PosterLoc) => {
          holder.loc = loc
          drawPoster(ctx, p, i, holder.img, loc)
          texture.needsUpdate = true
        }
        draw(holder.loc)
        if (p.image) {
          const el = new Image()
          el.onload = () => {
            holder.img = el
            draw(holder.loc)
          }
          el.src = p.image
        }
        const material = new THREE.ShaderMaterial({
          uniforms: {
            uMap: { value: texture },
            uVel: { value: 0 },
            uHover: { value: 0 },
            uDim: { value: 0 },
            uTime: { value: 0 },
          },
          vertexShader,
          fragmentShader,
        })
        return { texture, material, draw }
      }),
    [],
  )

  // (re)draw with localized strings whenever the language changes, and again
  // once the display fonts (Anton / JetBrains Mono) have loaded.
  useEffect(() => {
    const render = () =>
      planes.forEach((pl, i) =>
        pl.draw({
          category: content.projects[i].category,
          badge: t[BADGE_KEY[CAROUSEL_PROJECTS[i].badge]],
        }),
      )
    render()
    let alive = true
    document.fonts.ready.then(() => {
      if (alive) render()
    })
    return () => {
      alive = false
    }
  }, [planes, content, t])

  // dispose GPU resources on unmount
  useEffect(
    () => () => {
      planes.forEach((p) => {
        p.texture.dispose()
        p.material.dispose()
      })
    },
    [planes],
  )

  return planes
}

export default function Carousel3D() {
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const planes = usePlanes()
  const setActiveProject = useStore((s) => s.setActiveProject)
  const lastActive = useRef(0)
  const prevCurrent = useRef(0)
  const { viewport } = useThree()

  const n = CAROUSEL_PROJECTS.length

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return

    // pin the strip to the #work section as the page scrolls
    const el = document.getElementById('work')
    if (!el) return
    const r = el.getBoundingClientRect()
    const centerPx = r.top + r.height / 2
    const vh = state.viewport.height
    g.position.y = ((window.innerHeight / 2 - centerPx) / window.innerHeight) * vh + 0.55
    g.visible = r.bottom > -100 && r.top < window.innerHeight + 100

    // drag physics (frame-rate normalized)
    const stiffness = carousel.dragging ? 0.32 : 0.075
    carousel.current += (carousel.target - carousel.current) * stiffness
    const dt = Math.min(Math.max(delta, 1 / 240), 1 / 20)
    const instVel = ((carousel.current - prevCurrent.current) / dt) * (1 / 60)
    prevCurrent.current = carousel.current
    carousel.velocity = THREE.MathUtils.lerp(carousel.velocity, instVel, 0.25)
    const vel = THREE.MathUtils.clamp(carousel.velocity * 6, -1.0, 1.0)

    // hovered card from pointer position (math — the DOM overlay owns events)
    const px = (state.pointer.x * state.viewport.width) / 2
    const py = (state.pointer.y * state.viewport.height) / 2
    let hovered = -1
    if (Math.abs(py - g.position.y) < (PLANE_H * g.scale.x) / 2) {
      const localX = px / g.scale.x
      const raw = (localX + carousel.current) / carousel.gap
      const idx = Math.round(raw)
      if (idx >= 0 && idx < n && Math.abs(localX - (idx * carousel.gap - carousel.current)) < PLANE_W / 2) {
        hovered = idx
      }
    }
    carousel.hovered = hovered

    // active (centered) card → caption
    const active = THREE.MathUtils.clamp(Math.round(carousel.current / carousel.gap), 0, n - 1)
    if (active !== lastActive.current) {
      lastActive.current = active
      setActiveProject(active)
    }

    // per-plane transforms + uniforms
    meshes.current.forEach((mesh, i) => {
      if (!mesh) return
      const x = i * carousel.gap - carousel.current
      mesh.position.x = x
      mesh.position.z = -Math.abs(x) * 0.22
      mesh.rotation.y = -x * 0.06
      const isHover = hovered === i
      const centered = 1 - THREE.MathUtils.clamp(Math.abs(x) / carousel.gap, 0, 1)
      const targetScale = 1 + centered * 0.045 + (isHover ? 0.03 : 0)
      const s = THREE.MathUtils.lerp(mesh.scale.x, targetScale, 0.12)
      mesh.scale.setScalar(s)
      const mat = planes[i].material
      mat.uniforms.uVel.value = vel
      mat.uniforms.uTime.value += delta
      mat.uniforms.uHover.value = THREE.MathUtils.lerp(
        mat.uniforms.uHover.value,
        isHover ? 1 : 0,
        0.12,
      )
      mat.uniforms.uDim.value = THREE.MathUtils.lerp(mat.uniforms.uDim.value, centered, 0.1)
    })
  })

  // responsive: smaller planes on narrow screens via group scale
  const scale = Math.min(1, viewport.width / 10.5)

  return (
    <group ref={group} scale={scale}>
      {CAROUSEL_PROJECTS.map((p, i) => (
        <mesh
          key={p.name}
          ref={(el) => (meshes.current[i] = el)}
          position={[i * carousel.gap, 0, 0]}
          material={planes[i].material}
        >
          <planeGeometry args={[PLANE_W, PLANE_H, 24, 24]} />
        </mesh>
      ))}
    </group>
  )
}
