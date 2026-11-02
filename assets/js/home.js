import { initMotion } from './chunks/motion.js';
import { initScene } from './chunks/scene3d.js';

const menuButton=document.querySelector('#menu-button');
const nav=document.querySelector('#nav');
menuButton?.addEventListener('click',()=>document.body.classList.toggle('nav-open'));
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>document.body.classList.remove('nav-open')));

const progress=document.querySelector('#progress');
const updateProgress=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(max>0?scrollY/max*100:0)+'%';
};
addEventListener('scroll',updateProgress,{passive:true});
updateProgress();

document.querySelector('#year').textContent=String(new Date().getFullYear());

initMotion();
initScene();
