import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.181.0/+esm';

export function initScene(){
  const canvas=document.querySelector('#hero-canvas');
  const fallback=document.querySelector('#css-orb');
  if(!canvas)return;

  try{
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(38,1,.1,100);
    camera.position.z=7;

    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.8));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;

    scene.add(new THREE.AmbientLight(0xa4e9ff,1.45));
    const key=new THREE.PointLight(0x68d7ff,40,18);key.position.set(3,3,4);scene.add(key);
    const rim=new THREE.PointLight(0x166da8,26,15);rim.position.set(-4,-2,-2);scene.add(rim);

    const group=new THREE.Group();scene.add(group);
    const knot=new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.24,.36,170,28,2,5),
      new THREE.MeshPhysicalMaterial({color:0x55c9f3,metalness:.72,roughness:.2,clearcoat:1,clearcoatRoughness:.14,emissive:0x062a42,emissiveIntensity:.55})
    );
    group.add(knot);

    const ring=new THREE.Mesh(
      new THREE.TorusGeometry(1.9,.012,8,170),
      new THREE.MeshBasicMaterial({color:0x8de7ff,transparent:true,opacity:.52})
    );
    ring.rotation.set(1.1,.48,.2);group.add(ring);

    const count=420,positions=new Float32Array(count*3);
    for(let i=0;i<count;i++){positions[i*3]=(Math.random()-.5)*8.5;positions[i*3+1]=(Math.random()-.5)*6;positions[i*3+2]=(Math.random()-.5)*4-1}
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const particles=new THREE.Points(geometry,new THREE.PointsMaterial({color:0x8fe4ff,size:.018,transparent:true,opacity:.7}));
    scene.add(particles);

    let tx=0,ty=0,px=0,py=0;
    window.addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.55;ty=(e.clientY/innerHeight-.5)*.42},{passive:true});

    const resize=()=>{const w=canvas.clientWidth||canvas.parentElement.clientWidth,h=canvas.clientHeight||canvas.parentElement.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix()};
    new ResizeObserver(resize).observe(canvas.parentElement);resize();

    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clock=new THREE.Clock();
    const render=()=>{const t=clock.getElapsedTime();px+=(tx-px)*.04;py+=(ty-py)*.04;group.rotation.x=py+(reduced?0:t*.07);group.rotation.y=px+(reduced?0:t*.12);ring.rotation.z=reduced?0:t*.1;particles.rotation.y=reduced?0:t*.012;renderer.render(scene,camera);requestAnimationFrame(render)};
    fallback.hidden=true;render();
  }catch(error){
    console.warn('WebGL unavailable; using CSS fallback.',error);
    canvas.hidden=true;
  }
}