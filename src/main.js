import './style.css';
import { animate, stagger } from 'animejs';
import * as THREE from 'three';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const menu = document.querySelector('.menu-button');
menu?.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('nav-open')));
if(!reduced){
  animate('.hero h1 span',{translateY:['110%','0%'],opacity:[0,1],duration:1000,delay:stagger(120),ease:'out(4)'});
  animate('.hero .eyebrow,.hero p,.hero .actions',{opacity:[0,1],translateY:[15,0],delay:stagger(130,{start:350}),duration:750});
}
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('reveal');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;document.querySelector('.scroll-progress').style.width=(max?scrollY/max*100:0)+'%'},{passive:true});
document.querySelector('#year').textContent=new Date().getFullYear();

try{
 const canvas=document.querySelector('#hero-canvas'),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);
 camera.position.z=6.8;
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.8));renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene.add(new THREE.AmbientLight(0x9bdfff,1.5));
 const light=new THREE.PointLight(0x66d4ff,45);light.position.set(3,3,4);scene.add(light);
 const group=new THREE.Group();scene.add(group);
 const knot=new THREE.Mesh(new THREE.TorusKnotGeometry(1.15,.34,180,28,2,5),new THREE.MeshPhysicalMaterial({color:0x58c8f2,metalness:.72,roughness:.2,clearcoat:1,emissive:0x06304a,emissiveIntensity:.5}));group.add(knot);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1.8,.012,8,180),new THREE.MeshBasicMaterial({color:0x8be6ff,transparent:true,opacity:.6}));ring.rotation.set(1,.5,.2);group.add(ring);
 const pts=new Float32Array(1200);for(let i=0;i<400;i++){pts[i*3]=(Math.random()-.5)*8;pts[i*3+1]=(Math.random()-.5)*6;pts[i*3+2]=(Math.random()-.5)*4}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pts,3));scene.add(new THREE.Points(geo,new THREE.PointsMaterial({color:0x8adfff,size:.018,transparent:true,opacity:.7})));
 let px=0,py=0,tx=0,ty=0;addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*.5;ty=(e.clientY/innerHeight-.5)*.4},{passive:true});
 const resize=()=>{let w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(canvas.parentElement);resize();
 const clock=new THREE.Clock();function render(){let t=clock.getElapsedTime();px+=(tx-px)*.04;py+=(ty-py)*.04;group.rotation.x=py+(reduced?0:t*.07);group.rotation.y=px+(reduced?0:t*.12);ring.rotation.z=reduced?0:t*.1;renderer.render(scene,camera);requestAnimationFrame(render)}document.querySelector('.fallback').hidden=true;render();
}catch(e){console.warn('WebGL unavailable; using CSS fallback.',e);document.querySelector('#hero-canvas').hidden=true}

const orbit=document.querySelector('.orbit');orbit.addEventListener('pointermove',e=>{let r=orbit.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;orbit.querySelector('.orb').style.transform=`translate(${x*45}px,${y*35}px)`});
const letters=document.querySelectorAll('.type-demo span');function replay(){if(!reduced)animate(letters,{translateY:[22,0],opacity:[0,1],delay:stagger(90),duration:650,ease:'out(4)'})}document.querySelector('.replay').addEventListener('click',replay);replay();
const demo=document.querySelector('.demo'),code=document.querySelector('.code');
const presets={orbit:{code:`animate('.demo', {\n  x: [0, 100, 0],\n  rotate: '1turn',\n  duration: 2200,\n  loop: true\n});`,opts:{x:[0,100,0],rotate:'1turn',duration:2200,loop:true,ease:'inOut(3)'}},bounce:{code:`animate('.demo', {\n  y: [0, -80, 0],\n  scale: [1, 1.12, 1],\n  duration: 1000,\n  loop: true\n});`,opts:{y:[0,-80,0],scale:[1,1.12,1],duration:1000,loop:true,ease:'inOut(3)'}},pulse:{code:`animate('.demo', {\n  scale: [1, 1.28, 1],\n  rotate: ['0deg', '18deg', '0deg'],\n  duration: 1500,\n  loop: true\n});`,opts:{scale:[1,1.28,1],rotate:['0deg','18deg','0deg'],duration:1500,loop:true,ease:'inOut(3)'}}};
let selected='orbit',animation;function stop(){animation?.pause();animation=null;demo.style.transform=''}document.querySelectorAll('.preset').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.preset;document.querySelectorAll('.preset').forEach(x=>x.classList.toggle('active',x===b));code.textContent=presets[selected].code;stop()}));
document.querySelector('.run').addEventListener('click',()=>{stop();animation=animate(demo,presets[selected].opts)});document.querySelector('.reset').addEventListener('click',stop);
document.querySelector('.copy').addEventListener('click',async e=>{try{await navigator.clipboard.writeText(presets[selected].code);e.currentTarget.textContent='COPIED ✓';setTimeout(()=>e.currentTarget.textContent='COPY CODE',1200)}catch{e.currentTarget.textContent='COPY UNAVAILABLE'}});
