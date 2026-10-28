const $=s=>document.querySelector(s);
import {mountMultiverse} from './multiverse.js';

// Reuse the mounted models: changing chapters never destroys the experiment.
export function reviseLessons(index){
 if(index===0){mountMultiverse();return}
 document.body.classList.add('revised');
 if(index===1)forestRoom();else boostingStudio();
 readingFirst(index);
}

function readingFirst(index){
 const body=$('.lesson-body'),story=$('.story'),lab=$('.lab'),nav=$('.chapter-nav');
 document.body.classList.add('reading-first');
 // The complete lesson stays in document order, before the single experiment.
 [...story.children].forEach(s=>{s.hidden=false;s.tabIndex=-1});
 body.prepend(nav,story);
 $('.room-chapter-bar')?.remove();$('.room-next')?.remove();$('.studio-deck-head')?.remove();
 nav.querySelectorAll('a').forEach(a=>{a.onclick=null;a.classList.remove('chosen');a.removeAttribute('aria-current')});
 const heading=document.createElement('section');heading.className='experiment-intro';heading.id='experiment';
 heading.innerHTML=`<span class="eyebrow">ЕНДІ ӨЗІҢ ТӘЖІРИБЕ ЖАСА</span><h2>${index===1?'Теориядан — тірі орманға.':'Енді қатені өзің түзет.'}</h2><p>Алдымен идеяны түсіндік. Енді параметрлерді өзгертіп, нәтиженің қалай өзгеретінін тексер.</p>`;
 body.append(heading);
 if(index===1)body.append(lab);else body.append($('.studio-counter'),lab);
 const jump=document.createElement('a');jump.className='btn secondary small experiment-jump';jump.href='#experiment';jump.textContent='Тәжірибеге өту ↓';$('.lesson-head').append(jump);
}

function forestRoom(){
 const story=$('.story'),lab=$('.lab'),nav=$('.chapter-nav');
 document.body.classList.add('forest-room');
 // Turn the reading dossiers into six chapters of one interactive room.
 [...story.children].forEach(section=>{
  const details=section.querySelector('details');
  if(!details)return;
  const summary=details.querySelector('summary'),content=details.querySelector('.dossier-content');
  const title=document.createElement('h2');title.textContent=summary.children[1].textContent;
  section.replaceChildren(title,...content.childNodes);
 });
 const caption=document.createElement('div');caption.className='forest-orbit-caption';caption.innerHTML='<span>ТӘУЕЛСІЗ МОДЕЛЬДЕР</span><strong>Көп көзқарас.<br>Бір шешім.</strong><p>Әр ағашты таңдап, оның дауысын зертте.</p>';lab.querySelector('#scene').before(caption);
 function orbit(){
  const svg=lab.querySelector('#scene svg');if(!svg)return;const nodes=[...svg.querySelectorAll('[data-tree]')];if(!nodes.length)return;
  svg.setAttribute('viewBox','0 0 960 560');
  // Keep only the real tree votes; arrange them around their combined prediction.
  [...svg.children].forEach(n=>{if(!n.hasAttribute('data-tree'))n.remove()});
  const ns='http://www.w3.org/2000/svg',ring=document.createElementNS(ns,'g');
  let a=0;nodes.forEach((node,i)=>{
   const theta=i/nodes.length*Math.PI*2-Math.PI/2,x=480+Math.cos(theta)*350,y=265+Math.sin(theta)*205;
   if(node.getAttribute('aria-label').includes('A класы'))a++;
   node.classList.remove('node-in');
   node.setAttribute('transform',`translate(${x},${y})`);
   node.querySelector('g').setAttribute('transform','translate(0,-18) scale(1.6)');
   const label=node.querySelector('text');label.setAttribute('x','0');label.setAttribute('y','58');label.setAttribute('font-size','13');
   const line=document.createElementNS(ns,'path');line.setAttribute('d',`M480 265 L${x} ${y}`);line.setAttribute('stroke','var(--line)');line.setAttribute('stroke-dasharray','4 6');ring.append(line);
  });
  const b=nodes.length-a;
  ring.innerHTML+=`<ellipse cx="480" cy="265" rx="350" ry="205" fill="none" stroke="var(--line)"/><circle cx="480" cy="265" r="82" fill="var(--bg)" stroke="var(--accent)"/><text x="480" y="240" text-anchor="middle" font-size="11" fill="var(--muted)">ОРТАҚ БОЛЖАМ</text><text x="480" y="285" text-anchor="middle" font-size="42" fill="var(--accent)">${a>=b?'A':'B'}</text><text x="480" y="315" text-anchor="middle" font-size="13" fill="var(--muted)">A ${a} : ${b} B</text>`;
  svg.prepend(ring);
 }
 new MutationObserver(orbit).observe($('#scene'),{childList:true});orbit();
}

function boostingStudio(){
 document.body.classList.add('boost-studio');
 const story=$('.story'),lab=$('.lab'),nav=$('.chapter-nav');
 const counter=document.createElement('div');counter.className='studio-counter';counter.innerHTML='<div><span>ТҮЗЕТУЛЕР СТУДИЯСЫ</span><strong id="studio-iteration">00</strong></div><p>Кішкентай өзгерістер.<br>Жинақталған нәтиже.</p><div class="studio-equation">Fₘ = Fₘ₋₁ + η · hₘ</div>';lab.before(counter);
 const metrics=$('#step-count');const update=()=>$('#studio-iteration').textContent=metrics.textContent.padStart(2,'0');new MutationObserver(update).observe(metrics,{childList:true,characterData:true,subtree:true});update();
}
