import {beginnerLesson} from './xgboost-lesson.js';
import {demoRows,trainDemo} from './xgboost-model.js';
const $=s=>document.querySelector(s);
function styles(){if(document.querySelector('[data-xgb-style]'))return;const link=document.createElement('link');link.rel='stylesheet';link.href='/xgboost.css';link.dataset.xgbStyle='';document.head.append(link)}

export function addXGBoostLink(){
 styles();const link=document.createElement('a');link.className='xgb-door';link.id='xgboost-link';link.href='/xgboost/';
 link.innerHTML='<div><span class="eyebrow">ИДЕЯДАН — ҚҰРАЛҒА</span><h3>XGBoost</h3><p>Қатені қалай түзетеміз? Алма өнімі туралы қарапайым мысалмен бірге түсінейік.</p><div class="xgb-door-tags"><span>Қарапайым мысал</span><span>Өзің тексер</span><span>Жаңа сабақ</span></div></div><span class="xgb-door-arrow" aria-hidden="true">↗</span>';
 $('#step-4').append(link);
 const next=$('.next-chapter');next.querySelector('h2').textContent='Келесі қадам — XGBoost.';next.querySelector('p').textContent='Бір қарапайым мысал арқылы болжамды жақсартуды үйрен. Содан кейін баптауларды өзің өзгертіп көр.';
 const button=next.querySelector('a');button.href='/xgboost/';button.innerHTML='XGBoost-ты зерттеу <span>↗</span>';
}

export function renderXGBoost(){
 styles();document.body.className='xgboost';document.title='XGBoost — OYLAB';
 const footerSource=document.querySelector('footer>a:not(.logo)');if(footerSource){footerSource.href='https://xgboost.readthedocs.io/en/stable/tutorials/model.html';footerSource.textContent='Дереккөз: XGBoost ↗'}
 const desc=document.querySelector('meta[name="description"]');if(desc)desc.content='XGBoost-ты қарапайым тілмен үйрен: алма өнімін болжа, қатені түзет, баптауларды өзің өзгертіп көр.';
 $('#main').innerHTML=beginnerLesson(slider);
 let params={lambda:1,gamma:0,rate:.3,steps:1};
 function update(){
  const result=trainDemo(params),last=result.trees.at(-1);
  $('#xgb-step').textContent=params.steps;$('#xgb-mse').textContent=result.mse.toFixed(4);$('#xgb-add').disabled=params.steps>=20;
  for(const [id,key]of[['xgb-lambda','lambda'],['xgb-gamma','gamma'],['xgb-rate','rate']]){$('#'+id+'-out').textContent=params[key].toFixed(2);$('#'+id).value=params[key]}
  $('#xgb-chart').innerHTML=chart(result);
  if(!last){$('#xgb-simple-feedback').innerHTML=`<b>Бәріне бір ортақ болжам: ${result.base.toFixed(2)} кг.</b><p>Әзірге ағаш қосылған жоқ. «Келесі ағаш» батырмасын бас.</p>`;$('#xgb-calculation').innerHTML=`<p>Алғашқы болжам — нысаналы мәндердің орташа саны: <b>${result.base.toFixed(3)}</b>.</p>`;return}
  const previous=trainDemo({...params,steps:params.steps-1}).predictions[0],weight=last.leftWeight,change=params.rate*weight;
  $('#xgb-simple-feedback').innerHTML=`<b>${last.split?'Ағаш деректерді екі топқа бөлді. Әр топқа өз түзетуі қосылды.':'Бұл жолы жаңа тармақ қоспадық: оның пайдасы жеткіліксіз болды.'}</b><p>Бірінші бақтың болжамы: ${previous.toFixed(2)} кг ${change<0?'−':'+'} ${Math.abs(change).toFixed(2)} кг = <strong>${result.predictions[0].toFixed(2)} кг</strong>. Шын нәтиже — ${demoRows[0].y.toFixed(1)} кг.</p>`;
  $('#xgb-calculation').innerHTML=`<div class="xgb-decision ${last.split?'accepted':'rejected'}"><strong>${last.split?'БӨЛУ ҚАБЫЛДАНДЫ':'БӨЛУ ҚАБЫЛДАНБАДЫ'}</strong><span>Соңғы қадамдағы ең жақсы Gain: <b>${last.gain.toFixed(4)}</b></span></div><div class="xgb-leaves"><div><span>Сол жақ · ${last.leftCount} нүкте</span><p>Gᴸ = ${last.GL.toFixed(3)} · Hᴸ = ${last.HL}</p><b>wᴸ = ${last.leftWeight.toFixed(4)}</b></div><div><span>Оң жақ · ${last.rightCount} нүкте</span><p>Gᴿ = ${last.GR.toFixed(3)} · Hᴿ = ${last.HR}</p><b>wᴿ = ${last.rightWeight.toFixed(4)}</b></div></div><p class="xgb-calculation-note">${last.split?`Шек: x ≤ ${last.threshold.toFixed(2)}. Болжамға η × w қосылады.`:'Екі жапырақты бөлу орнына бір түйіннің түзетуі қолданылады.'}</p>`;
  if(!last.split)document.querySelector('.xgb-leaves').outerHTML=`<div class="xgb-root-leaf">Бір түйін · ${last.H} нүкте<br>G = ${last.G.toFixed(3)} · H = ${last.H}<br><b>w = ${last.leftWeight.toFixed(4)}</b><p>Қабылданбаған бөлу кандидатының шегі: ${last.candidateThreshold.toFixed(2)}.</p></div>`;
 }
 function clearPreset(){document.querySelectorAll('[data-xgb-preset]').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false')})}
 for(const [id,key]of[['xgb-lambda','lambda'],['xgb-gamma','gamma'],['xgb-rate','rate']])$('#'+id).oninput=e=>{params[key]=+e.target.value;clearPreset();update()};
 document.querySelectorAll('[data-xgb-preset]').forEach(b=>{b.setAttribute('aria-pressed','false');b.onclick=()=>{params={lambda:b.dataset.xgbPreset==='gentle'?8:1,gamma:b.dataset.xgbPreset==='simple'?10:0,rate:.3,steps:1};clearPreset();b.classList.add('selected');b.setAttribute('aria-pressed','true');update()}});
 $('#xgb-add').onclick=()=>{params.steps=Math.min(20,params.steps+1);update()};$('#xgb-reset').onclick=()=>{params.steps=0;update()};
 document.querySelectorAll('[data-xgb-answer]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-xgb-answer]').forEach(x=>{x.className='';x.setAttribute('aria-pressed','false')});const good=b.dataset.xgbAnswer==='correct';b.className=good?'correct':'wrong';b.setAttribute('aria-pressed','true');$('#xgb-feedback').textContent=good?'Дұрыс! Жаңа тармақтың пайдасы аз болса, оны қоспаймыз.':'Тағы ойланып көр: жаңа тармақты қосу үшін оның пайдасы жеткілікті болуы керек.'});update();
}
function slider(id,label,min,max,value,step){return `<div class="control"><label for="${id}">${label}<output id="${id}-out">${value}</output></label><input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"></div>`}
function chart(model){
 const x=v=>60+(v-demoRows[0].x)/(demoRows.at(-1).x-demoRows[0].x)*780,y=v=>260-v*48;
 let svg='<svg viewBox="0 0 900 300" role="img" aria-label="Шын мәндер мен реттелген бустинг болжамдары">';
 for(let i=0;i<=5;i++)svg+=`<path d="M60 ${y(i)}H840" stroke="var(--line)"/><text x="40" y="${y(i)+4}" fill="var(--muted)" font-size="10">${i}</text>`;
 demoRows.forEach((r,i)=>{svg+=`<path d="M${x(r.x)} ${y(r.y)}V${y(model.predictions[i])}" stroke="var(--accent)" opacity=".3"/><circle cx="${x(r.x)}" cy="${y(r.y)}" r="5" fill="var(--ink)"/><text x="${x(r.x)}" y="282" text-anchor="middle" fill="var(--muted)" font-size="10">${r.x.toFixed(1)}</text>`});
 const points=[];demoRows.forEach((r,i)=>{if(i)points.push(`${(x(r.x)+x(demoRows[i-1].x))/2},${y(model.predictions[i-1])}`,`${(x(r.x)+x(demoRows[i-1].x))/2},${y(model.predictions[i])}`);points.push(`${x(r.x)},${y(model.predictions[i])}`)});
 return svg+`<polyline points="${points.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="3"/></svg>`;
}
