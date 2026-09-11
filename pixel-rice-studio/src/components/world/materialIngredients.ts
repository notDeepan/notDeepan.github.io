import * as THREE from 'three';
import { assetPath } from '@/lib/assetPath';
import { projects } from '@/data/projects';

/** A small material library. Thin surfaces, one folded sheet, one machined frame. */
export function materialIngredient(mobile: boolean) {
  const group = new THREE.Group();
  const textures: THREE.Texture[]=[];
  let disposed=false, started=false;
  const glass = new THREE.MeshPhysicalMaterial({color:'#b5bec5',metalness:.72,roughness:.16,clearcoat:1,transparent:true,opacity:.42,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:1.35});
  glass.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vGlassUv;').replace('#include <uv_vertex>','#include <uv_vertex>\nvGlassUv=uv;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vGlassUv;').replace('#include <color_fragment>',`#include <color_fragment>
      float cloud=sin(vGlassUv.x*9.+sin(vGlassUv.y*8.)*2.)*sin(vGlassUv.y*5.+vGlassUv.x*3.);
      diffuseColor.rgb*=.42+cloud*.4;
      float glint=pow(max(0.,1.-abs(vGlassUv.x-vGlassUv.y*.48-.16)*3.),12.);
      diffuseColor.rgb+=vec3(.36,.4,.45)*glint;
    `);
  };
  const edge = new THREE.LineBasicMaterial({color:'#d6d3cc',transparent:true,opacity:.5});
  const paper = new THREE.MeshStandardMaterial({color:'#c3b9a7',roughness:.95,side:THREE.DoubleSide,transparent:true});
  const metal = new THREE.MeshStandardMaterial({color:'#aeaead',metalness:.95,roughness:.16,transparent:true,envMapIntensity:1.1});
  const planes=projects.slice(0,3).map((project,i)=>{
    const root=new THREE.Group();group.add(root);
    const geometry=new THREE.PlaneGeometry(2.7,1.7,1,1);
    const corners=geometry.getAttribute('position');
    for(let v=0;v<corners.count;v++)corners.setZ(v,corners.getX(v)*corners.getY(v)*.12);
    geometry.computeVertexNormals();
    const coating=new THREE.Mesh(geometry,glass);coating.position.z=.018;coating.renderOrder=2;root.add(coating);
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,35),edge);outline.position.z=.02;outline.renderOrder=3;root.add(outline);
    // The real site screenshot is bonded beneath the reflective coating, never substituted.
    const imageMaterial=new THREE.MeshBasicMaterial({color:'#dedbd3',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
    const image=new THREE.Mesh(new THREE.PlaneGeometry(2.64,1.64),imageMaterial);image.renderOrder=1;root.add(image);
    return {root,image,imageMaterial,project,i,projectMap:null as THREE.Texture|null,portraitMap:null as THREE.Texture|null};
  });
  const sheetGeometry=new THREE.PlaneGeometry(1.55,2.1,mobile?12:24,mobile?12:24);
  const vertices=sheetGeometry.getAttribute('position');
  for(let i=0;i<vertices.count;i++)vertices.setZ(i,.24*Math.sin(vertices.getY(i)*2)+.1*Math.cos(vertices.getX(i)*3));
  sheetGeometry.computeVertexNormals();
  const sheet=new THREE.Mesh(sheetGeometry,paper);group.add(sheet);
  const sphere=new THREE.Mesh(new THREE.SphereGeometry(.58,mobile?24:40,mobile?16:24),metal);group.add(sphere);
  const shards=[[-2.3,.4,1.4,1.1],[1.5,2.1,1.1,2.1]].map(([x,y,w,h])=>{
    const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),glass);mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),edge));group.add(mesh);return mesh;
  });
  function load(){
    if(started||disposed)return;started=true;
    planes.forEach(plane=>{
      const {image,imageMaterial,project,i}=plane;
      const texture=new THREE.TextureLoader().load(project.cover,loaded=>{
        if(disposed){loaded.dispose();return;}
        // Contain the complete screenshot; no fabricated project photography.
        const aspect=loaded.image.width/loaded.image.height;
        image.scale.set(Math.min(1,aspect/1.6),Math.min(1,1.6/aspect),1);
        plane.projectMap=loaded;
      });
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=mobile?2:4;textures.push(texture);
      const portrait=new THREE.TextureLoader().load(assetPath(`/assets/founders/${['deepan','junes','shikhar'][i]}-portrait.webp`),loaded=>{
        if(disposed){loaded.dispose();return;}plane.portraitMap=loaded;
      });
      portrait.colorSpace=THREE.SRGBColorSpace;portrait.repeat.set(1,(2/3)/1.6);portrait.offset.y=1-portrait.repeat.y;textures.push(portrait);
    });
  }
  return {group,
    update(p:number,isMobile:boolean){
      const enter=THREE.MathUtils.smoothstep(p,.36,.46);
      const vision=THREE.MathUtils.smoothstep(p,.57,.74);
      const preview=THREE.MathUtils.smoothstep(p,.78,.94);
      if(p>.3)load();
      group.visible=enter>.001;
      group.scale.setScalar(isMobile?THREE.MathUtils.lerp(.53,.58,vision):THREE.MathUtils.lerp(1.22,1.1,vision)*(1-preview)+preview);
      group.position.x=THREE.MathUtils.lerp(isMobile?-1.05:-1.65,0,vision);
      group.position.y=isMobile?.45:.3*(1-vision);
      glass.opacity=THREE.MathUtils.lerp(.42,.34,vision)*enter;edge.opacity=THREE.MathUtils.lerp(.5,.34,vision)*enter;
      glass.roughness=THREE.MathUtils.lerp(.16,.08,vision);
      glass.envMapIntensity=THREE.MathUtils.lerp(1.35,2.5,vision);
      planes.forEach(({root,imageMaterial,portraitMap},i)=>{
        const map=portraitMap;
        if(imageMaterial.map!==map){imageMaterial.map=map;imageMaterial.needsUpdate=true;}
        const x=THREE.MathUtils.lerp([-1.1,1.1,.5][i],[-1.35,-2.85,2.15][i],vision);
        const y=THREE.MathUtils.lerp([1.25,.7,-1.65][i],[2.65,.05,-1.4][i]*(isMobile?1.22:1),vision);
        root.position.set(THREE.MathUtils.lerp(x,i===0?(isMobile?0:-1.6):x*1.45,preview),THREE.MathUtils.lerp(y,i===0?(isMobile?1:0):y,preview),[-.35,.15,.45][i]*vision);
        root.rotation.set(
          THREE.MathUtils.lerp([.24,-.38,.35][i],[1.55,.22,.25][i],vision)*(1-preview),
          THREE.MathUtils.lerp([.5,-.7,.45][i],[.25,1.65,-.85][i],vision)*(1-preview*.7),
          THREE.MathUtils.lerp([.35,-.32,.24][i],[-.12,-.2,.6][i],vision)*(1-preview));
        root.scale.setScalar(THREE.MathUtils.lerp(enter,i===0?(isMobile?1.42:1.7):.65,preview)*(isMobile?1-.16*vision*(1-preview):1));
        root.scale.y*=1+vision*(i===1?.6:0);
        imageMaterial.opacity=THREE.MathUtils.smoothstep(p,.44,.51)*.42*(1-vision);
      });
      sheet.position.set(.75,1.15,-.6);sheet.rotation.set(.4,.8,-.22);sheet.scale.set(.65,1.05,1).multiplyScalar(enter*(1-vision));
      sphere.position.set(-.5,-.2,.85);sphere.scale.setScalar(enter*(1-vision));
      shards.forEach((mesh,i)=>{
        mesh.position.set(i===0?2.05:.25,i===0?2.05:-2.8,-.15);
        mesh.rotation.set(THREE.MathUtils.lerp([.6,-.55][i],[.22,1.16][i],vision),[-.6,.3][i],THREE.MathUtils.lerp([.55,-.4][i],[.36,-.55][i],vision));
        mesh.scale.setScalar(enter*(.45+vision*.55)*(1-preview));
        if(i===0)mesh.scale.y*=1+vision*1.15;
      });
    },
    dispose(){disposed=true;textures.forEach(texture=>texture.dispose());}
  };
}
