import * as THREE from 'three';

/** Sparse optical foreground: analytic rice profiles, never full-screen post-processing. */
export function depthGrains(mobile:boolean){
 const group=new THREE.Group();
 const positions=[[-.64,.12,0], [.68,.48,0], [.74,-.38,0], [-.12,-.8,0], [.43,-.7,0], [-.89,-.45,1], [.96,.14,1], [-.97,.36,1], [.26,.86,1], [.9,-.85,1], [-.46,-.32,1], [.64,.91,1]];
 const geometry=new THREE.PlaneGeometry(.42,1.05);
 const grains=positions.map(([x,y,blur],i)=>{
  const material=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{uBlur:{value:blur?.48:.045},uAlpha:{value:blur?.24:.88}},
   vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:`varying vec2 vUv;uniform float uBlur;uniform float uAlpha;
   void main(){vec2 p=(vUv-.5)*2.;p.x+=.065*sin(p.y*3.);float r=length(p/vec2(.62,.78));
    float mask=1.-smoothstep(1.-uBlur,1.+uBlur,r);
    vec2 feather=smoothstep(vec2(0.),vec2(.2),vUv)*smoothstep(vec2(0.),vec2(.2),1.-vUv);mask*=feather.x*feather.y;
    float z=sqrt(max(0.,1.-r*r));vec3 n=normalize(vec3(p.x,p.y*.27,z));
    float light=max(0.,dot(n,normalize(vec3(-.6,.35,.65))));
    float edge=pow(1.-z,2.)*.28;float spec=pow(max(0.,dot(n,normalize(vec3(-.4,.3,.9)))),24.)*.45;
    vec3 c=vec3(.52,.48,.41)*(.45+light*.62)+vec3(.73,.67,.58)*(edge+spec);
    gl_FragColor=vec4(c,mask*uAlpha);
    #include <colorspace_fragment>
   }`});
  const mesh=new THREE.Mesh(geometry,material);mesh.rotation.z=[-1.03,-.9,.14,-1.18,1.03,-.2,-1.1,.5,1,.7,-.4,.9][i];group.add(mesh);return{mesh,material,x,y,blur,i};
 });
 return{group,update(p:number,aspect:number){
  const gather=THREE.MathUtils.smoothstep(p,.06,.34);
  grains.forEach(({mesh,material,x,y,blur,i})=>{
   const depth=blur?5.5:1.5;
   const distance=12-depth,halfH=Math.tan(21*Math.PI/180)*distance;
   const angle=i*2.4+p*.6;
   mesh.position.set(THREE.MathUtils.lerp(x*halfH*aspect,Math.cos(angle)*5.5,gather),THREE.MathUtils.lerp(y*halfH,Math.sin(angle)*3.5,gather),depth);
   const scale=(blur?.95:.62)*(mobile?.65:1);
   mesh.scale.setScalar(scale*(1-gather*.35));
   material.uniforms.uAlpha.value=(blur?.16:.82)*(1-gather*.6);
  });
 }};
}
