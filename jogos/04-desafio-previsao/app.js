"use strict";
// DataLab UFOP: previsão interativa, sem dependências externas.
// Os modelos e a escala de visualização nunca consultam o valor futuro antes da revelação.
const LEVELS = {
  trend: {label:'Tendência',help:'Observe a direção da série. Ela tende a crescer ou diminuir? Use os pontos mais recentes e a inclinação.',noise:1.25},
  season: {label:'Sazonalidade',help:'Procure uma repetição a cada quatro períodos. O período 13 tende a se parecer com os períodos 1, 5 e 9.',noise:1.2},
  mixed: {label:'Incerteza',help:'A série combina tendência, ciclos e ruído. Faça uma previsão central e indique uma faixa plausível.',noise:2.6}
};
const W=640,H=410,L=76,R=32,T=30,B=62;
let level='trend', observed=[],future=0, guess=0, revealed=false, scale={min:0,max:1,step:1};
let championship=null, pointerDown=false;
const uniform=(a,b)=>a+Math.random()*(b-a);
const mean=a=>a.reduce((s,x)=>s+x,0)/a.length;
const abs=x=>Math.abs(x);
const round=x=>Math.round(x*10)/10;
const number=x=>Number(x).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1});
function gaussian(){let u=0,v=0;while(u===0)u=Math.random();while(v===0)v=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)}
function generate(which){
 const base=uniform(25,52), trend=uniform(1.25,2.5)*(Math.random()<.3?-1:1);
 const phase=Math.floor(Math.random()*4), seasonal=[0,8,3,-5];
 const value=i=>{
   if(which==='trend')return base+trend*i+gaussian()*LEVELS[which].noise;
   if(which==='season')return base+seasonal[(i+phase)%4]+gaussian()*LEVELS[which].noise;
   return base+trend*.65*i+seasonal[(i+phase)%4]*.7+gaussian()*LEVELS[which].noise;
 };
 return {obs:Array.from({length:12},(_,i)=>value(i)),next:value(12)};
}
function niceStep(span){const rough=Math.max(.01,span/6),pow=10**Math.floor(Math.log10(rough)),v=rough/pow;return (v<=1?1:v<=2?2:v<=2.5?2.5:v<=5?5:10)*pow}
function makeScale(obs){const lo=Math.min(...obs),hi=Math.max(...obs),pad=Math.max(3,(hi-lo)*.22),step=niceStep(hi-lo+2*pad);return {min:Math.floor((lo-pad)/step)*step,max:Math.ceil((hi+pad)/step)*step,step}}
const X=i=>L+(i-1)/12*(W-L-R);
const Y=v=>T+(scale.max-v)/(scale.max-scale.min)*(H-T-B);
const clip=(v,a,b)=>Math.max(a,Math.min(b,v));
function predictions(){
 const last=observed.at(-1),avg=mean(observed.slice(-3));
 const n=observed.length,mx=(n+1)/2,my=mean(observed);
 let top=0,bot=0;observed.forEach((v,i)=>{top+=(i+1-mx)*(v-my);bot+=(i+1-mx)**2});
 const slope=top/bot,linear=my+slope*(13-mx);
 // Sazonal ingênuo: último valor da mesma posição no ciclo de quatro períodos.
 const seasonal=observed[8];
 return [{name:'Último valor',value:last},{name:'Média móvel (3)',value:avg},{name:level==='season'?'Sazonal (período 9)':'Tendência linear',value:level==='season'?seasonal:linear}];
}
function updateModels(){const arr=predictions();$('modelPredictions').innerHTML=arr.map(m=>`<div class="model-item"><span>${esc(m.name)}</span><strong>${number(m.value)}</strong></div>`).join('')}
function chooseLevel(v){if(!LEVELS[v])return;level=v;document.querySelectorAll('[data-level]').forEach(b=>{const yes=b.dataset.level===v;b.classList.toggle('active',yes);b.classList.toggle('alt',!yes);b.setAttribute('aria-pressed',yes?'true':'false')});$('scenarioHelp').textContent=LEVELS[v].help;$('intervalControls').hidden=v!=='mixed';fresh()}
function fresh(){
 const d=generate(level);observed=d.obs;future=d.next;revealed=false;scale=makeScale(observed);
 const p=predictions();guess=round(p.find(m=>m.name==='Média móvel (3)').value);
 $('forecastRange').min=scale.min;$('forecastRange').max=scale.max;$('forecastRange').step=.1;
 $('check').disabled=false;$('forecast').disabled=false;$('forecastRange').disabled=false;
 $('lower').disabled=false;$('upper').disabled=false;
 $('answer').textContent='Escolha sua previsão. O valor real está oculto.';
 $('comparison').innerHTML='';$('lesson').textContent='Uma previsão é uma hipótese informada. Compare-a com os modelos depois de revelar o próximo valor.';
 $('lower').value=round(guess-4);$('upper').value=round(guess+4);
 syncGuess(guess);updateModels();draw();
 $('roundBadge').textContent=championship?`Rodada ${championship.results.length+1} de 5`:'Rodada livre';
 $('next').textContent=championship?'Sair do campeonato':'Nova série';
 say('Nova série: observe o padrão e faça sua previsão.');
}
function syncGuess(v){if(!Number.isFinite(v))return;guess=round(clip(v,scale.min,scale.max));$('forecast').value=guess;$('forecastRange').value=guess;draw()}
function draw(){
 const ctx=resetCanvas('series',W,H);const y0=H-B;
 ctx.font='13px system-ui, Segoe UI, Arial';ctx.textBaseline='middle';ctx.lineWidth=1;
 for(let t=scale.min,i=0;t<=scale.max+1e-7&&i<30;t+=scale.step,i++){
   const yy=Y(t);ctx.strokeStyle='#dbe7f0';ctx.beginPath();ctx.moveTo(L,yy);ctx.lineTo(W-R,yy);ctx.stroke();ctx.fillStyle='#344e65';ctx.textAlign='right';ctx.fillText(number(t),L-12,yy);
 }
 for(let i=1;i<=13;i++){
   const xx=X(i);ctx.strokeStyle=i===13?'#efbd95':'#eef2f7';ctx.setLineDash(i===13?[5,5]:[]);
   ctx.beginPath();ctx.moveTo(xx,T);ctx.lineTo(xx,y0);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=i===13?'#aa5c20':'#344e65';ctx.textAlign='center';ctx.fillText(String(i),xx,y0+19);
 }
 ctx.strokeStyle='#718fa5';ctx.beginPath();ctx.moveTo(L,T);ctx.lineTo(L,y0);ctx.lineTo(W-R,y0);ctx.stroke();
 ctx.fillStyle='#183153';ctx.font='bold 14px system-ui, Segoe UI, Arial';ctx.textAlign='center';ctx.fillText('Período',L+(W-L-R)/2,H-16);
 ctx.save();ctx.translate(19,T+(H-T-B)/2);ctx.rotate(-Math.PI/2);ctx.fillText('Valor observado',0,0);ctx.restore();
 const pts=observed.map((v,i)=>[X(i+1),Y(v)]);line(ctx,pts,'#1675ad',3);pts.forEach(p=>dot(ctx,p[0],p[1],'#1675ad',5));
 // A previsão do visitante é mostrada, mas o futuro só aparece após confirmar.
 ctx.setLineDash([6,5]);ctx.strokeStyle='#e58a37';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(...pts.at(-1));ctx.lineTo(X(13),Y(guess));ctx.stroke();ctx.setLineDash([]);
 dot(ctx,X(13),Y(guess),'#e58a37',7);ctx.font='bold 13px system-ui, Segoe UI, Arial';ctx.fillStyle='#ae5a20';ctx.textAlign='right';ctx.fillText('Você: '+number(guess),X(13)-8,clip(Y(guess)-15,T+12,y0-12));
 if(revealed){
   const realY=Y(future);if(realY>=T&&realY<=y0){dot(ctx,X(13),realY,'#149568',9);ctx.fillStyle='#08704e';ctx.textAlign='right';ctx.fillText('Real: '+number(future),X(13)-8,clip(realY+17,T+15,y0-12))}
   else{ctx.fillStyle='#08704e';ctx.textAlign='right';ctx.fillText('Real: '+number(future)+' (fora da escala)',W-R-4,T+15)}
 }
}
function graphPosition(e){const rect=$('series').getBoundingClientRect();const px=(e.clientX-rect.left)/rect.width*W;const py=(e.clientY-rect.top)/rect.height*H;
 if(px<L||px>W-R||py<T||py>H-B)return null;
 return scale.max-(py-T)/(H-T-B)*(scale.max-scale.min)}
function setFromPointer(e){if(revealed)return;const v=graphPosition(e);if(v!==null)syncGuess(v)}
function check(){
 if(revealed)return;const raw=$('forecast').value.trim().replace(',','.');if(!raw||!Number.isFinite(Number(raw))){say('Informe uma previsão numérica válida.');return}
 const v=Number(raw);if(v<scale.min||v>scale.max){say(`Escolha um valor entre ${number(scale.min)} e ${number(scale.max)}.`);return}
 let lower=null,upper=null,intervalScore=0;
 if(level==='mixed'){
   lower=Number($('lower').value.replace(',','.'));upper=Number($('upper').value.replace(',','.'));
   if(!$('lower').value||!$('upper').value||!Number.isFinite(lower)||!Number.isFinite(upper)||lower>=upper){say('Informe um intervalo válido: limite inferior menor que o superior.');return}
   const width=upper-lower,span=scale.max-scale.min,covered=future>=lower&&future<=upper;
   intervalScore=covered?Math.max(0,Math.round(30*(1-Math.min(width/span,1)))):0;
 }
 syncGuess(v);revealed=true;$('check').disabled=true;$('forecast').disabled=true;$('forecastRange').disabled=true;$('lower').disabled=true;$('upper').disabled=true;
 const models=predictions(),mine=abs(guess-future),modelErrors=models.map(m=>abs(m.value-future)),best=Math.min(mine,...modelErrors),winner=mine<=Math.min(...modelErrors)+1e-9;
 const span=scale.max-scale.min,relative=mine/span;
 const base=relative<=.05?100:relative<=.10?75:relative<=.20?50:10;
 const points=base+(winner?25:0)+intervalScore;
 const rows=[{name:'Sua previsão',value:guess,error:mine},...models.map(m=>({name:m.name,value:m.value,error:abs(m.value-future)}))];
 $('answer').innerHTML=`<strong>Valor real: ${number(future)}</strong>. Sua previsão: ${number(guess)}. Erro absoluto: <strong>${number(mine)}</strong>.`;
 $('comparison').innerHTML=`<table class="compare-table"><thead><tr><th>Método</th><th>Previsão</th><th>Erro</th></tr></thead><tbody>${rows.map(r=>`<tr class="${abs(r.error-best)<1e-8?'winner':''}"><td>${esc(r.name)}</td><td>${number(r.value)}</td><td>${number(r.error)}</td></tr>`).join('')}</tbody></table><p class="${winner?'good':'muted'}">${winner?'🏅 Você igualou ou superou os modelos!':'O melhor modelo nesta rodada chegou mais perto.'} +${points} pontos${level==='mixed'?' (inclui '+intervalScore+' pela faixa)':''}.</p>`;
 $('lesson').textContent=level==='trend'?'Uma tendência ajuda a prever, mas as oscilações podem causar erros.':level==='season'?'Quando existe repetição, comparar períodos equivalentes pode superar métodos que ignoram o ciclo.':'A incerteza não desaparece: intervalos úteis equilibram cobertura e precisão.';
 if(level==='mixed')$('answer').innerHTML+=`<p>Seu intervalo [${number(lower)}, ${number(upper)}] ${future>=lower&&future<=upper?'incluiu':'não incluiu'} o valor real.</p>`;
 draw();say(`Rodada concluída: ${points} pontos.`);
 if(championship){championship.results.push({level,points,error:mine,winner});renderChamp();if(championship.results.length===5){finishChamp()}else{$('next').textContent='Próxima rodada →'}}
}
const champSequence=['trend','season','mixed','trend','season'];
function startChamp(){championship={results:[]};$('champEnd').hidden=true;$('startChamp').textContent='Reiniciar campeonato';renderChamp();chooseLevel(champSequence[0]);say('Campeonato iniciado! Faça sua primeira previsão.')}
function nextRound(){if(!championship){fresh();return}if(!revealed){championship=null;renderChamp();$('next').textContent='Nova série';$('roundBadge').textContent='Rodada livre';say('Campeonato encerrado.');return}if(championship.results.length>=5){championship=null;renderChamp();fresh();return}chooseLevel(champSequence[championship.results.length])}
function renderChamp(){if(!championship){$('champStats').innerHTML='<span class="stat">Campeonato não iniciado</span>';$('champHistory').innerHTML='';return}
 const res=championship.results,total=res.reduce((s,r)=>s+r.points,0),wins=res.filter(r=>r.winner).length;
 $('champStats').innerHTML=`<span class="stat">Rodadas: ${res.length}/5</span><span class="stat">Pontos: ${total}</span><span class="stat">Vitórias sobre modelos: ${wins}</span>`;
 $('champHistory').innerHTML=res.length?`<table class="history-table"><thead><tr><th>Rodada</th><th>Cenário</th><th>Erro</th><th>Pontos</th></tr></thead><tbody>${res.map((r,i)=>`<tr><td>${i+1}</td><td>${LEVELS[r.level].label}</td><td>${number(r.error)}</td><td>${r.points}</td></tr>`).join('')}</tbody></table>`:'';
}
function finishChamp(){const score=championship.results.reduce((s,r)=>s+r.points,0);const rank=score>=475?'Mestre das Previsões':score>=325?'Analista de Dados':'Aprendiz de Previsões';$('champEnd').hidden=false;$('champEnd').innerHTML=`🏆 <strong>Campeonato concluído!</strong> Você somou <strong>${score} pontos</strong> e conquistou o título <strong>${rank}</strong>.`; $('next').textContent='Jogar livremente';$('roundBadge').textContent='Campeonato concluído'}
document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>{championship=null;renderChamp();chooseLevel(b.dataset.level)}));
$('forecast').addEventListener('change',()=>syncGuess(Number($('forecast').value.replace(',','.'))));
$('forecastRange').addEventListener('input',e=>syncGuess(Number(e.target.value)));
$('series').addEventListener('pointerdown',e=>{if(revealed)return;pointerDown=true;$('series').setPointerCapture(e.pointerId);setFromPointer(e)});
$('series').addEventListener('pointermove',e=>{if(pointerDown)setFromPointer(e)});
$('series').addEventListener('pointerup',()=>{pointerDown=false});
$('series').addEventListener('pointercancel',()=>{pointerDown=false});
$('check').addEventListener('click',check);$('next').addEventListener('click',nextRound);$('startChamp').addEventListener('click',startChamp);
$('forecast').addEventListener('keydown',e=>{if(e.key==='Enter')check()});
chooseLevel('trend');renderChamp();
