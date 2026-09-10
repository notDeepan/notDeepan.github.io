import * as THREE from 'three';
import { assetPath } from '@/lib/assetPath';

/** One restrained library: cut glass, quarried stone, brushed metal and a folded sheet. */
export function materialIngredient(index: number, mobile: boolean) {
  const group = new THREE.Group();
  const portraitTextures:THREE.Texture[]=[];
  const portraitLoads:Array<()=>void>=[];
  let disposed=false,portraitsStarted=false;
  const stone = new THREE.MeshStandardMaterial({color:'#777770',roughness:.96,vertexColors:true});

  stone.onBeforeCompile=shader=>{
    shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vStone;').replace('#include <begin_vertex>','#include <begin_vertex>\nvStone=position;');
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
      varying vec3 vStone;
      float stoneNoise(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
    `).replace('#include <color_fragment>',`#include <color_fragment>
      float grit=stoneNoise(floor(vStone*280.));
      float vein=sin(vStone.y*65.+sin(vStone.x*23.)*3.+vStone.z*29.);
      diffuseColor.rgb*=.52+grit*.62+vein*.08;
    `).replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
      float relief=stoneNoise(floor(vStone*140.))*.004;
      vec3 surfaceX=dFdx(vStone),surfaceY=dFdy(vStone);
      vec3 r1=cross(surfaceY,normal),r2=cross(normal,surfaceX);
      float determinant=dot(surfaceX,r1);
      normal=normalize(abs(determinant)*normal-sign(determinant)*(dFdx(relief)*r1+dFdy(relief)*r2));
    `);
  };
  const glass = new THREE.MeshPhysicalMaterial({color:'#bac3c8',metalness:.72,roughness:.09,clearcoat:1,transparent:true,opacity:.09,transmission:0,thickness:.15,ior:1.48,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:1.5});
  const metal = new THREE.MeshStandardMaterial({color:'#d2cdc3',metalness:1,roughness:.14,envMapIntensity:1.2});
  const paper = new THREE.MeshStandardMaterial({color:'#d4c9b8',roughness:.92,side:THREE.DoubleSide});
  const edge = new THREE.LineBasicMaterial({color:'#e4ded3',transparent:true,opacity:.55});
  const materials:THREE.Material[] = [stone,glass,metal,paper,edge];
  const add=(geometry:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0)=>{const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);group.add(mesh);return mesh;};
  const rockGeometry=()=>{
    const geometry=new THREE.IcosahedronGeometry(1,mobile?16:40);
    const points=geometry.getAttribute('position'),colors=new Float32Array(points.count*3);
    for(let i=0;i<points.count;i++){
      const x=points.getX(i),y=points.getY(i),z=points.getZ(i);
      const strata=Math.sin(x*9+y*4+z*6)*.07+Math.sin(x*31-y*18+z*24)*.022;
      const radius=1+strata+Math.sin(x*3+y*5)*.12+Math.sin(x*71+y*48+z*54)*.008;
      points.setXYZ(i,x*radius*.82,y*radius*1.32,z*radius*.58);
      const shade=.6+(Math.sin(x*77+y*63+z*81)*.5+.5)*.4;
      colors.set([shade,shade*.98,shade*.94],i*3);
    }
    geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));geometry.computeVertexNormals();return geometry;
  };
  const pane=(x:number,y:number,z:number,w:number,h:number,rx:number,ry:number,rz:number,person?:string)=>{
    const geometry=new THREE.BoxGeometry(w,h,.025);
    const mesh=add(geometry,glass,x,y,z);mesh.rotation.set(rx,ry,rz);
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),edge);mesh.add(outline);
    if(person){
      // The original cutout is bonded to the pane, under its reflected surface.
      const portraitMaterial=new THREE.MeshBasicMaterial({color:'#ddd8d0',transparent:true,opacity:.88,depthWrite:false,side:THREE.DoubleSide});
      portraitMaterial.onBeforeCompile=shader=>{
        shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vPortraitUv;').replace('#include <uv_vertex>','#include <uv_vertex>\nvPortraitUv=uv;');
        shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vPortraitUv;').replace('#include <map_fragment>',`#include <map_fragment>
          float luminance=dot(diffuseColor.rgb,vec3(.2126,.7152,.0722));
          diffuseColor.rgb=mix(vec3(luminance),diffuseColor.rgb,.65);
          vec2 border=smoothstep(vec2(0.),vec2(.07),vPortraitUv)*smoothstep(vec2(0.),vec2(.07),1.-vPortraitUv);
          diffuseColor.a*=border.x*border.y;
        `);
      };
      const portrait=new THREE.Mesh(new THREE.PlaneGeometry(w-.035,h-.035),portraitMaterial);
      portrait.position.z=.01;portrait.visible=false;portrait.renderOrder=1;
      mesh.renderOrder=2;outline.renderOrder=3;mesh.add(portrait);materials.push(portraitMaterial);
      portraitLoads.push(()=>{
        const texture=new THREE.TextureLoader().load(assetPath(`/assets/founders/${person}-portrait.webp`),loaded=>{
          if(disposed){loaded.dispose();return;}
          portrait.visible=true;
        });
        texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=mobile?2:4;
        // Preserve proportions, cropping toward the top so faces remain complete on the small pane.
        const imageAspect=1024/1536,paneAspect=w/h;
        texture.repeat.set(Math.min(1,paneAspect/imageAspect),Math.min(1,imageAspect/paneAspect));
        texture.offset.set((1-texture.repeat.x)/2,1-texture.repeat.y);
        portraitMaterial.map=texture;portraitMaterial.needsUpdate=true;portraitTextures.push(texture);
      });
    }
    return mesh;
  };
  if(index===0){
    const rock=add(rockGeometry(),stone);rock.scale.setScalar(3.4);rock.rotation.set(.2,-.3,-.2);
  }else{
    const rock=add(rockGeometry(),stone,-.9,.8,-.2);rock.rotation.set(.2,.4,-.27);rock.scale.setScalar(.92);
    pane(.75,1.05,-.35,1.65,2.3,-.1,-.55,-.22,'junes');
    pane(-.4,-1.15,.6,1.7,2.5,.14,.52,.38,'deepan');
    pane(1.4,-.65,.1,1.2,1.25,.25,-.3,.2,'shikhar');
    const sphere=add(new THREE.SphereGeometry(.43,mobile?20:40,mobile?12:28),metal,.55,-.12,.65);
    sphere.scale.setScalar(index===4?.8:1);
    if(index===2){
      const sheet=new THREE.PlaneGeometry(1.3,1.05,24,20),points=sheet.getAttribute('position');
      for(let i=0;i<points.count;i++){const x=points.getX(i),y=points.getY(i);points.setZ(i,.27*Math.sin(x*2.7)+.13*Math.cos(y*3+x));}
      sheet.computeVertexNormals();add(sheet,paper,-1.1,-1.4,.75).rotation.set(-.35,.3,-.25);
    }
  }
  const used=new Set<THREE.Material>();
  group.traverse(object=>{const drawable=object as THREE.Mesh;if(drawable.material){for(const m of Array.isArray(drawable.material)?drawable.material:[drawable.material])used.add(m);}});
  const baseOpacity=new Map([...used].map(m=>[m,m.opacity]));
  materials.forEach(m=>{if(!used.has(m))m.dispose();});
  return {group,
    loadPortraits(){if(portraitsStarted||disposed)return;portraitsStarted=true;portraitLoads.forEach(load=>load());},
    dispose(){disposed=true;portraitTextures.forEach(texture=>texture.dispose());},
    fade(value:number){group.visible=value>.001;used.forEach(m=>{m.transparent=true;m.opacity=baseOpacity.get(m)!*value;m.depthWrite=m!==glass&&m!==edge&&!(m instanceof THREE.MeshBasicMaterial)&&value>.98;});}};
}
