'use client';
import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { NoToneMapping, SRGBColorSpace, PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PRESENTATION } from '@/lib/presentation';
import { scrollEngine } from '@/lib/scrollEngine';
import { SectionCompositor } from '@/lib/sectionCompositor';
import { createMaterialScenes } from './materialScenes';
import { projects } from '@/data/projects';

type Props = { onFrame:(dt:number)=>void; onUnavailable:()=>void; burst:React.RefObject<{value:number;index:number}>; projectLink:React.RefObject<HTMLAnchorElement|null> };
function RenderLoop({onFrame,burst,projectLink,onUnavailable}:Props) {
  const {gl,size,setDpr,setFrameloop} = useThree();
  const mobile=size.width<768 || size.width/size.height<1.2;
  const world = useRef<ReturnType<typeof createMaterialScenes> | null>(null);
  const compositor = useRef<SectionCompositor | null>(null);
  useEffect(()=>{
    const canvas=gl.domElement;
    canvas.addEventListener('webglcontextlost',onUnavailable,{once:true});
    // R3F deliberately loses its context on unmount. That is not a GPU failure.
    return ()=>canvas.removeEventListener('webglcontextlost',onUnavailable);
  },[gl,onUnavailable]);
  useEffect(()=>{
    const room=new RoomEnvironment();
    const generator=new PMREMGenerator(gl);
    const environment=generator.fromScene(room,.04);
    room.dispose();generator.dispose();
    world.current=createMaterialScenes(scrollEngine,{width:gl.domElement.clientWidth,height:gl.domElement.clientHeight,mobile,reducedMotion:scrollEngine.reducedMotion,environment:environment.texture});
    compositor.current=new SectionCompositor(gl,world.current.sections,undefined,mobile);
    return ()=>{compositor.current?.dispose(); world.current?.dispose();world.current=null;compositor.current=null;environment.dispose();};
  },[gl,mobile]);
  useEffect(()=>{world.current?.resize(size.width,size.height);compositor.current?.resize();},[size]);
  useEffect(()=>{setDpr(Math.min(window.devicePixelRatio,mobile?PRESENTATION.mobileDpr:PRESENTATION.desktopDpr));},[mobile,setDpr]);
  useEffect(()=>{const visibility=()=>setFrameloop(document.hidden?'never':'always');document.addEventListener('visibilitychange',visibility);visibility();return ()=>document.removeEventListener('visibilitychange',visibility);},[setFrameloop]);
  useFrame((state,dt)=>{
    scrollEngine.update(dt);
    world.current?.setBurst(burst.current.value,burst.current.index);
    compositor.current?.render(scrollEngine,dt,state.clock.elapsedTime);
    onFrame(dt);
    const link=projectLink.current,area=world.current?.projectHitArea();
    if(link){
      const url=area && projects[area.index].liveUrl;
      link.hidden=!url;
      if(area && url){
        link.href=url;
        link.setAttribute('aria-label',`Visit ${projects[area.index].title} website (opens in a new tab)`);
        link.style.clipPath=area.clipPath;
      }
    }
    const canvas=gl.domElement;
    // Compact diagnostics, useful for the runtime QA checks without exposing app state.
    if(canvas.dataset.section!==String(scrollEngine.index1)) canvas.dataset.section=String(scrollEngine.index1);
  },1);
  return null;
}
export default function ExperienceCanvas(props:Props) {
  return <div id="gl" aria-hidden="true"><Canvas dpr={[1,1.6]} gl={{alpha:false,antialias:true,powerPreference:'high-performance'}} onCreated={({gl})=>{
    gl.outputColorSpace=SRGBColorSpace;gl.toneMapping=NoToneMapping;
  }}><RenderLoop {...props}/></Canvas></div>;
}
