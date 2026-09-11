import * as THREE from 'three';
import { riceField, type RiceField } from './grainField';
import { storyProgress } from '@/lib/storyTimeline';
import { depthGrains } from './depthGrains';
import { materialIngredient } from './materialIngredients';
import { PROJECT_MOTION } from '@/lib/presentation';
import type { ScrollEngine } from '@/lib/scrollEngine';
import type { SectionRenderable } from '@/lib/sectionCompositor';
import { cameraPoint, cameraTarget } from '@/lib/spiralPath';
import { PROJECT_WINDOWS } from '@/lib/constants';
import { projects as portfolioProjects } from '@/data/projects';

type MaterialSceneOptions = { width: number; height: number; mobile: boolean; reducedMotion: boolean; environment:THREE.Texture };
const CHARCOAL = '#080b0c';
const UP = new THREE.Vector3(0, 1, 0);

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
  const disposeSculptures:Array<()=>void>=[];
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
    if(options.mobile&&kind==='halo')field.mesh.scale.x=.64;
    if(options.mobile&&kind==='edges')field.mesh.scale.x=.48;
    let elapsed = 0;
    return {
      scene, camera,

      update(dt: number) {
        const motion = reduced() ? 0 : 1;
        elapsed += Math.min(dt, .1) * motion;
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

  // Both chapter slots reference this exact renderable: no renderer swap or wipe.
  const {scene: storyScene, camera: storyCamera}=makeScene();
  lighting(storyScene);
  const storyField=riceField(options.mobile?1100:3900,71,'story');
  storyScene.add(storyField.mesh);fields.push(storyField);
  if(options.mobile)storyField.material.uniforms.uWidth.value=.47;
  const ingredients=materialIngredient(options.mobile);
  storyScene.add(ingredients.group);disposeSculptures.push(ingredients.dispose);
  const depth=depthGrains(options.mobile);storyScene.add(depth.group);
  let storyTime=0,flow=0;
  const founder:SectionRenderable={scene:storyScene,camera:storyCamera,
    update(dt){
      const p=storyProgress(engine.smooth,engine.section('projects').startPx,engine.narrativeViewportH);
      const moving=Math.min(1,Math.abs(engine.velocity));
      storyTime+=Math.min(dt,.1)*(.035+moving*.6);
      flow+=Math.min(dt,.1)*(.012+moving*.28)*THREE.MathUtils.smoothstep(p,.08,.3);
      const uniforms=storyField.material.uniforms;
      uniforms.uStory.value=p;uniforms.uFlow.value=flow;uniforms.uTime.value=storyTime;
      uniforms.uVelocity.value=engine.velocity;
      // Composition only: retain the same particles, path, phase and transition timings.
      const frameVision=THREE.MathUtils.smoothstep(p,.57,.74)*(1-THREE.MathUtils.smoothstep(p,.78,.94));
      storyField.mesh.scale.set(1+frameVision*.13,1+frameVision*.08,1);
      const travel=THREE.MathUtils.smoothstep(p,.08,.4);
      storyCamera.position.set(options.mobile?0:Math.sin(p*Math.PI)*.25,0,12-travel*(options.mobile?.3:1));
      storyCamera.lookAt(0,0,0);
      ingredients.update(p,options.mobile);
      depth.update(p,width/height);
    }
  };
  const identity=founder;
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
      disposeSculptures.forEach(dispose=>dispose());
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
