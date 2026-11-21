"use strict";
let mode='virtual';
let virtualTruth=0;
let physicalTruth=null;
let done=false;
let history=loadLocal('balas',[]);
const el=id=>document.getElementById(id);
function truth(){return mode==='physical'?physicalTruth:virtualTruth;}
function fmtInt(n){return Number(n).toLocaleString('pt-BR');}
function refresh(){
  el('history').textContent=history.length?history.slice(-8).map(h=>`${fmtInt(h.guess)} balas (real ${fmtInt(h.truth)}, erro ${fmtInt(Math.abs(h.guess-h.truth))}; ${h.mode==='physical'?'físico':'virtual'})`).join(' • '):'Nenhum palpite registrado.';
}
function updateControls(){
  el('virtual-controls').hidden=mode!=='virtual';
  el('physical-controls').hidden=mode!=='physical';
  el('new').textContent=mode==='physical'?'Nova rodada':'Novo pote';
  el('physical-ready').textContent=physicalTruth===null?'Aguardando configuração do pote físico pelo organizador.':'Pote físico configurado. Já é possível registrar palpites.';
  el('send').disabled=mode==='physical'&&physicalTruth===null;
  el('sim').disabled=mode==='physical'&&physicalTruth===null;
}
function resetRound(){
  done=false;
  el('result').textContent=mode==='physical'?'Observe o pote físico e registre seu palpite.':'Novo pote virtual: estime a quantidade de balas.';
  el('simres').textContent='Aguardando simulação.';
  updateControls();
}
function next(){
  if(mode==='virtual') virtualTruth=45+Math.floor(Math.random()*106);
  resetRound();
  say(mode==='physical'?'Nova rodada com o mesmo pote físico.':'Novo desafio virtual disponível.');
}
function changeMode(nextMode){
  mode=nextMode;
  if(mode==='virtual') virtualTruth=45+Math.floor(Math.random()*106);
  el('organizer').open=false;
  resetRound();
  say(mode==='physical'?'Modo pote físico selecionado.':'Modo pote virtual selecionado.');
}
function savePhysical(){
  const raw=el('physical-truth').value.trim();
  const val=Number(raw);
  if(!/^\d+$/.test(raw)||!Number.isSafeInteger(val)||val<1||val>1000000){say('Informe um total inteiro entre 1 e 1.000.000.');return;}
  physicalTruth=val;
  el('physical-truth').value='';
  el('physical-config-status').textContent='Quantidade configurada. O valor não será exibido antes do palpite.';
  el('organizer').open=false;
  resetRound();
  say('Pote físico configurado. Entregue a tela ao visitante.');
}
function send(){
  if(done){say('Clique em '+(mode==='physical'?'Nova rodada':'Novo pote')+' para outra tentativa.');return;}
  const t=truth();
  if(t===null){say('O organizador precisa configurar o pote físico.');return;}
  const raw=el('guess').value.trim(),g=Number(raw);
  if(!/^\d+$/.test(raw)||!Number.isSafeInteger(g)||g<1||g>1000000){say('Digite um palpite inteiro entre 1 e 1.000.000.');return;}
  done=true;
  const err=Math.abs(g-t);
  history.push({guess:g,truth:t,mode});
  saveLocal('balas',history);
  el('result').textContent=`Havia ${fmtInt(t)} balas no ${mode==='physical'?'pote físico':'pote virtual'}. Seu palpite foi ${fmtInt(g)}. Erro absoluto: ${fmtInt(err)} (${pct(err/t)}).`;
  refresh();
  say('Palpite registrado apenas neste navegador.');
}
function normal(){return Math.sqrt(-2*Math.log(Math.max(1e-12,Math.random())))*Math.cos(2*Math.PI*Math.random());}
function sim(){
  const t=truth();
  if(t===null){say('Configure o pote físico antes de simular.');return;}
  const n=Number(el('n').value),s=Number(el('sigma').value);
  if(!Number.isInteger(n)||n<10||n>10000||!Number.isFinite(s)||s<=0||s>100){say('Revise os parâmetros da simulação.');return;}
  let sum=0;for(let i=0;i<n;i++)sum+=t+s*normal();
  const avg=sum/n;
  el('simres').textContent=`Quantidade de referência: ${fmtInt(t)}. Média de ${n} estimativas: ${fmt(avg)}. Erro da média: ${fmt(Math.abs(avg-t))}. Desvio-padrão teórico da média: ${fmt(s/Math.sqrt(n))}.`;
}
document.querySelectorAll('input[name="mode"]').forEach(r=>r.addEventListener('change',()=>{if(r.checked)changeMode(r.value)}));
el('save-physical').addEventListener('click',savePhysical);
el('send').addEventListener('click',send);
el('new').addEventListener('click',next);
el('sim').addEventListener('click',sim);
refresh();next();
