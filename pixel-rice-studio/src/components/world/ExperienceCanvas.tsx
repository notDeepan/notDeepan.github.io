'use client';
import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { NoToneMapping, SRGBColorSpace } from 'three';
import { scrollEngine } from '@/lib/scrollEngine';
import { SectionCompositor } from '@/lib/sectionCompositor';
import { createFoodScenes } from './foodScenes';
import { projects } from '@/data/projects';

type Props = { onFrame:(dt:number)=>void; onUnavailable:()=>void; burst:React.RefObject<{value:number;index:number}>; projectLink:React.RefObject<HTMLAnchorElement|null> };
function RenderLoop({onFrame,burst,projectLink}:Props) {
  const {gl,size} = useThree();
  const mobile=size.width<768 || size.width/size.height<1.2;
  const world = useRef<ReturnType<typeof createFoodScenes> | null>(null);
  const compositor = useRef<SectionCompositor | null>(null);
  useEffect(()=>{
    world.current=createFoodScenes(scrollEngine,{width:gl.domElement.clientWidth,height:gl.domElement.clientHeight,mobile,reducedMotion:scrollEngine.reducedMotion});
    compositor.current=new SectionCompositor(gl,world.current.sections,undefined,mobile);
    return ()=>{compositor.current?.dispose(); world.current?.dispose();world.current=null;compositor.current=null;};
  },[gl,mobile]);
  useEffect(()=>{world.current?.resize(size.width,size.height);compositor.current?.resize();},[size]);
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
    gl.domElement.addEventListener('webglcontextlost',props.onUnavailable,{once:true});
  }}><RenderLoop {...props}/></Canvas></div>;
}
