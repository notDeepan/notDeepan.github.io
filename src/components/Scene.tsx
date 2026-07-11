import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Carousel3D from './Carousel3D'
import { useStore } from '../store'

// ─────────────────────────────────────────────────────────────────────────
//  Fixed WebGL layer: a GPU particle field that flows, parallaxes with
//  scroll, and repels around the cursor — plus the work carousel.
// ─────────────────────────────────────────────────────────────────────────

const COUNT = 6000

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;
  uniform float uPixelRatio;
  attribute float aRand;
  varying float vRand;
  varying float vFade;

  void main() {
    vRand = aRand;
    vec3 p = position;

    // slow organic flow
    p.x += sin(uTime * 0.12 + position.y * 0.45 + aRand * 6.28) * 0.42;
    p.y += cos(uTime * 0.09 + position.x * 0.35 + aRand * 6.28) * 0.38;

    // scroll parallax — deeper particles move slower
    float depth = (p.z + 8.0) / 8.0;
    p.y += uScroll * mix(0.4, 1.6, depth) ;
    p.y = mod(p.y + 12.0, 24.0) - 12.0;

    // cursor repulsion
    vec2 d = p.xy - uMouse;
    float dist = length(d);
    float force = smoothstep(2.4, 0.0, dist);
    p.xy += normalize(d + 0.001) * force * 1.1;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (26.0 * uPixelRatio * (0.35 + aRand * 0.65)) / -mv.z;
    vFade = force;
  }
`

const particleFragment = /* glsl */ `
  uniform float uDark;
  varying float vRand;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.08, d) * (0.16 + vRand * 0.4);
    // dark theme: bright additive blues; light theme: deeper slate-blues
    vec3 darkBase = mix(vec3(0.30, 0.42, 1.0), vec3(0.80, 0.87, 1.0), vRand);
    vec3 lightBase = mix(vec3(0.16, 0.26, 0.72), vec3(0.34, 0.45, 0.86), vRand);
    vec3 base = mix(lightBase, darkBase, uDark);
    vec3 hot = mix(vec3(0.20, 0.34, 0.9), vec3(0.55, 0.75, 1.0), uDark);
    vec3 col = mix(base, hot, vFade);
    float aMul = mix(1.7, 1.0, uDark); // more opaque on light backgrounds
    gl_FragColor = vec4(col, alpha * (1.0 + vFade * 0.8) * aMul);
  }
`

function Particles({ dark }: { dark: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null)

  const { positions, rands } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const rands = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24
      positions[i * 3 + 2] = -1.5 - Math.random() * 6.5
      rands[i] = Math.random()
    }
    return { positions, rands }
  }, [])

  useFrame((state, delta) => {
    const m = mat.current
    if (!m) return
    m.uniforms.uTime.value += delta
    // pointer in world coords at z≈0
    m.uniforms.uMouse.value.set(
      (state.pointer.x * state.viewport.width) / 2,
      (state.pointer.y * state.viewport.height) / 2,
    )
    const max = document.documentElement.scrollHeight - window.innerHeight
    const p = max > 0 ? window.scrollY / max : 0
    m.uniforms.uScroll.value = THREE.MathUtils.lerp(m.uniforms.uScroll.value, p * 6, 0.06)
  })

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRand" args={[rands, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        transparent
        depthWrite={false}
        blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uScroll: { value: 0 },
          uPixelRatio: { value: Math.min(window.devicePixelRatio, 1.75) },
          uDark: { value: dark ? 1 : 0 },
        }}
      />
    </points>
  )
}

export default function Scene() {
  const dark = useStore((s) => s.theme === 'dark')
  return (
    <div className="webgl" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 9], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.75]}
      >
        {/* key by theme so blending/uniforms rebuild cleanly on toggle */}
        <Particles key={dark ? 'dark' : 'light'} dark={dark} />
        <Carousel3D />
      </Canvas>
    </div>
  )
}
