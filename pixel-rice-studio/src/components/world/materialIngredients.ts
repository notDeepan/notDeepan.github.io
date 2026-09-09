import * as THREE from 'three';

/** A small family of constructed materials, shared by studio and project interludes. */
export function materialIngredient(index: number, mobile: boolean) {
  const group = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({color:'#d6d5c5',metalness:.9,roughness:.18,envMapIntensity:1.8});
  const stone = new THREE.MeshStandardMaterial({color:'#77786b',roughness:.94,flatShading:true});
  const paper = new THREE.MeshPhysicalMaterial({color:'#e0d9bd',roughness:.83,side:THREE.DoubleSide,sheen:.25,sheenColor:new THREE.Color('#edeadb')});
  // An inexpensive coated pane on mobile; desktop receives a lightly transmitting solid.
  const glass = new THREE.MeshPhysicalMaterial({color:'#aab297',roughness:.17,metalness:.08,clearcoat:1,transparent:true,opacity:.58,transmission:mobile?0:.4,thickness:.2,ior:1.45,depthWrite:false});
  const materials = [metal, stone, paper, glass];
  const add = (geometry:THREE.BufferGeometry,material:THREE.Material,x=0,y=0,z=0) => {
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);group.add(mesh);return mesh;
  };
  const frame = (w:number,h:number,z:number) => {
    add(new THREE.BoxGeometry(w,.045,.065),metal,0,h/2,z);
    add(new THREE.BoxGeometry(w,.045,.065),metal,0,-h/2,z);
    add(new THREE.BoxGeometry(.045,h,.065),metal,-w/2,0,z);
    add(new THREE.BoxGeometry(.045,h,.065),metal,w/2,0,z);
  };
  if(index===0) {
    frame(3.3,2.3,0);frame(3.3,2.3,-.65);
    for(let i=0;i<5;i++)add(new THREE.BoxGeometry(.1,1.7,.22),metal,-1.15+i*.57,0,-.3);
    add(new THREE.BoxGeometry(1.2,.55,.45),stone,.65,-.92,.3);
  } else if(index===1) {
    frame(2.4,3.1,0);
    const pane=add(new THREE.BoxGeometry(2.3,3,.08),glass);pane.rotation.y=.24;
    const second=add(new THREE.BoxGeometry(1.55,2.25,.09),glass,.85,-.25,.6);second.rotation.z=-.18;
    add(new THREE.BoxGeometry(2.8,.18,.7),stone,0,-1.6,0);
  } else if(index===3) {
    const block=add(new THREE.DodecahedronGeometry(1.4,0),stone);block.scale.set(1.45,.7,.55);block.rotation.set(.35,.15,-.15);
    frame(2.9,2.2,-.4);
    add(new THREE.BoxGeometry(2.5,.04,1.2),glass,0,.75,0).rotation.z=.14;
  } else {
    const sheet=new THREE.PlaneGeometry(3.1,2.4,24,16);
    const points=sheet.getAttribute('position');
    for(let i=0;i<points.count;i++) {
      const x=points.getX(i),y=points.getY(i);
      points.setZ(i,.42*Math.abs(x)+Math.sin(y*1.4)*.16);
    }
    sheet.computeVertexNormals();
    const fold=add(sheet,paper);fold.rotation.set(-.32,.58,index===4?-.4:.17);
    frame(2.65,1.9,-.3);
    if(index===4)add(new THREE.BoxGeometry(.5,.5,.5),stone,1.2,.85,.2).rotation.set(.4,.5,.25);
  }
  // Keep base opacity so fading a glass pane never turns it opaque.
  const opacity=materials.map(m=>m.opacity);
  const used=new Set<THREE.Material>();group.traverse(o=>{if(o instanceof THREE.Mesh)used.add(o.material as THREE.Material);});
  materials.forEach(m=>{if(!used.has(m))m.dispose();else m.transparent=true;});
  return {group,fade(value:number){group.visible=value>.001;materials.forEach((m,i)=>{if(used.has(m)){m.opacity=opacity[i]*value;m.depthWrite=m!==glass&&value>.98;}});}};
}
