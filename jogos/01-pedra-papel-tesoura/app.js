'use strict';
const icons=['✊','✋','✌️'],names=['Pedra','Papel','Tesoura'];
let hist=[],w=0,l=0,t=0,animating=false,roundToken=0;
const buttons=[...document.querySelectorAll('[data-play]')];
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function render(){
  $('scores').innerHTML=`<span class="stat">Você: ${w}</span><span class="stat">Computador: ${l}</span><span class="stat">Empates: ${t}</span>`;
  $('freq').innerHTML=names.map((n,i)=>`<p>${n}: ${hist.filter(x=>x===i).length}</p>`).join('');
}
function setBusy(value){animating=value;buttons.forEach(b=>b.disabled=value);$('mode').disabled=value;}
function pause(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
function computerMove(){
  let c=rnd(3);
  if($('mode').value==='smart'&&hist.length>=3){
    const counts=[0,1,2].map(i=>hist.filter(x=>x===i).length);
    const likely=counts.indexOf(Math.max(...counts));
    c=(likely+1)%3;
  }
  return c;
}
async function play(u){
  if(animating)return;
  const token=++roundToken;
  const c=computerMove(); // Decidido antes da animação; não depende do resultado.
  setBusy(true);
  const arena=$('arena'),count=$('rps-count');
  arena.className='rps-arena playing';
  $('hand-user').textContent='✊';$('hand-cpu').textContent='✊';
  $('out').textContent='Pedra, papel, tesoura...';
  say('Rodada em andamento.');
  const steps=reducedMotion.matches?['3','2','1']:['3','2','1','JÁ!'];
  for(const step of steps){
    if(token!==roundToken)return;
    count.classList.remove('pulse');void count.offsetWidth;
    count.textContent=step;count.classList.add('pulse');
    await pause(reducedMotion.matches?90:390);
  }
  if(token!==roundToken)return;
  $('hand-user').textContent=icons[u];$('hand-cpu').textContent=icons[c];
  const result=(u-c+3)%3;
  arena.className='rps-arena revealed '+(result===0?'tie':result===1?'win':'lose');
  count.classList.remove('pulse');count.textContent=result===0?'🤝':result===1?'🏆':'💻';
  hist.push(u);
  if(result===0)t++;else if(result===1)w++;else l++;
  $('out').textContent=`Você: ${icons[u]} ${names[u]}. Computador: ${icons[c]} ${names[c]}. ${result===0?'Empate!':result===1?'Você venceu!':'O computador venceu!'}`;
  say(`Rodada ${hist.length} concluída.`);
  render();setBusy(false);
}
buttons.forEach(b=>b.addEventListener('click',()=>play(Number(b.dataset.play))));
$('reset').addEventListener('click',()=>{
  ++roundToken;setBusy(false);hist=[];w=l=t=0;
  $('arena').className='rps-arena';$('hand-user').textContent='✊';$('hand-cpu').textContent='✊';
  $('rps-count').textContent='VS';$('rps-count').classList.remove('pulse');
  $('out').textContent='Escolha sua jogada.';say('Pronto para jogar.');render();
});
render();
