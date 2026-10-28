// Each lesson keeps its live model, but has its own reading and interaction pattern.
export function mountExperience(index, hooks) {
 const body=document.querySelector('.lesson-body'),lab=body.querySelector('.lab'),story=body.querySelector('.story');
 if(index===0){
  body.classList.add('tree-workshop');
  const trail=document.createElement('div');trail.className='tree-trail';trail.innerHTML='<span>01 ТАМЫР</span><i>→</i><span>02 БӨЛУ</span><i>→</i><span>03 БОЛЖАМ</span>';lab.prepend(trail);
  const send=document.createElement('button');send.className='btn small trace-button';send.textContent='Нүктені ағаштан өткізу →';
  lab.querySelector('.lab-actions').append(send);
  let tracing=false;
  send.onclick=async()=>{
   if(tracing)return;tracing=true;send.disabled=true;
   // Clear any previous path before tracing the newly computed prediction.
   const nodes=[...lab.querySelectorAll('.node')];
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const active=nodes.filter(n=>n.querySelector('circle')?.getAttribute('fill')==='var(--accent)');
   if(!active.length){lab.querySelector('[data-view="tree"]').click();tracing=false;send.disabled=false;return send.click()}
   active.forEach(n=>n.classList.add('trace-wait'));
   // Tree SVG is drawn leaf-first; reverse to follow the actual root-to-leaf path.
   for(const node of active.reverse()){
    node.classList.remove('trace-wait');node.classList.add('trace-current');
    if(!reduced)await new Promise(r=>setTimeout(r,350));
    node.classList.remove('trace-current');
   }
   tracing=false;send.disabled=false;
  };
  return;
 }
 body.classList.add(index===1?'forest-command':'boost-cinema');
 body.insertBefore(lab,story);
 const stage=document.createElement('div');stage.className='experience-kicker';stage.innerHTML=index===1?'<span>АНСАМБЛЬ ПУЛЬТІ</span><p>Бір таңдама. Көп көзқарас. Ортақ шешім.</p>':'<span>ҚАТЕНІ ТҮЗЕТУ СТУДИЯСЫ</span><p>Уақытты басқар. Әр ағаштың үлесін зертте.</p>';lab.before(stage);
 if(index===1)mountForest(story,lab,hooks);else mountBoost(story,lab,hooks);
}
function mountForest(story,lab,hooks){
 story.classList.add('forest-dossiers');
 [...story.children].forEach((section,i)=>{
  if(i===5){section.classList.add('forest-exam');return}
  const details=document.createElement('details'),summary=document.createElement('summary'),heading=section.querySelector('h2'),number=section.querySelector('.step-num');
  summary.innerHTML=`<span class="dossier-number">0${i+1}</span><span>${heading.textContent}</span><i>+</i>`;
  heading.remove();number.remove();
  const content=document.createElement('div');content.className='dossier-content';while(section.firstChild)content.append(section.firstChild);
  details.append(summary,content);section.append(details);details.open=i===0;
  details.ontoggle=()=>{if(details.open)lab.querySelector('#stage-name').textContent=`0${i+1} / ${['ИДЕЯ','ІРІКТЕУ','ДАУЫС','ТӘЖІРИБЕ','ҚОЛДАНУ'][i]}`};
 });
 const button=document.createElement('button');button.id='collect-votes';button.className='btn small';button.textContent='Дауыстарды жинау ▶';lab.querySelector('.lab-actions').prepend(button);
 let collecting=false;
 button.onclick=async()=>{
  if(collecting)return;collecting=true;button.disabled=true;
  lab.querySelector('[data-fview="forest"]').click();
  const nodes=[...lab.querySelectorAll('[data-tree]')],status=lab.querySelector('#scene-status');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  nodes.forEach(n=>n.classList.add('vote-wait'));
  let a=0,b=0;
  for(const node of nodes){
   if(!node.isConnected){collecting=false;button.disabled=false;return}
   node.classList.remove('vote-wait');node.classList.add('vote-counted');
   const vote=node.getAttribute('aria-label').includes('A класы');if(vote)a++;else b++;
   status.textContent=`Көрсетілген дауыс ${a+b}/${nodes.length} · A: ${a} · B: ${b}`;
   if(!reduced)await new Promise(r=>setTimeout(r,180));
  }
  status.textContent=`Барлық ${nodes.length} дауыс жиналды · A: ${a} / B: ${b} · Қорытынды: ${a>=b?'A':'B'}`;
  collecting=false;button.disabled=false;
 };
}
function mountBoost(story,lab,hooks){
 story.classList.add('boost-story');
 [...story.children].forEach((s,i)=>{s.classList.add(i%2?'timeline-right':'timeline-left');const marker=document.createElement('div');marker.className='timeline-marker';marker.textContent=String(i+1).padStart(2,'0');s.prepend(marker)});
 const transport=document.createElement('div');transport.className='boost-transport';transport.innerHTML='<div class="transport-label"><i class="dot"></i> ОҚЫТУ ЛЕНТАСЫ</div><div class="transport-buttons"><button id="boost-back" class="btn secondary small" aria-label="Алдыңғы итерация">← Бір қадам</button><button id="boost-play" class="btn small" aria-pressed="false">▶ Ойнату</button></div><div id="iteration-tape" class="iteration-tape" aria-label="Итерацияны таңдау"></div>';
 lab.append(transport);
 let timer=null;const play=transport.querySelector('#boost-play');
 function stop(){clearInterval(timer);timer=null;play.textContent='▶ Ойнату';play.setAttribute('aria-pressed','false')}
 function choose(n){stop();hooks.setStep(n);refresh()}
 function refresh(){
  const n=hooks.getStep();transport.querySelector('#boost-back').disabled=n===0;
  transport.querySelector('#iteration-tape').innerHTML=Array.from({length:41},(_,i)=>`<button data-iteration="${i}" aria-label="${i}-итерация" aria-pressed="${i===n}" class="${i===n?'current':i<n?'past':''}"><span>${i===0?'F₀':i}</span><i></i></button>`).join('');
  transport.querySelectorAll('[data-iteration]').forEach(b=>b.onclick=()=>choose(+b.dataset.iteration));
  const current=transport.querySelector('.current'),tape=transport.querySelector('#iteration-tape');tape.scrollLeft=Math.max(0,current.offsetLeft-tape.offsetLeft-tape.clientWidth/2);
 }
 transport.querySelector('#boost-back').onclick=()=>choose(Math.max(0,hooks.getStep()-1));
 play.onclick=()=>{if(timer){stop();return}if(hooks.getStep()>=40)hooks.setStep(0);play.textContent='Ⅱ Кідірту';play.setAttribute('aria-pressed','true');timer=setInterval(()=>{const n=hooks.getStep();if(n>=40){stop();return}hooks.setStep(n+1);refresh()},900)};
 // Manual controls stop playback; programmatic playback keeps its timer.
 lab.querySelectorAll('#steps,#rate').forEach(el=>el.addEventListener('input',()=>{stop();refresh()}));
 lab.querySelectorAll('#add-tree,#boost-reset').forEach(el=>el.addEventListener('click',()=>{stop();refresh()}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});addEventListener('pagehide',stop);refresh();
}
