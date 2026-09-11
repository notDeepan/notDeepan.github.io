import * as THREE from 'three';
import { PROJECT_WINDOWS } from '@/lib/constants';
import { cameraPoint, cameraTarget } from '@/lib/spiralPath';

export type RiceField = { mesh: THREE.Mesh; material: THREE.ShaderMaterial };

const TAU = Math.PI * 2;
const CHARCOAL = '#080b0c';
const UP = new THREE.Vector3(0, 1, 0);

/** Small seeded generator: every reload and screenshot receives the same composition. */
function random(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export function riceField(count: number, seed: number, kind: 'edges' | 'cloud' | 'gallery' | 'halo' | 'story'): RiceField {
  const rnd = random(seed);
  const base = new THREE.SphereGeometry(1, kind==='story'?(count<1000?8:10):5, kind==='story'?(count<1000?6:7):4);
  const geometry = new THREE.InstancedBufferGeometry();
  geometry.index = base.index;
  geometry.setAttribute('position', base.getAttribute('position'));
  geometry.setAttribute('normal', base.getAttribute('normal'));
  const offsets = new Float32Array(count * 3);
  const data = new Float32Array(count * 4);
  const colors = new Float32Array(count * 3);
  const storyData = new Float32Array(count * 4);
  const ivory = new THREE.Color('#e2d5b1');
  const olive = new THREE.Color('#b5aea1');
  const amber = new THREE.Color('#c9ae88');
  const shade = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const angle = rnd() * TAU;
    let x:number,y:number,z:number;
    if(kind==='gallery'){
      // Rice wreaths share each real project's camera frame, so imagery emerges inside the field.
      const peak=PROJECT_WINDOWS[i%PROJECT_WINDOWS.length].peak;
      const eye=cameraPoint(peak,new THREE.Vector3()),center=cameraTarget(peak,new THREE.Vector3());
      const forward=center.clone().sub(eye).normalize(),right=forward.clone().cross(UP).normalize(),up=right.clone().cross(forward);
      const radius=2.45+Math.pow(rnd(),4)*1.7+Math.sin(angle*3)*.16;
      center.addScaledVector(right,-1.65+Math.cos(angle)*radius*1.3).addScaledVector(up,Math.sin(angle)*radius*.85).addScaledVector(forward,(rnd()-.5)*2.4);
      x=center.x;y=center.y;z=center.z;
    }else if(kind==='edges'){
      const radius=4+Math.pow(rnd(),2)*3;
      x=2.5+Math.cos(angle)*radius*1.35;y=Math.sin(angle)*radius*.8;z=-1+rnd()*8;
      if(seed===71&&x>-4&&x<.5&&y>-1.8&&y<2.7)x+=6;
    }else{
      // Flattened toroidal stream: dense inner curve, loose edge, empty center for type.
      const radius=2.7+Math.pow(rnd(),4)*1.7+Math.sin(angle*3)*.2;
      x=Math.cos(angle)*radius*(kind==='halo'?1.45:1.12);
      y=Math.sin(angle)*radius*.92;
      z=Math.sin(angle*2)*.65+(rnd()-.5)*1.6;
      if(kind==='cloud'){x-=2.1;y+=Math.sin(angle)*.35;}
    }
    if(kind==='story'){
      // Eighteen quiet foreground grains; the rest arrive from outside the camera frustum.
      const heroAngle=i*2.39996;
      x=Math.cos(heroAngle)*(4.5+rnd()*3.5);y=Math.sin(heroAngle)*(3.2+rnd()*2);z=-1+rnd()*5;
      if(i>=18){x*=5;y*=5;z=-100-rnd()*30;}
      storyData.set([angle,rnd(),rnd(),i<18?1:0],i*4);
    }
    offsets.set([x,y,z],i*3);
    const foreground=kind==='edges'&&seed===71&&i%17===0;
    data.set([rnd()*TAU,rnd()*TAU,kind==='story'?(i<18?1.2+rnd()*1.3:.18+rnd()*.63):foreground?1.8+rnd()*1.8:.26+rnd()*.85,rnd()],i*4);
    shade.copy(ivory).lerp(i % 11 === 0 ? amber : olive, rnd() * .42);
    colors.set([shade.r, shade.g, shade.b], i * 3);
  }
  geometry.setAttribute('aStory', new THREE.InstancedBufferAttribute(storyData, 4));
  geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
  geometry.setAttribute('aData', new THREE.InstancedBufferAttribute(data, 4));
  geometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(colors, 3));
  geometry.instanceCount = count;
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uWidth: { value: 1 }, uStory: { value: 0 }, uIsStory: { value: kind === 'story' ? 1 : 0 }, uFlow: { value: 0 },
      uTime: { value: 0 }, uVelocity: { value: 0 }, uMotion: { value: 1 },
      uBurst: { value: 0 }, uBurstY: { value: 0 }, uOpacity: { value: kind === 'edges' ? .78 : .94 },
      uFog: { value: new THREE.Color(CHARCOAL) },
    },
    vertexShader: `
      attribute vec3 aOffset;
      attribute vec4 aStory;
      uniform float uStory;
      uniform float uWidth;
      uniform float uIsStory;
      uniform float uFlow;
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
        if(uIsStory > .5){
          float arrival=smoothstep(.06+aStory.y*.08,.2+aStory.y*.075,uStory);
          float ring=smoothstep(.51,.73,uStory);
          float phase=mod(aStory.x + uFlow*(.55+aStory.y*.45),6.283185);
          float theta=mix(.55+phase/6.283185*5.1,phase,ring);
          float tube=(aStory.z-.5)*(.3+pow(aStory.y,3.)*1.4);
          float radius=2.8+tube;
          vec3 stream=vec3(-1.65+cos(theta)*radius*1.22, sin(theta)*radius*1.03, sin(theta*1.5)*1.7+tube);
          vec3 wreath=vec3(cos(theta)*radius*1.43,sin(theta)*radius*.96,sin(theta*2.)*.6+tube);
          offset=mix(aOffset,mix(stream,wreath,ring),arrival);
          offset.x-=smoothstep(.78,.94,uStory)*1.4;
          // The very same larger hero grains join the stream and settle into its scale.
          local*=mix(1.,mix(1.,.32,aStory.w),arrival);
        }
        offset.x += sin(time * .18 + aData.y) * .28 * uMotion;
        offset.y += sin(time * .16 + aData.x) * .38 * uMotion;
        offset.z += cos(time * .13 + aData.y) * .22 * uMotion;
        float localBurst = exp(-abs(aOffset.y - uBurstY) * .32) * uBurst;
        offset += normalize(aOffset - vec3(0., uBurstY, 0.) + .001) * localBurst * 3.;
        offset.xz += vec2(sin(aData.x), cos(aData.y)) * abs(uVelocity) * .085 * uMotion;
        offset.x*=uWidth;
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

