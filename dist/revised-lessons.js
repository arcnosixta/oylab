const $=s=>document.querySelector(s);

// Reuse the mounted models: changing chapters never destroys the experiment.
export function reviseLessons(index){
 if(index===0)return;
 document.body.classList.add('revised');
 if(index===1)forestRoom();else boostingStudio();
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
 const sections=[...story.children],links=[...nav.querySelectorAll('a')];
 const chapterBar=document.createElement('div');chapterBar.className='room-chapter-bar';chapterBar.innerHTML='<span>ЗЕРТТЕУ БӨЛМЕСІ</span><span id="room-chapter-count">01 / 06</span>';
 story.before(chapterBar);story.before(nav);
 const next=document.createElement('div');next.className='room-next';next.innerHTML='<button class="btn secondary small" id="room-prev">← Алдыңғы</button><span>Бір модель · алты қырынан зерттеу</span><button class="btn small" id="room-next">Келесі бөлім →</button>';story.after(next);
 let current=0;
 function choose(n){
  current=n;sections.forEach((s,i)=>s.hidden=i!==n);links.forEach((a,i)=>{a.classList.toggle('chosen',i===n);if(i===n)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});
  $('#room-chapter-count').textContent=`${String(n+1).padStart(2,'0')} / 06`;
  $('#room-prev').disabled=n===0;$('#room-next').disabled=n===5;
  lab.querySelector('#stage-name').textContent=`0${n+1} / ${['ИДЕЯ','ІРІКТЕУ','ДАУЫС','ТӘЖІРИБЕ','ҚОЛДАНУ','ТЕКСЕРУ'][n]}`;
 }
 links.forEach((a,i)=>a.onclick=e=>{e.preventDefault();choose(i);history.replaceState(null,'',`#step-${i}`)});
 $('#room-prev').onclick=()=>choose(Math.max(0,current-1));$('#room-next').onclick=()=>choose(Math.min(5,current+1));
 const initial=Number(location.hash.match(/^#step-(\d)$/)?.[1]||0);choose(Math.min(5,initial));
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
 const cards=[...story.children];
 cards.forEach((s,i)=>{s.classList.remove('timeline-left','timeline-right');s.querySelector('.timeline-marker')?.remove();s.setAttribute('aria-label',`${i+1}. ${s.querySelector('h2').textContent}`);s.tabIndex=0});
 const deckHead=document.createElement('div');deckHead.className='studio-deck-head';deckHead.innerHTML='<div><span>АЛГОРИТМДІ АЛТЫ ҚАДАМДА ТҮСІН</span><h2>Бақыла. Түзет. Қайта қара.</h2></div><div><button id="card-prev" class="btn secondary small" aria-label="Алдыңғы түсіндірме">←</button><button id="card-next" class="btn small" aria-label="Келесі түсіндірме">→</button></div>';story.before(deckHead);story.before(nav);
 let active=0;const links=[...nav.querySelectorAll('a')];
 function selected(i){active=i;links.forEach((a,j)=>{a.classList.toggle('chosen',i===j);if(i===j)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});$('#card-prev').disabled=i===0;$('#card-next').disabled=i===cards.length-1}
 function go(i){const behavior=matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth';story.scrollTo({left:cards[i].offsetLeft,behavior});story.scrollIntoView({behavior,block:'start'});selected(i)}
 links.forEach((a,i)=>a.onclick=e=>{e.preventDefault();go(i);history.replaceState(null,'',`#step-${i}`)});
 $('#card-prev').onclick=()=>go(Math.max(0,active-1));$('#card-next').onclick=()=>go(Math.min(5,active+1));
 const obs=new IntersectionObserver(entries=>{for(const en of entries)if(en.isIntersecting)selected(cards.indexOf(en.target))},{root:story,threshold:.65});cards.forEach(c=>obs.observe(c));selected(0);
 const metrics=$('#step-count');const update=()=>$('#studio-iteration').textContent=metrics.textContent.padStart(2,'0');new MutationObserver(update).observe(metrics,{childList:true,characterData:true,subtree:true});update();
 // Preserve all errors and correction controls while keeping the reading area horizontal.
 story.addEventListener('keydown',e=>{if(e.target!==document.activeElement||!cards.includes(e.target))return;if(e.key==='ArrowRight'){e.preventDefault();go(Math.min(5,active+1))}if(e.key==='ArrowLeft'){e.preventDefault();go(Math.max(0,active-1))}});
}
