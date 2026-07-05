import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

// ─────────────────────────────────────────────────────────────────────────
//  The guide's avatar: a professional anime-styled bust (navy blazer,
//  white shirt, composed expression) rendered inside the widget launcher.
//  Fully procedural — canvas-texture face with blinking and lip-sync.
// ─────────────────────────────────────────────────────────────────────────

const SKIN = '#ffd9b8'
const HAIR = '#2b2337'
const BLAZER = '#1d2a4d'
const SHIRT_WHITE = '#f2f4f9'
const TIE = '#4f7cff'

function useToonGradient() {
  return useMemo(() => {
    const data = new Uint8Array([90, 90, 90, 255, 180, 180, 180, 255, 255, 255, 255, 255])
    const tex = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat)
    tex.minFilter = THREE.NearestFilter
    tex.magFilter = THREE.NearestFilter
    tex.needsUpdate = true
    return tex
  }, [])
}

function useToonMat(color: string, gradientMap: THREE.Texture, emissiveScale = 0.1) {
  return useMemo(() => {
    const c = new THREE.Color(color)
    return new THREE.MeshToonMaterial({
      color: c,
      gradientMap,
      emissive: c.clone().multiplyScalar(emissiveScale),
    })
  }, [color, gradientMap, emissiveScale])
}

function useFaceTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 384
    const ctx = canvas.getContext('2d')!
    const texture = new THREE.CanvasTexture(canvas)
    texture.anisotropy = 4

    const draw = (blink: number, mouth: number) => {
      ctx.clearRect(0, 0, 512, 384)
      const eyeY = 170
      const eyeDX = 92

      for (const side of [-1, 1]) {
        const cx = 256 + side * eyeDX
        if (blink > 0.82) {
          ctx.strokeStyle = '#2a1c14'
          ctx.lineWidth = 9
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(cx - 34, eyeY + 2)
          ctx.quadraticCurveTo(cx, eyeY + 12, cx + 34, eyeY + 2)
          ctx.stroke()
        } else {
          const h = 58 * (1 - blink * 0.8)
          // sclera
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.ellipse(cx, eyeY, 46, h, 0, 0, Math.PI * 2)
          ctx.fill()
          // iris — warm brown, calm
          const grad = ctx.createRadialGradient(cx, eyeY - 4, 4, cx, eyeY + 8, 38)
          grad.addColorStop(0, '#c08a52')
          grad.addColorStop(0.55, '#8a5a30')
          grad.addColorStop(1, '#4e2f14')
          ctx.save()
          ctx.beginPath()
          ctx.ellipse(cx, eyeY, 46, h, 0, 0, Math.PI * 2)
          ctx.clip()
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(cx, eyeY + 6, 32, 0, Math.PI * 2)
          ctx.fill()
          // pupil
          ctx.fillStyle = '#1d120c'
          ctx.beginPath()
          ctx.ellipse(cx, eyeY + 7, 13, 16, 0, 0, Math.PI * 2)
          ctx.fill()
          // single modest highlight
          ctx.fillStyle = 'rgba(255,255,255,0.9)'
          ctx.beginPath()
          ctx.arc(cx - 10, eyeY - 8, 8, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
          // upper lash line
          ctx.strokeStyle = '#2a1c14'
          ctx.lineWidth = 10
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.ellipse(cx, eyeY - 2, 46, h, 0, Math.PI * 1.1, Math.PI * 1.9)
          ctx.stroke()
        }
        // straight, composed brows
        ctx.strokeStyle = '#33241c'
        ctx.lineWidth = 9
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(cx - 36, eyeY - 66)
        ctx.quadraticCurveTo(cx + 4, eyeY - 76, cx + 38, eyeY - 64)
        ctx.stroke()
      }

      // nose hint
      ctx.strokeStyle = 'rgba(60,40,30,0.35)'
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(258, 238)
      ctx.lineTo(252, 252)
      ctx.stroke()

      // mouth
      const my = 296
      if (mouth < 0.1) {
        // gentle professional smile
        ctx.strokeStyle = '#3a201a'
        ctx.lineWidth = 7
        ctx.lineCap = 'round'
        ctx.beginPath()
        ctx.moveTo(222, my)
        ctx.quadraticCurveTo(256, my + 16, 290, my)
        ctx.stroke()
      } else {
        const w = 34 + mouth * 10
        const h = 8 + mouth * 30
        ctx.fillStyle = '#5b241f'
        ctx.strokeStyle = '#33150f'
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.ellipse(256, my + h * 0.35, w, h, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      texture.needsUpdate = true
    }

    draw(0, 0)
    return { texture, draw }
  }, [])
}

// side-swept professional haircut: a few large, flat cones over the forehead
interface Bang {
  pos: [number, number, number]
  rot: [number, number, number]
  len: number
  r: number
}

const BANGS: Bang[] = [
  { pos: [-0.34, 0.42, 0.42], rot: [2.75, 0, 0.5], len: 0.34, r: 0.13 },
  { pos: [-0.12, 0.48, 0.47], rot: [2.8, 0, 0.28], len: 0.38, r: 0.14 },
  { pos: [0.12, 0.49, 0.47], rot: [2.85, 0, 0.1], len: 0.36, r: 0.14 },
  { pos: [0.34, 0.44, 0.42], rot: [2.9, 0, -0.22], len: 0.32, r: 0.13 },
  // sideburns
  { pos: [-0.52, 0.18, 0.18], rot: [3.0, 0, 0.15], len: 0.3, r: 0.09 },
  { pos: [0.52, 0.18, 0.18], rot: [3.0, 0, -0.15], len: 0.3, r: 0.09 },
]

const clamp01 = (t: number) => Math.min(1, Math.max(0, t))

function Bust() {
  const gradientMap = useToonGradient()
  const face = useFaceTexture()

  const root = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const arm = useRef<THREE.Group>(null)

  const skinMat = useToonMat(SKIN, gradientMap, 0.16)
  const hairMat = useToonMat(HAIR, gradientMap, 0.12)
  const blazerMat = useToonMat(BLAZER, gradientMap, 0.14)
  const shirtMat = useToonMat(SHIRT_WHITE, gradientMap, 0.06)
  const tieMat = useToonMat(TIE, gradientMap, 0.25)

  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const anim = useRef({
    blink: 0,
    nextBlink: 2.5,
    blinkClock: 0,
    mouth: 0,
    lastDraw: 0,
    dBlink: -1,
    dMouth: -1,
  })

  useEffect(() => () => face.texture.dispose(), [face])

  useFrame((state, delta) => {
    const g = root.current
    if (!g) return
    const { charAction, actionStart } = useStore.getState()
    const now = performance.now()
    const t = (now - actionStart) / 1000
    const et = state.clock.elapsedTime
    const a = anim.current

    // blinking
    a.blinkClock += delta
    if (a.blinkClock > a.nextBlink) {
      const bt = a.blinkClock - a.nextBlink
      a.blink = bt < 0.09 ? bt / 0.09 : Math.max(0, 1 - (bt - 0.09) / 0.1)
      if (bt > 0.2) {
        a.blinkClock = 0
        a.nextBlink = 2.2 + Math.random() * 3
        a.blink = 0
      }
    }

    const talking = charAction === 'talking'
    const greeting = charAction === 'greet'

    // breathing + micro-sway
    g.scale.y = 1 + Math.sin(et * 2.1) * 0.006
    g.rotation.z = Math.sin(et * 0.7) * 0.012

    // head follows the visitor's cursor, with a nod while speaking
    if (head.current) {
      const targetY = pointer.current.x * 0.3
      const targetX = pointer.current.y * 0.18 + (talking ? Math.sin(et * 5.5) * 0.03 : 0)
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, targetY, 0.08)
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, targetX, 0.08)
      head.current.rotation.z = THREE.MathUtils.lerp(
        head.current.rotation.z,
        greeting ? 0.06 : 0,
        0.08,
      )
    }

    // greet: hand rises into frame and waves, then lowers
    if (arm.current) {
      let up = 0
      if (greeting) {
        const p = clamp01(t / 0.5)
        const down = clamp01((t - 2.0) / 0.5)
        up = p - down
      }
      arm.current.position.y = THREE.MathUtils.lerp(-1.35, -0.62, clamp01(up))
      arm.current.rotation.z = up > 0.9 ? -0.35 + Math.sin(et * 9) * 0.22 : -0.35
    }

    // lip-sync + throttled face redraw
    a.mouth = talking ? (Math.sin(et * 10.5) + 1) * 0.4 + 0.08 : 0
    if (
      now - a.lastDraw > 66 &&
      (Math.abs(a.blink - a.dBlink) > 0.04 || Math.abs(a.mouth - a.dMouth) > 0.06)
    ) {
      face.draw(a.blink, a.mouth)
      a.dBlink = a.blink
      a.dMouth = a.mouth
      a.lastDraw = now
    }
  })

  return (
    <group ref={root} position={[0, -0.28, 0]}>
      {/* head */}
      <group ref={head} position={[0, 0.34, 0]}>
        <mesh material={skinMat}>
          <sphereGeometry args={[0.6, 32, 32]} />
        </mesh>
        {/* face */}
        <mesh position={[0, -0.05, 0.565]}>
          <planeGeometry args={[0.9, 0.68]} />
          <meshBasicMaterial map={face.texture} transparent />
        </mesh>
        {/* hair cap */}
        <mesh position={[0, 0.1, -0.05]} material={hairMat}>
          <sphereGeometry args={[0.62, 32, 32]} />
        </mesh>
        {/* side-swept bangs */}
        {BANGS.map((b, i) => (
          <mesh key={i} position={b.pos} rotation={b.rot} material={hairMat}>
            <coneGeometry args={[b.r, b.len, 6]} />
          </mesh>
        ))}
        {/* ears */}
        <mesh position={[-0.58, -0.02, 0.05]} material={skinMat}>
          <sphereGeometry args={[0.09, 12, 12]} />
        </mesh>
        <mesh position={[0.58, -0.02, 0.05]} material={skinMat}>
          <sphereGeometry args={[0.09, 12, 12]} />
        </mesh>
      </group>

      {/* neck */}
      <mesh position={[0, -0.18, 0]} material={skinMat}>
        <cylinderGeometry args={[0.13, 0.16, 0.3, 12]} />
      </mesh>

      {/* shirt collar */}
      <mesh position={[0, -0.3, 0.02]} rotation-x={Math.PI / 2.3} material={shirtMat}>
        <torusGeometry args={[0.2, 0.055, 8, 20]} />
      </mesh>

      {/* blazer shoulders */}
      <mesh position={[0, -0.62, 0]} rotation-z={Math.PI / 2} material={blazerMat}>
        <capsuleGeometry args={[0.3, 0.62, 8, 16]} />
      </mesh>
      <mesh position={[0, -0.85, 0]} material={blazerMat}>
        <cylinderGeometry args={[0.52, 0.58, 0.5, 20]} />
      </mesh>

      {/* white shirt V */}
      <mesh position={[0, -0.52, 0.31]} rotation-x={-0.1} material={shirtMat}>
        <coneGeometry args={[0.16, 0.34, 3]} />
      </mesh>
      {/* tie */}
      <mesh position={[0, -0.62, 0.36]} rotation-x={-0.1} material={tieMat}>
        <boxGeometry args={[0.09, 0.3, 0.02]} />
      </mesh>

      {/* greeting hand (rises into frame) */}
      <group ref={arm} position={[0.62, -1.35, 0.25]}>
        <mesh material={blazerMat}>
          <capsuleGeometry args={[0.09, 0.3, 6, 12]} />
        </mesh>
        <mesh position={[0, 0.26, 0]} material={skinMat}>
          <sphereGeometry args={[0.12, 14, 14]} />
        </mesh>
      </group>
    </group>
  )
}

export default function Avatar() {
  const poke = useStore((s) => s.poke)
  return (
    <Canvas
      camera={{ position: [0, 0.08, 2.35], fov: 36 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      onClick={poke}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 3, 4]} intensity={1.4} color="#fff6ea" />
      <pointLight position={[-3, -1, 3]} intensity={8} color="#4f7cff" />
      <Bust />
    </Canvas>
  )
}
