import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { ScrollEngine } from '@/lib/scrollEngine';
import type { SectionRenderable } from '@/lib/sectionCompositor';
import { cameraPoint, cameraTarget } from '@/lib/spiralPath';
import { PROJECT_WINDOWS } from '@/lib/constants';
import { projects as portfolioProjects } from '@/data/projects';

type FoodSceneOptions = { width: number; height: number; mobile: boolean; reducedMotion: boolean };
type MaterialKey = 'rice' | 'salmon' | 'peel' | 'citrus' | 'leaf' | 'ceramic' | 'chili' | 'mushroom';
type RiceField = { mesh: THREE.Mesh; material: THREE.ShaderMaterial };

const TAU = Math.PI * 2;
const CHARCOAL = '#11130f';
const UP = new THREE.Vector3(0, 1, 0);

/** Small seeded generator: every reload and screenshot receives the same composition. */
function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function surface(color: string, roughness: number, clearcoat = 0) {
  const material = new THREE.MeshPhysicalMaterial({
    color, roughness, metalness: 0, clearcoat, clearcoatRoughness: 0.3,
  });
  // Object-space pores continue across the ingredients, without external textures.
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vFoodPosition;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFoodPosition = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        varying vec3 vFoodPosition;
        float foodNoise(vec3 p) {
          p = fract(p * 0.3183099 + vec3(.11, .29, .47));
          p *= 17.;
          return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float pore = foodNoise(floor(vFoodPosition * 74.));
        diffuseColor.rgb *= .94 + pore * .095;`)
      .replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + (pore - .5) * .09, .15, 1.);`);
  };
  material.customProgramCacheKey = () => 'pixel-rice-food-surface-v1';
  return material;
}

/** Bake the individual ingredients into one mesh per material, not one draw per grain. */
class FoodBuilder {
  private bins: Record<MaterialKey, THREE.BufferGeometry[]> = {
    rice: [], salmon: [], peel: [], citrus: [], leaf: [], ceramic: [], chili: [], mushroom: [],
  };
  private matrix = new THREE.Matrix4();
  private quaternion = new THREE.Quaternion();
  private position = new THREE.Vector3();
  private scale = new THREE.Vector3();
  private euler = new THREE.Euler();
  private world = new THREE.Matrix4();

  constructor(private rootTransform: THREE.Matrix4) {}

  add(
    key: MaterialKey, source: THREE.BufferGeometry,
    position: [number, number, number] = [0, 0, 0],
    scale: [number, number, number] = [1, 1, 1],
    rotation: [number, number, number] = [0, 0, 0],
  ) {
    this.position.set(...position);
    this.scale.set(...scale);
    this.euler.set(...rotation);
    this.quaternion.setFromEuler(this.euler);
    this.matrix.compose(this.position, this.quaternion, this.scale);
    this.world.multiplyMatrices(this.rootTransform, this.matrix);
    const geometry = source.index ? source.toNonIndexed() : source.clone();
    geometry.applyMatrix4(this.world);
    // All meshes use procedural material coordinates; inconsistent native UVs are unnecessary.
    for (const name of Object.keys(geometry.attributes)) {
      if (name !== 'position' && name !== 'normal') geometry.deleteAttribute(name);
    }
    this.bins[key].push(geometry);
    source.dispose();
  }

  tube(key: MaterialKey, points: THREE.Vector3[], radius: number, radialSegments = 6) {
    this.add(key, new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, radius, radialSegments, false));
  }

  collect(target: Record<MaterialKey, THREE.BufferGeometry[]>) {
    for (const key of Object.keys(this.bins) as MaterialKey[]) target[key].push(...this.bins[key]);
  }
}

function sphere(width = 20, height = 14) { return new THREE.SphereGeometry(1, width, height); }

function nigiri(b: FoodBuilder, rnd: () => number) {
  b.add('rice', sphere(32, 20), [0, -.19, 0], [1.7, .63, .85]);
  // Whole cooked rice grains give the underside a recognisable, tactile silhouette.
  for (let i = 0; i < 320; i++) {
    const angle = rnd() * TAU;
    const lat = Math.acos(rnd() * 2 - 1);
    const s = Math.sin(lat);
    b.add('rice', sphere(5, 4),
      [Math.cos(angle) * s * 1.58, Math.cos(lat) * .53 - .2, Math.sin(angle) * s * .79],
      [.1 + rnd() * .025, .044, .047], [rnd() * .5, rnd() * 1.5, rnd()]);
  }
  // Rounded salmon crown, soft asymmetric overhang and fine fat marbling.
  b.add('salmon', sphere(48, 24), [0, .38, 0], [1.83, .35, .96], [0, 0, -.06]);
  for (let i = -6; i <= 6; i++) {
    const x = i * .245;
    const points: THREE.Vector3[] = [];
    for (let j = 0; j <= 18; j++) {
      const z = (j / 18 - .5) * 1.75;
      const px = x + Math.sin(z * 2.1) * .19;
      const top = Math.sqrt(Math.max(.025, 1 - (px / 1.84) ** 2 - (z / .97) ** 2));
      points.push(new THREE.Vector3(px, .385 + top * .354 - px * .055, z));
    }
    b.tube('rice', points, .016, 4);
  }
  b.add('leaf', sphere(16, 10), [-.95, -.7, -.35], [1.55, .035, .88], [.15, .3, -.1]);
}

function citrus(b: FoodBuilder, rnd: () => number) {
  // Slice faces +z before its exhibit transform; the actual front is visible from the path.
  b.add('peel', new THREE.CylinderGeometry(1.65, 1.65, .45, 72), [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  b.add('rice', new THREE.CylinderGeometry(1.54, 1.54, .465, 72), [0, 0, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * TAU + .028;
    const shape = new THREE.Shape();
    shape.moveTo(Math.cos(a) * .14, Math.sin(a) * .14);
    shape.absarc(0, 0, 1.43, a, a + TAU / 10 - .056, false);
    shape.lineTo(Math.cos(a + TAU / 10 - .056) * .14, Math.sin(a + TAU / 10 - .056) * .14);
    shape.closePath();
    b.add('citrus', new THREE.ExtrudeGeometry(shape, { depth: .024, bevelEnabled: true, bevelThickness: .035, bevelSize: .035, bevelSegments: 2, curveSegments: 12 }), [0, 0, .247]);
    for (let j = 0; j < 24; j++) {
      const angle = a + .06 + rnd() * .45;
      const radius = .27 + Math.sqrt(rnd()) * 1.05;
      b.add('citrus', sphere(5, 4), [Math.cos(angle) * radius, Math.sin(angle) * radius, .295], [.035, .09 + rnd() * .06, .022], [0, 0, angle - Math.PI / 2]);
    }
  }
  // A restrained leaf and one floating segment complete the botanical study.
  b.add('leaf', sphere(24, 12), [1.22, 1.32, -.15], [.7, .25, .045], [.1, .3, -.45]);
  b.tube('leaf', [new THREE.Vector3(.8, 1.13, -.15), new THREE.Vector3(1.24, 1.36, -.1), new THREE.Vector3(1.85, 1.68, -.08)], .025);
}

function dumpling(b: FoodBuilder) {
  const geometry = sphere(72, 44);
  const positions = geometry.getAttribute('position');
  const p = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    p.fromBufferAttribute(positions, i);
    const angle = Math.atan2(p.z, p.x);
    const fold = 1 + Math.cos(angle * 13) * .065 * Math.max(0, p.y + .3);
    p.x *= 1.45 * fold;
    p.z *= 1.12 * fold;
    p.y = p.y * .94 + .08;
    if (p.y < -.58) p.y = -.58 + (p.y + .58) * .18;
    positions.setXYZ(i, p.x, p.y, p.z);
  }
  geometry.computeVertexNormals();
  b.add('rice', geometry);
  // Thirteen pressed folds curve into the gathered top knot.
  for (let i = 0; i < 13; i++) {
    const angle = i / 13 * TAU;
    const points: THREE.Vector3[] = [];
    for (let j = 0; j <= 12; j++) {
      const t = j / 12;
      const r = Math.sin(t * Math.PI / 2) * 1.22 + .05;
      const twist = angle + (1 - t) * .48;
      points.push(new THREE.Vector3(Math.cos(twist) * r, .98 - t * t * .94, Math.sin(twist) * r * .77));
    }
    b.tube('rice', points, .052, 5);
  }
  b.add('rice', new THREE.TorusGeometry(.19, .075, 8, 20), [0, 1.04, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  b.add('leaf', sphere(24, 12), [.15, -.83, -.2], [1.83, .045, 1.3], [.04, -.35, -.1]);
  // Small warm toasted spots baked into the underside.
  for (let i = 0; i < 7; i++) {
    const a = i / 7 * TAU;
    b.add('mushroom', sphere(10, 6), [Math.cos(a) * .8, -.606, Math.sin(a) * .59], [.16, .008, .12]);
  }
}

function taperedTube(points: THREE.Vector3[], radius: (t: number) => number) {
  const curve = new THREE.CatmullRomCurve3(points);
  const segments = 64;
  const radial = 20;
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const centre = curve.getPointAt(i / segments);
    const r = radius(i / segments);
    for (let j = 0; j <= radial; j++) {
      const a = j / radial * TAU;
      const normal = frames.normals[i];
      const binormal = frames.binormals[i];
      positions.push(centre.x + r * (Math.cos(a) * normal.x + Math.sin(a) * binormal.x), centre.y + r * (Math.cos(a) * normal.y + Math.sin(a) * binormal.y), centre.z + r * (Math.cos(a) * normal.z + Math.sin(a) * binormal.z));
      if (i < segments && j < radial) {
        const first = i * (radial + 1) + j;
        indices.push(first, first + radial + 1, first + 1, first + 1, first + radial + 1, first + radial + 2);
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function chili(b: FoodBuilder) {
  const points = [new THREE.Vector3(-1.6, -.9, 0), new THREE.Vector3(-.55, -.6, .1), new THREE.Vector3(.25, .3, .15), new THREE.Vector3(.55, 1.25, 0)];
  b.add('chili', taperedTube(points, t => .015 + Math.sin(t * Math.PI * .81) ** .85 * .37));
  b.add('leaf', sphere(20, 10), [.55, 1.23, 0], [.32, .12, .33]);
  b.tube('leaf', [new THREE.Vector3(.55, 1.24, 0), new THREE.Vector3(.5, 1.68, -.02), new THREE.Vector3(.16, 1.96, -.12)], .063);
  const second = [new THREE.Vector3(-.9, -1.25, -.6), new THREE.Vector3(.45, -1.05, -.5), new THREE.Vector3(1.25, -.5, -.7), new THREE.Vector3(1.65, .15, -.75)];
  b.add('peel', taperedTube(second, t => .012 + Math.sin(t * Math.PI * .82) ** .9 * .29));
  b.tube('leaf', [new THREE.Vector3(1.65, .15, -.75), new THREE.Vector3(1.85, .53, -.79), new THREE.Vector3(1.76, .78, -.86)], .045);
}

function bowl(b: FoodBuilder, rnd: () => number) {
  const profile = [new THREE.Vector2(.57, -.95), new THREE.Vector2(.69, -.9), new THREE.Vector2(.86, -.74), new THREE.Vector2(1.15, -.45), new THREE.Vector2(1.41, -.05), new THREE.Vector2(1.59, .36), new THREE.Vector2(1.62, .46), new THREE.Vector2(1.56, .49), new THREE.Vector2(1.46, .23), new THREE.Vector2(1.2, -.22), new THREE.Vector2(.75, -.63), new THREE.Vector2(.0, -.66)];
  b.add('ceramic', new THREE.LatheGeometry(profile, 72));
  b.add('rice', new THREE.TorusGeometry(1.585, .027, 8, 72), [0, .475, 0], [1, 1, 1], [Math.PI / 2, 0, 0]);
  b.add('ceramic', new THREE.CylinderGeometry(.62, .58, .12, 40), [0, -.97, 0]);
  b.add('rice', sphere(32, 18), [0, .28, 0], [1.42, .38, 1.42]);
  for (let i = 0; i < 480; i++) {
    const a = rnd() * TAU;
    const r = Math.sqrt(rnd()) * 1.38;
    const y = .34 + Math.sqrt(Math.max(0, 1 - (r / 1.45) ** 2)) * .29;
    b.add('rice', sphere(5, 4), [Math.cos(a) * r, y, Math.sin(a) * r], [.047, .044, .13], [rnd() * .5, rnd() * TAU, rnd() * .4]);
  }
  b.add('chili', sphere(28, 20), [0, .69, 0], [.35, .21, .35]);
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * TAU;
    b.add('leaf', new THREE.TorusGeometry(.085, .027, 5, 12), [Math.cos(a) * .71, .63, Math.sin(a) * .71], [1, 1, 1], [Math.PI / 2 + .12, .3, a]);
  }
  // Two fine oak-coloured chopsticks, resting at a natural diagonal.
  b.add('mushroom', new THREE.CylinderGeometry(.028, .053, 4.25, 8), [.43, .89, -.08], [1, 1, 1], [0, -.18, 1.28]);
  b.add('mushroom', new THREE.CylinderGeometry(.028, .053, 4.25, 8), [.4, .89, -.4], [1, 1, 1], [0, -.18, 1.28]);
}

function mushroom(b: FoodBuilder) {
  b.add('rice', taperedTube([new THREE.Vector3(.14, -1.4, 0), new THREE.Vector3(.05, -.5, 0), new THREE.Vector3(-.2, .55, 0)], t => .32 + Math.sin(t * Math.PI) * .07));
  b.add('mushroom', new THREE.SphereGeometry(1, 56, 24, 0, TAU, 0, Math.PI / 2), [-.2, .52, 0], [1.57, .87, 1.34]);
  b.add('rice', sphere(40, 20), [-.2, .51, 0], [1.54, .085, 1.31]);
  for (let i = 0; i < 34; i++) {
    const a = i / 34 * TAU;
    b.tube('mushroom', [new THREE.Vector3(-.2 + Math.cos(a) * .35, .455, Math.sin(a) * .35), new THREE.Vector3(-.2 + Math.cos(a) * .9, .425, Math.sin(a) * .8), new THREE.Vector3(-.2 + Math.cos(a) * 1.46, .47, Math.sin(a) * 1.23)], .013, 3);
  }
  b.add('rice', sphere(22, 14), [1.1, -1.03, .5], [.19, .52, .18], [0, 0, -.28]);
  b.add('mushroom', sphere(28, 16), [1.24, -.5, .5], [.65, .34, .57], [0, 0, -.15]);
}

/** Ellipsoid geometry instances are drawn once; drift, tilt and burst run entirely on the GPU. */
function riceField(count: number, seed: number, kind: 'edges' | 'cloud' | 'gallery' | 'halo'): RiceField {
  const rnd = random(seed);
  const base = new THREE.SphereGeometry(1, 5, 4);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = base.index;
  geometry.setAttribute('position', base.getAttribute('position'));
  geometry.setAttribute('normal', base.getAttribute('normal'));
  const offsets = new Float32Array(count * 3);
  const data = new Float32Array(count * 4);
  const colors = new Float32Array(count * 3);
  const ivory = new THREE.Color('#e2d5b1');
  const olive = new THREE.Color('#8b9673');
  const amber = new THREE.Color('#d19f5c');
  const shade = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const angle = rnd() * TAU;
    const y = kind === 'gallery' ? 4 - rnd() * 59 : (rnd() - .5) * 13;
    let x: number, z: number;
    if (kind === 'edges') {
      x = (rnd() > .5 ? 1 : -1) * (3.2 + rnd() * 7.8);
      z = -2 - rnd() * 11;
    } else if (kind === 'halo') {
      const radius = 2.3 + rnd() * 1.7;
      x = Math.cos(angle) * radius;
      z = Math.sin(angle) * radius;
    } else {
      // Loose ingredient dust, never strands or a double helix.
      const radius = 2.1 + Math.sqrt(rnd()) * (kind === 'gallery' ? 11 : 7);
      x = Math.cos(angle) * radius;
      z = Math.sin(angle) * radius;
    }
    offsets.set([x, y, z], i * 3);
    data.set([rnd() * TAU, rnd() * TAU, .62 + rnd() * .8, rnd()], i * 4);
    shade.copy(ivory).lerp(i % 11 === 0 ? amber : olive, rnd() * .42);
    colors.set([shade.r, shade.g, shade.b], i * 3);
  }
  geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
  geometry.setAttribute('aData', new THREE.InstancedBufferAttribute(data, 4));
  geometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));
  geometry.instanceCount = count;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }, uVelocity: { value: 0 }, uMotion: { value: 1 },
      uBurst: { value: 0 }, uBurstY: { value: 0 }, uOpacity: { value: kind === 'edges' ? .55 : .83 },
      uFog: { value: new THREE.Color(CHARCOAL) },
    },
    vertexShader: `
      attribute vec3 aOffset;
      attribute vec4 aData;
      attribute vec3 aColor;
      uniform float uTime;
      uniform float uVelocity;
      uniform float uMotion;
      uniform float uBurst;
      uniform float uBurstY;
      varying vec3 vColor;
      varying vec3 vNormal;
      varying float vDepth;
      mat3 rotateY(float t) {
        return mat3(cos(t), 0., -sin(t), 0., 1., 0., sin(t), 0., cos(t));
      }
      mat3 rotateZ(float t) {
        return mat3(cos(t), sin(t), 0., -sin(t), cos(t), 0., 0., 0., 1.);
      }
      void main() {
        float time = uTime * uMotion;
        mat3 spin = rotateY(aData.x + time * .055) * rotateZ(aData.y + time * .08);
        vec3 local = spin * (position * vec3(.031, .085, .027) * aData.z);
        vec3 offset = aOffset;
        offset.x += sin(time * .18 + aData.y) * .28 * uMotion;
        offset.y += sin(time * .16 + aData.x) * .38 * uMotion;
        offset.z += cos(time * .13 + aData.y) * .22 * uMotion;
        float localBurst = exp(-abs(aOffset.y - uBurstY) * .32) * uBurst;
        offset += normalize(aOffset - vec3(0., uBurstY, 0.) + .001) * localBurst * 3.;
        offset.xz += vec2(sin(aData.x), cos(aData.y)) * abs(uVelocity) * .085 * uMotion;
        vec4 mv = modelViewMatrix * vec4(local + offset, 1.);
        gl_Position = projectionMatrix * mv;
        vDepth = -mv.z;
        vColor = aColor;
        vNormal = normalize(normalMatrix * spin * normal);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      uniform vec3 uFog;
      varying vec3 vColor;
      varying vec3 vNormal;
      varying float vDepth;
      void main() {
        float diffuse = .48 + max(0., dot(normalize(vNormal), normalize(vec3(-.4, .8, .6)))) * .55;
        float fog = 1. - exp(-vDepth * vDepth * .0011);
        float nearFade = smoothstep(1.8, 4.0, vDepth);
        gl_FragColor = vec4(mix(vColor * diffuse, uFog, fog), uOpacity * nearFade * (1. - fog * .75));
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true, depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  // The instanced geometry now owns these shared attributes; no second base GPU upload occurs.
  base.dispose();
  return { mesh, material };
}

function lighting(scene: THREE.Scene) {
  scene.add(new THREE.HemisphereLight('#fff0dc', '#414a35', 2.2));
  const key = new THREE.DirectionalLight('#ffecd3', 3.8);
  key.position.set(4, 10, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#b4c797', 2.6);
  rim.position.set(-6, 4, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight('#fff6e2', 1.1);
  fill.position.set(0, 1, -8);
  scene.add(fill);
}

export function createFoodScenes(engine: ScrollEngine, options: FoodSceneOptions) {
  let width = Math.max(1, options.width);
  let height = Math.max(1, options.height);
  let burstTarget = 0;
  let burst = 0;
  let burstIndex = 0;
  const cameras: THREE.PerspectiveCamera[] = [];
  const allScenes: THREE.Scene[] = [];
  const fields: RiceField[] = [];
  const makeScene = () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(CHARCOAL);
    scene.fog = new THREE.FogExp2(CHARCOAL, .032);
    const camera = new THREE.PerspectiveCamera(42, width / height, .1, 100);
    camera.position.set(0, 0, 12);
    cameras.push(camera);
    allScenes.push(scene);
    return { scene, camera };
  };
  const reduced = () => engine.reducedMotion;

  const atmosphere = (index: number, kind: 'edges' | 'cloud' | 'halo', count: number): SectionRenderable => {
    const { scene, camera } = makeScene();
    const field = riceField(options.mobile ? Math.floor(count * .55) : count, 71 + index * 183, kind);
    scene.add(field.mesh);
    fields.push(field);
    let elapsed = 0;
    return {
      scene, camera,
      update(dt: number) {
        const motion = reduced() ? 0 : 1;
        elapsed += Math.min(dt, .1) * motion;
        field.material.uniforms.uTime.value = elapsed;
        field.material.uniforms.uMotion.value = motion;
        field.material.uniforms.uVelocity.value = engine.velocity;
        camera.position.x = index===0 ? 0 : engine.pointer.x * .19 * motion;
        camera.position.y = index===0 ? 0 : engine.pointer.y * .12 * motion;
        camera.lookAt(0, 0, 0);
      },
    };
  };

  const founder = atmosphere(0, 'edges', 200);
  const identity = atmosphere(1, 'cloud', 760);
  const { scene: projectScene, camera: projectCamera } = makeScene();
  lighting(projectScene);
  projectScene.fog = new THREE.FogExp2(CHARCOAL, .036);
  const projectField = riceField(options.mobile ? 1200 : 2800, 202609, 'gallery');
  projectScene.add(projectField.mesh);
  fields.push(projectField);
  const materials: Record<MaterialKey, THREE.MeshPhysicalMaterial> = {
    rice: surface('#f0e4ca', .55), salmon: surface('#e76b46', .37, .23),
    peel: surface('#dc822d', .48, .1), citrus: surface('#efa33b', .31, .35),
    leaf: surface('#546849', .55), ceramic: surface('#293d38', .24, .65),
    chili: surface('#a62d21', .28, .55), mushroom: surface('#946548', .59),
  };
  const foodFunctions = [nigiri, citrus, dumpling, chili, bowl, mushroom];
  const target = new THREE.Vector3();
  const position = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const matrix = new THREE.Matrix4();
  const scale = new THREE.Vector3();
  const foodCentres: THREE.Vector3[] = [];
  const foodInterludes: Array<{group:THREE.Group;peak:number;materials:THREE.MeshPhysicalMaterial[]}> = [];
  for (let i = 0; i < portfolioProjects.length; i++) {
    const bins: Record<MaterialKey, THREE.BufferGeometry[]> = {
      rice: [], salmon: [], peel: [], citrus: [], leaf: [], ceramic: [], chili: [], mushroom: [],
    };
    const peak = Math.min(.975, PROJECT_WINDOWS[i].peak + .075);
    cameraPoint(peak, position);
    cameraTarget(peak, target);
    const centre = target.clone();
    // Leave the left third of the viewport available for the editorial project caption.
    const right = new THREE.Vector3().subVectors(target, position).cross(UP).normalize();
    centre.addScaledVector(right, options.mobile ? 0 : .62);
    foodCentres.push(centre);
    const angle = Math.atan2(position.x - centre.x, position.z - centre.z);
    const tilt = [0.42, -.13, .26, .1, .76, -.1][i];
    rotation.setFromEuler(new THREE.Euler(tilt, angle + (i === 0 ? -.25 : .12), i === 1 ? -.24 : -.1, 'YXZ'));
    const factor = options.mobile ? .9 : 1.18;
    scale.setScalar(factor);
    matrix.compose(centre, rotation, scale);
    const builder = new FoodBuilder(matrix.clone());
    foodFunctions[i](builder, random(1281 + i * 11));
    builder.collect(bins);
    const group=new THREE.Group();
    const interludeMaterials:THREE.MeshPhysicalMaterial[]=[];
    for (const key of Object.keys(bins) as MaterialKey[]) {
      if (!bins[key].length) continue;
      const geometry = mergeGeometries(bins[key], false);
      bins[key].forEach(g => g.dispose());
      if (geometry) {
        const material=materials[key].clone();material.transparent=true;
        interludeMaterials.push(material);group.add(new THREE.Mesh(geometry,material));
      }
    }
    group.visible=false;projectScene.add(group);
    foodInterludes.push({group,peak,materials:interludeMaterials});
  }
  Object.values(materials).forEach(material=>material.dispose());

  let disposed = false;
  const textureLoader = new THREE.TextureLoader();
  const mediaTextures = new Set<THREE.Texture>();
  const projectPlanes = portfolioProjects.map((project, index) => {
    const geometry = new THREE.PlaneGeometry(6.0, 3.75, 24, 16);
    const vertices = geometry.getAttribute('position');
    for(let i=0;i<vertices.count;i++) vertices.setZ(i, Math.sin((vertices.getX(i)/6+.5)*Math.PI)*.18);
    geometry.computeVertexNormals();
    const material = new THREE.ShaderMaterial({
      uniforms:{uMap:{value:null},uFocal:{value:0},uDistortion:{value:0},uReady:{value:0}},
      transparent:true,depthWrite:true,side:THREE.DoubleSide,
      vertexShader:`varying vec2 vUv;uniform float uDistortion;void main(){vUv=uv;vec3 p=position;p.z+=sin(uv.x*7.)*uDistortion;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader:`varying vec2 vUv;uniform sampler2D uMap;uniform float uFocal;uniform float uReady;uniform float uDistortion;
      void main(){vec2 uv=vUv;uv.x+=sin(uv.y*8.)*uDistortion*.025;vec3 c=texture2D(uMap,clamp(uv,0.,1.)).rgb;c*=.75+.25*uFocal;gl_FragColor=vec4(c,uFocal*uReady);#include <colorspace_fragment>}`.replace(';#include',';\n#include'),
    });
    const mesh = new THREE.Mesh(geometry,material);
    cameraPoint(PROJECT_WINDOWS[index].peak,position);cameraTarget(PROJECT_WINDOWS[index].peak,target);
    const right=new THREE.Vector3().subVectors(target,position).cross(UP).normalize();
    mesh.position.copy(target).addScaledVector(right, options.mobile ? 0 : 2.0);
    if(options.mobile)mesh.position.y+=1.0;
    mesh.lookAt(position);mesh.rotateZ(index%2===0?-.045:.045);
    if(options.mobile)mesh.scale.setScalar(.52);
    mesh.visible=false;projectScene.add(mesh);
    return {mesh,material,started:false,load(){
      if(this.started)return;this.started=true;
      textureLoader.load(project.cover,texture=>{
        if(disposed){texture.dispose();return;}
        texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;mediaTextures.add(texture);
        material.uniforms.uMap.value=texture;material.uniforms.uReady.value=1;
      },undefined,()=>{material.uniforms.uReady.value=0;});
    }};
  });

  let projectElapsed = 0;
  const projects: SectionRenderable = {
    scene: projectScene, camera: projectCamera,
    update(dt: number) {
      const motion = reduced() ? 0 : 1;
      const p = engine.progressOf('projects');
      const d = Math.min(dt, .1);
      projectElapsed += d * motion;
      // ScrollEngine already smooths progress. No second camera lag or world rotation.
      cameraPoint(p, position);
      cameraTarget(p, target);
      if (options.mobile) {
        position.x *= 1.2;
        position.z *= 1.2;
      }
      projectCamera.position.copy(position);
      projectCamera.position.x += engine.pointer.x * .16 * motion;
      projectCamera.position.y += engine.pointer.y * .12 * motion;
      projectCamera.lookAt(target);
      burst = THREE.MathUtils.damp(burst, burstTarget, 7, d);
      projectField.material.uniforms.uTime.value = projectElapsed;
      projectField.material.uniforms.uMotion.value = motion;
      projectField.material.uniforms.uVelocity.value = engine.velocity;
      projectField.material.uniforms.uBurst.value = burst;
      projectField.material.uniforms.uBurstY.value = foodCentres[burstIndex].y;
      foodInterludes.forEach(food=>{
        const opacity=1-THREE.MathUtils.smoothstep(Math.abs(p-food.peak),.018,.052);
        food.group.visible=opacity>.001;
        food.materials.forEach(material=>{material.opacity=opacity;material.depthWrite=opacity>.95;});
      });
      projectPlanes.forEach((plane,index)=>{
        const distance=Math.abs(p-PROJECT_WINDOWS[index].peak);
        const focus=1-THREE.MathUtils.smoothstep(distance,.035,.078);
        plane.mesh.visible=focus>.001;
        if(distance<.18)plane.load();
        plane.material.uniforms.uFocal.value=focus;
        plane.material.uniforms.uDistortion.value=motion*Math.min(.06,Math.abs(engine.velocity)*.024);
      });
    },
  };
  const reviews = atmosphere(3, 'edges', 330);
  const brand = atmosphere(4, 'halo', 1550);
  const contact = atmosphere(5, 'edges', 570);
  const sections = [founder, identity, projects, reviews, brand, contact];

  return {
    sections,
    projectHitArea() {
      const active=engine.transition>.5?engine.index2:engine.index1;
      if(active!==2)return null;
      const index=projectPlanes.findIndex(plane=>plane.material.uniforms.uFocal.value>.2 && plane.material.uniforms.uReady.value===1);
      if(index<0)return null;
      const mesh=projectPlanes[index].mesh;
      const corners=[[-3,1.875],[3,1.875],[3,-1.875],[-3,-1.875]].map(([x,y])=>{
        const point=new THREE.Vector3(x,y,0).applyMatrix4(mesh.matrixWorld).project(projectCamera);
        return `${(point.x+1)*50}% ${(1-point.y)*50}%`;
      });
      return {index,clipPath:`polygon(${corners.join(',')})`};
    },
    resize(nextWidth: number, nextHeight: number) {
      width = Math.max(1, nextWidth);
      height = Math.max(1, nextHeight);
      for (const camera of cameras) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    },
    setBurst(value: number, index = 0) {
      burstTarget = THREE.MathUtils.clamp(value, 0, 1);
      burstIndex = THREE.MathUtils.clamp(Math.round(index), 0, portfolioProjects.length-1);
    },
    dispose() {
      disposed=true;
      mediaTextures.forEach(texture=>texture.dispose());
      const geometries = new Set<THREE.BufferGeometry>();
      const disposableMaterials = new Set<THREE.Material>();
      for (const scene of allScenes) {
        scene.traverse(object => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) geometries.add(mesh.geometry);
          if (mesh.material) {
            if (Array.isArray(mesh.material)) mesh.material.forEach(m => disposableMaterials.add(m));
            else disposableMaterials.add(mesh.material);
          }
        });
        scene.clear();
      }
      geometries.forEach(g => g.dispose());
      disposableMaterials.forEach(m => m.dispose());
    },
  };
}
