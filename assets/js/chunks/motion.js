import { animate, stagger } from 'https://cdn.jsdelivr.net/npm/animejs@4.2.2/+esm';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initMotion(){
  if(!reduced){
    animate('.hero-line',{translateY:['110%','0%'],opacity:[0,1],delay:stagger(110,{start:140}),duration:950,ease:'out(4)'});
    animate('.eyebrow,.hero-copy>p,.hero-actions,.hero-meta',{opacity:[0,1],translateY:[14,0],delay:stagger(120,{start:420}),duration:720,ease:'out(3)'});
  }

  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      const el=entry.target;
      el.classList.remove('reveal');
      if(!reduced) animate(el,{opacity:[0,1],translateY:[24,0],duration:760,ease:'out(3)'});
      observer.unobserve(el);
    });
  },{threshold:.13});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

  const replay=()=>{
    if(reduced)return;
    animate('#type-word span',{translateY:[22,0],opacity:[0,1],rotate:[-10,0],delay:stagger(80),duration:620,ease:'out(4)'});
  };
  document.querySelector('#replay-type')?.addEventListener('click',replay);
  replay();

  const orbitStage=document.querySelector('#orbit-stage');
  const object=document.querySelector('#interactive-object');
  orbitStage?.addEventListener('pointermove',event=>{
    const r=orbitStage.getBoundingClientRect();
    const x=(event.clientX-r.left)/r.width-.5;
    const y=(event.clientY-r.top)/r.height-.5;
    object.style.transform=`translate(${x*52}px,${y*40}px) rotate(${x*20}deg)`;
  });
  orbitStage?.addEventListener('pointerleave',()=>{object.style.transform='';});

  const presets={
    orbit:{code:"animate('.demo-object', {\n  x: [0, 110, 0],\n  rotate: '1turn',\n  duration: 2200,\n  loop: true\n});",opts:{x:[0,110,0],rotate:'1turn',duration:2200,loop:true,ease:'inOut(3)'}},
    bounce:{code:"animate('.demo-object', {\n  y: [0, -82, 0],\n  scale: [1, 1.12, 1],\n  duration: 1000,\n  loop: true\n});",opts:{y:[0,-82,0],scale:[1,1.12,1],duration:1000,loop:true,ease:'inOut(3)'}},
    pulse:{code:"animate('.demo-object', {\n  scale: [1, 1.3, 1],\n  rotate: ['0deg','18deg','0deg'],\n  duration: 1500,\n  loop: true\n});",opts:{scale:[1,1.3,1],rotate:['0deg','18deg','0deg'],duration:1500,loop:true,ease:'inOut(3)'}}
  };
  let current='orbit',instance=null;
  const demo=document.querySelector('#demo-object');
  const output=document.querySelector('#code-output');
  const stop=()=>{instance?.pause();instance=null;if(demo)demo.style.transform='';};

  document.querySelectorAll('.preset').forEach(button=>{
    button.addEventListener('click',()=>{
      current=button.dataset.preset;
      document.querySelectorAll('.preset').forEach(b=>b.classList.toggle('active',b===button));
      output.textContent=presets[current].code;
      stop();
    });
  });
  document.querySelector('#run-demo')?.addEventListener('click',()=>{stop();instance=animate(demo,presets[current].opts);});
  document.querySelector('#reset-demo')?.addEventListener('click',stop);
  document.querySelector('#copy-code')?.addEventListener('click',async e=>{
    try{await navigator.clipboard.writeText(presets[current].code);e.currentTarget.textContent='COPIED ✓';setTimeout(()=>e.currentTarget.textContent='COPY',1200)}
    catch{e.currentTarget.textContent='SELECT CODE'}
  });
}