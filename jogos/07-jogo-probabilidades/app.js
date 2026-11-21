
'use strict';
const $=id=>document.getElementById(id);const rnd=n=>Math.floor(Math.random()*n);const pct=v=>(100*v).toFixed(1).replace('.',',')+'%';const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function bars(el,items){$(el).innerHTML=items.map(([name,value,color])=>`<div class="barrow"><span>${esc(name)}</span><div class="track"><div class="fill ${color||''}" style="width:${Math.max(0,Math.min(100,100*value))}%"></div></div><strong>${pct(value)}</strong></div>`).join('')}
function simulation(n){let keep=0;for(let i=0;i<n;i++)if(rnd(3)===rnd(3))keep++;return [keep/n,1-keep/n]}
function showSim(id,n){const [a,b]=simulation(n);bars(id,[['Manter',a,''],['Trocar',b,'orange']])}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.setAttribute('aria-selected',String(x===b)));document.querySelectorAll('.panel').forEach(x=>x.hidden=x.id!==b.dataset.tab);if(b.dataset.tab==='birthday')drawBirthday();if(b.dataset.tab==='coin'){drawCoin();drawDet()}}));
// Monty Hall: escolha -> decisão -> resultado. O prêmio e a abertura são fixados por rodada.
const m={prize:0,choice:null,opened:null,final:null,phase:'choice',rounds:0,keep:0,switch:0};function resetMonty(){m.prize=rnd(3);m.choice=m.opened=m.final=null;m.phase='choice';renderMonty()}
function choose(i){if(m.phase!=='choice')return;m.choice=i;const options=[0,1,2].filter(j=>j!==i&&j!==m.prize);m.opened=options[rnd(options.length)];m.phase='decision';renderMonty()}
function finish(strategy){if(m.phase!=='decision')return;m.final=strategy==='keep'?m.choice:[0,1,2].find(j=>j!==m.choice&&j!==m.opened);m.phase='result';m.rounds++;m.keep+=Number(m.choice===m.prize);m.switch+=Number(m.choice!==m.prize);renderMonty()}
function renderMonty(){
 const d=$('doors');d.replaceChildren();
 for(let i=0;i<3;i++){
  const b=document.createElement('button');
  const isOpened=m.phase!=='choice'&&i===m.opened;
  const isAvailable=m.phase==='choice'||(m.phase==='decision'&&!isOpened);
  b.className='door'+(i===m.choice?' selected':'')+(isOpened?' revealed-goat':'')+(m.phase==='result'&&i===m.final?' final-choice':'');
  b.type='button';
  b.setAttribute('aria-disabled',String(!isAvailable));
  b.textContent=m.phase==='result'?(i===m.prize?'🏆':'🐐'):(isOpened?'🐐':'🚪');
  const sm=document.createElement('small');
  sm.textContent=`Porta ${i+1}`+(i===m.choice?' (sua escolha)':'');
  b.appendChild(sm);
  b.addEventListener('click',()=>{
    if(m.phase==='choice')choose(i);
    else if(m.phase==='decision'&&!isOpened)finish(i===m.choice?'keep':'switch');
  });
  d.appendChild(b);
 }
 const a=$('monty-actions');a.replaceChildren();
 if(m.phase==='decision'){
  for(const [txt,fn,cls] of [['Manter minha porta',()=>finish('keep'),'secondary'],['Trocar de porta',()=>finish('switch'),'primary']]){
   const b=document.createElement('button');b.className=cls;b.textContent=txt;b.addEventListener('click',fn);a.appendChild(b);
  }
 }
 if(m.phase==='result'){
  const b=document.createElement('button');b.className='primary';b.textContent='Nova rodada';b.addEventListener('click',resetMonty);a.appendChild(b);
 }
 $('monty-msg').textContent=m.phase==='choice'?'Clique em uma das três portas.':m.phase==='decision'?`O apresentador abriu a porta ${m.opened+1}, que não tem prêmio. Clique na sua porta para manter ou na outra porta fechada para trocar.`:`${m.final===m.prize?'🎉 Você ganhou!':'Você não ganhou desta vez.'} O prêmio estava na porta ${m.prize+1}.`;
 $('monty-stats').innerHTML=`<span class="stat">Partidas: ${m.rounds}</span><span class="stat">Vitórias se mantivesse: ${m.keep}</span><span class="stat">Vitórias se trocasse: ${m.switch}</span>`;
}
$('monty-sim').addEventListener('click',()=>showSim('monty-bars',1000));resetMonty();
// Birthday: exact complement and Monte Carlo simulation.
function birthProb(n){let no=1;for(let i=0;i<n;i++)no*=(365-i)/365;return 1-no}
function updateBirthday(){const n=Number($('people').value);$('people-label').textContent=n;$('birthday-result').textContent=`Probabilidade teórica com ${n} pessoas: ${pct(birthProb(n))}.`;drawBirthday()}
$('people').addEventListener('input',updateBirthday);
$('birthday-run').addEventListener('click',()=>{const n=Number($('people').value),N=Number($('birthday-n').value);if(!Number.isInteger(N)||N<100||N>10000){alert('Informe entre 100 e 10.000 simulações.');return}let hits=0;for(let j=0;j<N;j++){const seen=new Uint8Array(365);let repeat=false;for(let i=0;i<n;i++){const day=rnd(365);if(seen[day]){repeat=true;break}seen[day]=1}hits+=Number(repeat)}$('birthday-result').textContent=`Probabilidade teórica: ${pct(birthProb(n))}. Simulação com ${n} pessoas (${N.toLocaleString('pt-BR')} repetições): ${pct(hits/N)}.`});
function canvasSetup(id){const c=$(id),r=c.getBoundingClientRect(),w=Math.max(260,r.width),h=230,ratio=window.devicePixelRatio||1;c.width=Math.round(w*ratio);c.height=Math.round(h*ratio);const ctx=c.getContext('2d');ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,w,h);return {ctx,w,h}}
function plotLine(id,values,mark){const {ctx,w,h}=canvasSetup(id),left=45,right=14,top=15,bottom=35,W=w-left-right,H=h-top-bottom;ctx.strokeStyle='#dce7ef';ctx.lineWidth=1;ctx.font='12px system-ui';ctx.fillStyle='#52677d';for(let i=0;i<=4;i++){const y=top+H*(1-i/4);ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(left+W,y);ctx.stroke();ctx.fillText(i*25+'%',5,y+4)}const xx=i=>left+W*i/Math.max(1,values.length-1),yy=v=>top+H*(1-v);ctx.strokeStyle='#1674a5';ctx.lineWidth=2.5;ctx.beginPath();values.forEach((v,i)=>i?ctx.lineTo(xx(i),yy(v)):ctx.moveTo(xx(i),yy(v)));ctx.stroke();ctx.fillStyle='#52677d';ctx.fillText('1',left,h-12);ctx.fillText(String(values.length),w-45,h-12);if(mark!==undefined){const idx=Math.max(0,Math.min(values.length-1,mark));ctx.fillStyle='#ca613a';ctx.beginPath();ctx.arc(xx(idx),yy(values[idx]),5,0,Math.PI*2);ctx.fill()}}
function drawBirthday(){if($('birthday').hidden)return;plotLine('birthday-chart',Array.from({length:79},(_,i)=>birthProb(i+2)),Number($('people').value)-2)}updateBirthday();
// Moeda justa ou viciada: mantém o palpite individual e acrescenta investigação.
let tosses=[],correct=0,coinTimer=null;
const coinP=()=>document.querySelector('input[name="coin-type"]:checked').value==='fair'?.5:Number($('coin-prob').value)/100;
function coinReset(){tosses=[];correct=0;clearTimeout(coinTimer);$('coin-visual').textContent='?';$('coin-visual').classList.remove('spin');renderCoin()}
function coinOptions(){const fair=document.querySelector('input[name="coin-type"]:checked').value==='fair';$('coin-prob').disabled=fair;$('coin-prob-label').textContent=pct(coinP());coinReset()}
function toss(n){let last='';const guess=document.querySelector('input[name="guess"]:checked').value,p=coinP();for(let i=0;i<n;i++){last=Math.random()<p?'Cara':'Coroa';tosses.push(last)}if(n===1)correct+=Number(last===guess);const coin=$('coin-visual');coin.classList.remove('spin');void coin.offsetWidth;coin.textContent=last;coin.classList.add('spin');clearTimeout(coinTimer);coinTimer=setTimeout(()=>coin.classList.remove('spin'),850);renderCoin(n===1?`Seu palpite: ${guess}. ${last===guess?'Você acertou!':'Você errou.'}`:`Foram realizados ${n.toLocaleString('pt-BR')} lançamentos.`)}
function renderCoin(msg){const faces=tosses.filter(x=>x==='Cara').length,n=tosses.length,p=coinP();$('coin-stats').innerHTML=`<span class="stat">Total: ${n.toLocaleString('pt-BR')}</span><span class="stat">Caras: ${faces}</span><span class="stat">Coroas: ${n-faces}</span><span class="stat">Palpites certos (lançamentos individuais): ${correct}</span>${n?`<span class="stat">Frequência de cara: ${pct(faces/n)}</span>`:''}`;$('coin-result').textContent=msg||'Faça seu primeiro lançamento.';$('coin-theory').textContent=`Probabilidade teórica de cara: ${pct(p)}.${n?' Diferença entre frequência observada e teórica: '+(100*Math.abs(faces/n-p)).toFixed(1).replace('.',',')+' pontos percentuais.':''} Os lançamentos são independentes.`;drawCoin()}
function drawCoin(){if($('coin').hidden)return;const vals=[];let faces=0;for(let i=0;i<tosses.length;i++){if(tosses[i]==='Cara')faces++;vals.push(faces/(i+1))}if(!vals.length)vals.push(coinP());plotLine('coin-chart',vals);coinReference('coin-chart',coinP())}
function coinReference(id,p){const c=$(id),r=c.getBoundingClientRect(),ratio=window.devicePixelRatio||1,ctx=c.getContext('2d'),w=Math.max(260,r.width),top=15,H=230-top-35,y=top+H*(1-p);ctx.save();ctx.setTransform(ratio,0,0,ratio,0,0);ctx.setLineDash([5,5]);ctx.strokeStyle='#d68b30';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(w-14,y);ctx.stroke();ctx.restore()}
$('coin-one').addEventListener('click',()=>toss(1));$('coin-100').addEventListener('click',()=>toss(100));$('coin-1000').addEventListener('click',()=>toss(1000));$('coin-reset').addEventListener('click',coinReset);
document.querySelectorAll('input[name="coin-type"]').forEach(x=>x.addEventListener('change',coinOptions));$('coin-prob').addEventListener('input',coinOptions);coinOptions();
// Detetive: a moeda é sorteada com probabilidade 1/3 em cada hipótese.
let det={p:.5,n:0,h:0,history:[],done:false};
function newDet(){const options=[.3,.5,.7];det={p:options[rnd(options.length)],n:0,h:0,history:[],done:false};$('det-verdict').textContent='Observe alguns lançamentos antes de decidir.';renderDet()}
function renderDet(){$('det-stats').textContent=det.n?`${det.n.toLocaleString('pt-BR')} lançamentos · ${det.h} caras · frequência ${pct(det.h/det.n)}`:'Nenhum lançamento ainda.';for(const id of ['det-10','det-100','det-fair','det-biased'])$(id).disabled=det.done;drawDet()}
function drawDet(){if($('coin').hidden)return;plotLine('det-chart',det.history.length?det.history:[.5]);coinReference('det-chart',.5)}
function detSample(n){if(det.done)return;for(let i=0;i<n;i++){det.n++;if(Math.random()<det.p)det.h++;det.history.push(det.h/det.n)}renderDet()}
function detGuess(biased){if(det.done)return;if(!det.n){$('det-verdict').textContent='Faça pelo menos um lançamento antes de responder.';return}det.done=true;const truth=det.p!==.5,hit=biased===truth;$('det-verdict').textContent=`${hit?'✅ Acertou!':'❌ Não foi dessa vez.'} A moeda era ${truth?'viciada':'justa'} (P(cara) = ${pct(det.p)}). Você observou ${det.h} caras em ${det.n} lançamentos. ${det.n<30?'Com poucos dados, a incerteza é grande.':'Uma frequência diferente de 50% não prova, por si só, que a moeda é viciada.'}`;renderDet()}
$('det-new').addEventListener('click',newDet);$('det-10').addEventListener('click',()=>detSample(10));$('det-100').addEventListener('click',()=>detSample(100));$('det-fair').addEventListener('click',()=>detGuess(false));$('det-biased').addEventListener('click',()=>detGuess(true));newDet();
// Championship: same six questions and scoring as the R Shiny version.
const questions=[
['Três portas: após o apresentador abrir uma porta vazia, o que aumenta sua chance de ganhar?',['Trocar de porta','Manter a escolha','As duas estratégias são equivalentes'],0,'Trocar ganha com probabilidade 2/3; manter, com 1/3, supondo que o apresentador conhece o prêmio e sempre abre uma porta vazia.'],
['Em uma sala com 23 pessoas, qual é aproximadamente a chance de duas compartilharem aniversário?',['Menos de 10%','Aproximadamente 50%','Mais de 90%'],1,'A chance é aproximadamente 50,7%, assumindo 365 datas equiprováveis e independência.'],
['Uma moeda justa deu cara cinco vezes seguidas. Qual é a chance de coroa no próximo lançamento?',['Mais de 50%','Menos de 50%','Exatamente 50%'],2,'Lançamentos independentes: a moeda não tem memória. A probabilidade permanece 50%.'],
['Em 1.000 lançamentos de moeda justa, é obrigatório obter exatamente 500 caras?',['Sim, sempre','Não, existe variabilidade aleatória','Somente se a moeda for nova'],1,'A lei dos grandes números descreve aproximação da frequência relativa a 50%, não igualdade exata.'],
['Qual grupo tem maior chance de pelo menos dois aniversários iguais?',['Grupo de 10 pessoas','Grupo de 30 pessoas','A chance é igual'],1,'Com mais pessoas, aumentam as oportunidades de coincidência; com 30 pessoas, a chance já supera 70%.'],
['Em Monty Hall, se a escolha inicial já contém o prêmio, o que acontece ao trocar?',['Ganha','Perde','Depende de qual porta vazia foi aberta'],1,'Se a escolha inicial está certa (probabilidade 1/3), trocar faz perder. Se está errada (2/3), trocar faz ganhar.']];
let qidx=0,answers=[],answered=false,saved=false;
function quizRender(){const el=$('quiz-content');if(qidx===questions.length){const points=answers.reduce((a,b)=>a+b,0)*2;el.innerHTML=`<h3>Fim de jogo: ${points} de 12 pontos!</h3><label for="nick">Apelido para o ranking (até 24 caracteres):</label><p><input id="nick" type="text" maxlength="24" placeholder="Ex.: Detetive da Probabilidade"></p><p><button class="primary" id="save-score" ${saved?'disabled':''}>${saved?'Pontuação registrada':'Registrar pontuação'}</button> <button class="secondary" id="quiz-restart">Jogar novamente</button></p><p id="save-msg" aria-live="polite"></p>`;$('save-score').addEventListener('click',()=>{if(saved)return;const nick=$('nick').value.trim();if(!nick||nick.length>24||/[\r\n,;]/.test(nick)){$('save-msg').textContent='Informe um apelido de 1 a 24 caracteres, sem vírgulas ou quebras de linha.';return}const rank=readRank();rank.push({apelido:nick,pontos:points,acertos:points/2,data_hora:new Date().toLocaleString('pt-BR')});try{localStorage.setItem('datalab-ranking-prob-v1',JSON.stringify(rank));saved=true;$('save-msg').textContent='Pontuação salva neste navegador.';$('save-score').disabled=true;renderRank()}catch(e){$('save-msg').textContent='Não foi possível salvar no navegador.'}});$('quiz-restart').addEventListener('click',()=>{qidx=0;answers=[];answered=false;saved=false;quizRender()});return}
const [title,options,correct,explanation]=questions[qidx];el.innerHTML=`<h3>Desafio ${qidx+1} de ${questions.length}</h3><div class="progress"><div style="width:${100*qidx/questions.length}%"></div></div><p><strong>${esc(title)}</strong></p>${options.map((s,i)=>`<label class="option"><input type="radio" name="quiz-answer" value="${i}" ${answered?'disabled':''}> ${esc(s)}</label>`).join('')}<div id="quiz-feedback" aria-live="polite"></div><p><button class="primary" id="quiz-action">Confirmar resposta</button></p>`;
if(answered){const ok=answers[answers.length-1]===1;$('quiz-feedback').innerHTML=`<div class="message"><strong>${ok?'✅ Resposta correta! (+2 pontos)':'🔎 Vamos entender! (+0 pontos)'}</strong><p><strong>Resposta:</strong> ${esc(options[correct])}</p><p>${esc(explanation)}</p></div>`;$('quiz-action').textContent=qidx===questions.length-1?'Ver resultado final':'Próximo desafio'}
$('quiz-action').addEventListener('click',()=>{if(!answered){const selected=document.querySelector('input[name="quiz-answer"]:checked');if(!selected){alert('Selecione uma alternativa.');return}answers.push(Number(Number(selected.value)===correct));answered=true;quizRender()}else{qidx++;answered=false;quizRender()}})}
function readRank(){try{const v=JSON.parse(localStorage.getItem('datalab-ranking-prob-v1')||'[]');return Array.isArray(v)?v:[]}catch(e){return []}}
function renderRank(){const rows=readRank().sort((a,b)=>b.pontos-a.pontos).slice(0,10);$('ranking').innerHTML=rows.length?`<table class="rank"><thead><tr><th>#</th><th>Apelido</th><th>Pontos</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.apelido)}</td><td>${Number(r.pontos)}</td></tr>`).join('')}</tbody></table>`:'<p class="muted">Ainda não há participantes neste navegador.</p>'}
$('ranking-export').addEventListener('click',()=>{const rows=readRank();const csv='apelido,pontos,acertos,data_hora\r\n'+rows.map(r=>[r.apelido,r.pontos,r.acertos,r.data_hora].map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');const a=document.createElement('a'),url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));a.href=url;a.download='ranking_probabilidades_local.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)});
$('quiz-sim').addEventListener('click',()=>{const n=Number($('quiz-n').value);if(!Number.isInteger(n)||n<100||n>100000){alert('Informe entre 100 e 100.000 jogos.');return}showSim('quiz-bars',n)});quizRender();renderRank();
