import * as THREE from 'three';
import { projects } from '@/data/projects';

/** A small material library. Thin surfaces, one folded sheet, one machined frame. */
export function materialIngredient(mobile: boolean) {
  const group = new THREE.Group();
  const textures: THREE.Texture[]=[];
  let disposed=false, started=false;
  const glass = new THREE.MeshPhysicalMaterial({color:'#b5bec5',metalness:.6,roughness:.22,clearcoat:.6,transparent:true,opacity:.15,side:THREE.DoubleSide,depthWrite:false,envMapIntensity:.8});
  const edge = new THREE.LineBasicMaterial({color:'#d6d3cc',transparent:true,opacity:.38});
  const paper = new THREE.MeshStandardMaterial({color:'#c3b9a7',roughness:.95,side:THREE.DoubleSide,transparent:true});
  const metal = new THREE.MeshStandardMaterial({color:'#aeaead',metalness:.95,roughness:.25,transparent:true,envMapIntensity:.8});
  const planes=projects.slice(0,3).map((project,i)=>{
    const root=new THREE.Group();group.add(root);
    const geometry=new THREE.PlaneGeometry(2.7,1.7);
    const coating=new THREE.Mesh(geometry,glass);coating.position.z=.018;coating.renderOrder=2;root.add(coating);
    const outline=new THREE.LineSegments(new THREE.EdgesGeometry(geometry),edge);outline.position.z=.02;outline.renderOrder=3;root.add(outline);
    // The real site screenshot is bonded beneath the reflective coating, never substituted.
    const imageMaterial=new THREE.MeshBasicMaterial({color:'#dedbd3',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false});
    const image=new THREE.Mesh(new THREE.PlaneGeometry(2.64,1.64),imageMaterial);image.renderOrder=1;root.add(image);
    return {root,image,imageMaterial,project,i};
  });
  const sheetGeometry=new THREE.PlaneGeometry(1.55,2.1,mobile?12:24,mobile?12:24);
  const vertices=sheetGeometry.getAttribute('position');
  for(let i=0;i<vertices.count;i++)vertices.setZ(i,.24*Math.sin(vertices.getY(i)*2)+.1*Math.cos(vertices.getX(i)*3));
  sheetGeometry.computeVertexNormals();
  const sheet=new THREE.Mesh(sheetGeometry,paper);group.add(sheet);
  const frame=new THREE.Group();group.add(frame);
  for(const [w,h,x,y] of [[1.35,.055,0,.9],[1.35,.055,0,-.9],[.055,1.8,-.65,0],[.055,1.8,.65,0]]){
    const bar=new THREE.Mesh(new THREE.BoxGeometry(w,h,.075),metal);bar.position.set(x,y,0);frame.add(bar);
  }
  function load(){
    if(started||disposed)return;started=true;
    planes.forEach(({image,imageMaterial,project})=>{
      const texture=new THREE.TextureLoader().load(project.cover,loaded=>{
        if(disposed){loaded.dispose();return;}
        // Contain the complete screenshot; no fabricated project photography.
        const aspect=loaded.image.width/loaded.image.height;
        image.scale.set(Math.min(1,aspect/1.6),Math.min(1,1.6/aspect),1);
        imageMaterial.map=loaded;imageMaterial.needsUpdate=true;
      });
      texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=mobile?2:4;textures.push(texture);
    });
  }
  return {group,
    update(p:number,isMobile:boolean){
      const enter=THREE.MathUtils.smoothstep(p,.36,.46);
      const vision=THREE.MathUtils.smoothstep(p,.57,.74);
      const preview=THREE.MathUtils.smoothstep(p,.78,.94);
      if(p>.3)load();
      group.visible=enter>.001;
      group.scale.setScalar(isMobile?THREE.MathUtils.lerp(.48,.58,vision):1);
      group.position.x=THREE.MathUtils.lerp(isMobile?-.8:-1.65,0,vision);
      group.position.y=isMobile?.45:0;
      glass.opacity=.15*enter;edge.opacity=.38*enter;
      planes.forEach(({root,imageMaterial},i)=>{
        const angle=i*Math.PI*2/3+.65;
        const x=THREE.MathUtils.lerp([-1.1,1.1,.5][i],Math.cos(angle)*3.3,vision);
        const y=THREE.MathUtils.lerp([1.25,.7,-1.65][i],Math.sin(angle)*2.55,vision);
        root.position.set(THREE.MathUtils.lerp(x,i===0?(isMobile?0:-1.6):x*1.45,preview),THREE.MathUtils.lerp(y,i===0?(isMobile?1:0):y,preview),i===0?preview*1.3:0);
        root.rotation.set(.08*(1-preview),(i===1?.5:-.4)*(1-preview*.7),[.2,-.3,.12][i]*(1-preview));
        root.scale.setScalar(THREE.MathUtils.lerp(enter,i===0?(isMobile?1.42:1.7):.65,preview));
        imageMaterial.opacity=THREE.MathUtils.smoothstep(p,.7+i*.025,.84+i*.025)*(i===0?.94:.6);
      });
      sheet.position.set(-1.25,-.65,.25);sheet.rotation.set(.12,-.35,-.18);sheet.scale.setScalar(enter*(1-vision));
      frame.position.set(.45,.1,-.4);frame.rotation.set(.15,.5,-.3);frame.scale.setScalar(enter*(1-vision));
    },
    dispose(){disposed=true;textures.forEach(texture=>texture.dispose());}
  };
}
