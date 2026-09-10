import * as THREE from 'three';
import { materialIngredient } from './materialIngredients';
import { PROJECT_MOTION } from '@/lib/presentation';
import type { ScrollEngine } from '@/lib/scrollEngine';
import type { SectionRenderable } from '@/lib/sectionCompositor';
import { cameraPoint, cameraTarget } from '@/lib/spiralPath';
import { PROJECT_WINDOWS } from '@/lib/constants';
import { projects as portfolioProjects } from '@/data/projects';

type MaterialSceneOptions = { width: number; height: number; mobile: boolean; reducedMotion: boolean; environment:THREE.Texture };
type RiceField = { mesh: THREE.Mesh; material: THREE.ShaderMaterial };

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
    offsets.set([x,y,z],i*3);
    const foreground=kind==='edges'&&seed===71&&i%17===0;
    data.set([rnd()*TAU,rnd()*TAU,foreground?1.8+rnd()*1.8:.26+rnd()*.85,rnd()],i*4);
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
      uBurst: { value: 0 }, uBurstY: { value: 0 }, uOpacity: { value: kind === 'edges' ? .78 : .94 },
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
  scene.add(new THREE.HemisphereLight('#fff0dc', '#252c32', .55));
  const key = new THREE.DirectionalLight('#ffecd3', 2.4);
  key.position.set(4, 10, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#d3dbe2', 1.6);
  rim.position.set(-6, 4, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight('#fff6e2', .7);
  fill.position.set(0, 1, -8);
  scene.add(fill);
}

export function createMaterialScenes(engine: ScrollEngine, options: MaterialSceneOptions) {
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
    scene.environment=options.environment;
    scene.environmentIntensity=.7;
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
    const sculpture=index===0?materialIngredient(0,options.mobile):index===1?materialIngredient(2,options.mobile):null;
    if(sculpture){
      lighting(scene);scene.add(sculpture.group);
      sculpture.group.position.set(index===0?(options.mobile?4.8:8.4):(options.mobile?-1.4:-2.3),index===0?-1.4:.1,index===0?-1:-.4);
      sculpture.group.scale.setScalar(index===0?1:options.mobile?.8:1.3);
    }
    const entryField=index===0?riceField(options.mobile?760:2200,254,'cloud'):null;
    if(entryField){scene.add(entryField.mesh);fields.push(entryField);}
    if(options.mobile&&kind==='halo')field.mesh.scale.x=.64;
    if(options.mobile&&kind==='edges')field.mesh.scale.x=.48;
    let elapsed = 0;
    return {
      scene, camera,
      update(dt: number) {
        const motion = reduced() ? 0 : 1;
        elapsed += Math.min(dt, .1) * motion;
        const heroProgress=engine.progressOf('founder');
        const entry=THREE.MathUtils.smoothstep(heroProgress,.34,.62)*motion;
        const vision=THREE.MathUtils.smoothstep(engine.progressOf('identity'),.43,.62)*motion;
        if(sculpture){
          sculpture.group.rotation.y=(index===0?-.2:-.25+engine.progressOf('identity')*.45)*motion;
          sculpture.fade(index===0?1-entry:1-vision*.85);
        }
        if(entryField){
          entryField.material.uniforms.uOpacity.value=entry*.95;
          entryField.material.uniforms.uTime.value=elapsed;
          entryField.material.uniforms.uVelocity.value=engine.velocity;
          entryField.mesh.rotation.z=entry*.13;
          if(options.mobile)entryField.mesh.scale.set(.72,1,1);
        }
        if(index===1){field.mesh.position.x=vision*2.1;field.mesh.rotation.z=vision*.18;}
        if(index===5||index===4){field.mesh.rotation.z=engine.progressOf(index===5?'contact':'brand')*.12*motion;}
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
  const identity = atmosphere(1, 'cloud', 2200);
  const { scene: projectScene, camera: projectCamera } = makeScene();
  lighting(projectScene);
  projectScene.fog = new THREE.FogExp2(CHARCOAL, .036);
  const projectField = riceField(options.mobile ? 1200 : 2800, 202609, 'gallery');
  projectScene.add(projectField.mesh);
  fields.push(projectField);
  const target=new THREE.Vector3();
  const position=new THREE.Vector3();
  const materialCentres:THREE.Vector3[]=[];
  portfolioProjects.forEach((_,i)=>materialCentres.push(cameraTarget(PROJECT_WINDOWS[i].peak,new THREE.Vector3())));

  let disposed = false;
  const textureLoader = new THREE.TextureLoader();
  const mediaTextures = new Set<THREE.Texture>();
  const projectPlanes = portfolioProjects.map((project, index) => {
    const geometry = new THREE.PlaneGeometry(6.0, 3.75, 24, 16);
    const vertices = geometry.getAttribute('position');
    for(let i=0;i<vertices.count;i++) vertices.setZ(i, Math.sin((vertices.getX(i)/6+.5)*Math.PI)*.18);
    geometry.computeVertexNormals();
    const material = new THREE.ShaderMaterial({
      uniforms:{uMap:{value:null},uFocal:{value:0},uDistortion:{value:0},uReady:{value:0},uAxis:{value:PROJECT_MOTION[index].axis},uCrop:{value:PROJECT_MOTION[index].crop},uImageAspect:{value:1.6}},
      transparent:true,depthWrite:true,side:THREE.DoubleSide,
      vertexShader:`varying vec2 vUv;uniform float uDistortion;void main(){vUv=uv;vec3 p=position;p.z+=sin(uv.x*7.)*uDistortion;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
      fragmentShader:`varying vec2 vUv;uniform sampler2D uMap;uniform float uFocal;uniform float uReady;uniform float uDistortion;uniform float uAxis;uniform float uCrop;uniform float uImageAspect;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      void main(){
        vec2 uv=(vUv-.5)/(1.+(1.-uFocal)*uCrop)+.5;
        uv.x=(uv.x-.5)*max(1.,1.6/uImageAspect)+.5;
        uv.y=(uv.y-.5)*max(1.,uImageAspect/1.6)+.5;
        uv.x+=sin(uv.y*8.)*uDistortion*.012;
        vec3 c=texture2D(uMap,clamp(uv,0.,1.)).rgb;
        float inside=step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.);
        c=mix(vec3(.0025,.0034,.0037),c,inside);
        float axis=mix(vUv.x,vUv.y,uAxis);
        float grain=hash(floor(vUv*vec2(240.,140.)))*.045;
        float mask=1.-smoothstep(uFocal-.055,uFocal+.055,axis*.92+grain);
        gl_FragColor=vec4(c,mask*uReady*smoothstep(0.,.15,uFocal));
        #include <colorspace_fragment>
      }`,
    });
    const mesh = new THREE.Mesh(geometry,material);
    cameraPoint(PROJECT_WINDOWS[index].peak,position);cameraTarget(PROJECT_WINDOWS[index].peak,target);
    const right=new THREE.Vector3().subVectors(target,position).cross(UP).normalize();
    mesh.position.copy(target).addScaledVector(right, options.mobile ? 0 : -2.0);
    if(options.mobile)mesh.position.y+=1.4;
    mesh.lookAt(position);mesh.rotateY(-.14);mesh.rotateZ(PROJECT_MOTION[index].tilt*.45);
    if(options.mobile)mesh.scale.setScalar(Math.min(.72,.52*width/390));
    else mesh.scale.setScalar(.9);
    mesh.visible=false;projectScene.add(mesh);
    return {mesh,material,started:false,load(){
      if(this.started)return;this.started=true;
      textureLoader.load(project.cover,texture=>{
        if(disposed){texture.dispose();return;}
        texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;mediaTextures.add(texture);
        material.uniforms.uMap.value=texture;material.uniforms.uImageAspect.value=texture.image.width/texture.image.height;material.uniforms.uReady.value=1;
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
      projectField.material.uniforms.uBurstY.value = materialCentres[burstIndex].y;
      projectPlanes.forEach((plane,index)=>{
        const distance=Math.abs(p-PROJECT_WINDOWS[index].peak);
        const focus=1-THREE.MathUtils.smoothstep(distance,.035,.078);
        plane.mesh.visible=focus>.001;
        if(distance<.18)plane.load();
        plane.material.uniforms.uFocal.value=focus;
        plane.material.uniforms.uDistortion.value=motion*(PROJECT_MOTION[index].bend*(1-focus)+Math.min(.035,Math.abs(engine.velocity)*.012));
      });
    },
  };
  const reviews = atmosphere(3, 'edges', 330);
  const brand = atmosphere(4, 'halo', 1550);
  const contact = atmosphere(5, 'halo', 1550);
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
