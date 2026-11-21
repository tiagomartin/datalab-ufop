'use strict';
const $=id=>document.getElementById(id);
function say(text){$('status').textContent=text;}
const icons=['✊','✋','✌️'],names=['Pedra','Papel','Tesoura'];
let hist=[],w=0,l=0,t=0,animating=false,roundToken=0,net,evals=[];
const buttons=[...document.querySelectorAll('[data-play]')];
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const zeros=n=>Array(n).fill(0), rand=()=>Math.random();
const matrix=(n,m)=>Array.from({length:n},()=>Array.from({length:m},()=> (rand()*2-1)*Math.sqrt(2/m)));
function initNet(){return {W:matrix(6,18),b:zeros(6),V:matrix(3,6),d:zeros(3),steps:0};}
function features(h){const x=zeros(18);h.slice(-3).forEach((r,i)=>{x[i*6+r.u]=1;x[i*6+3+r.r]=1;});return x;}
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function forward(x){const z=net.W.map((a,i)=>dot(a,x)+net.b[i]),h=z.map(v=>Math.max(0,v)),a=net.V.map((v,i)=>dot(v,h)+net.d[i]),m=Math.max(...a),e=a.map(v=>Math.exp(v-m)),s=e.reduce((a,b)=>a+b,0);return {z,h,p:e.map(v=>v/s)};}
function train(x,y){const {z,h,p}=forward(x),d=p.map((v,i)=>v-(i===y?1:0)),g=h.map((_,j)=>z[j]>0?net.V.reduce((s,v,i)=>s+v[j]*d[i],0):0),lr=.08;net.V.forEach((v,i)=>{v.forEach((_,j)=>v[j]-=lr*d[i]*h[j]);net.d[i]-=lr*d[i];});net.W.forEach((v,i)=>{v.forEach((_,j)=>v[j]-=lr*g[i]*x[j]);net.b[i]-=lr*g[i];});net.steps++;}
function freq(h){let a=[1,1,1];h.forEach(r=>a[r.u]++);return a.map(v=>v/(h.length+3));}
function estimate(h,mode){if(mode==='random'||h.length<3)return [1/3,1/3,1/3];if(mode==='smart')return freq(h);if(mode==='neural')return net.steps?forward(features(h)).p:freq(h);let a=[1,1,1],last=h.at(-1).u;for(let i=1;i<h.length;i++)if(h[i-1].u===last)a[h[i].u]++;let n=a.reduce((s,v)=>s+v,0);return n===3?freq(h):a.map(v=>v/n);}
function best(a){let m=Math.max(...a),idx=a.map((v,i)=>Math.abs(v-m)<1e-10?i:-1).filter(i=>i>=0);return idx[Math.floor(rand()*idx.length)];}
function decide(p,mode){let pred=mode==='smart'&&hist.length>=3?p.indexOf(Math.max(...p)):best(p);let c=mode==='random'||hist.length<3?Math.floor(rand()*3):mode==='smart'?(pred+1)%3:best(p.map((_,i)=>p[(i+2)%3]-p[(i+1)%3]));return {pred,c};}
const descriptions={random:'Escolhas uniformes e independentes, sem treinamento.',smart:'Aprende a escolha mais frequente após três rodadas. Empates de frequência favorecem a primeira categoria.',markov:'Estima a próxima escolha condicionada à última. Sem transições observadas, utiliza frequências.',neural:'Rede neural 18–6–3, atualizada após cada rodada com três jogadas anteriores. Antes da primeira atualização, usa frequências.'};
function render(){
 $('scores').innerHTML=`<span class="stat">Você: ${w}</span><span class="stat">Computador: ${l}</span><span class="stat">Empates: ${t}</span>`;
 $('freq').innerHTML=names.map((n,i)=>`<p>${n}: ${hist.filter(x=>x.u===i).length}</p>`).join('');
 const mode=$('mode').value,p=estimate(hist,mode),n=evals.length,acc=n?100*evals.reduce((s,r)=>s+r.hit,0)/n:0;
 $('method').textContent=descriptions[mode];$('prob').innerHTML=p.map((v,i)=>`<div class="prob-row"><span>${icons[i]} ${names[i]}</span><div class="prob-track"><div style="width:${100*v}%"></div></div><strong>${(100*v).toFixed(1)}%</strong></div>`).join('');
 $('metrics').innerHTML=`<span class="stat">Acurácia: ${n?acc.toFixed(1)+'%':'—'}</span><span class="stat">Previsões: ${n}</span><span class="stat">Referência: 33,3%</span>${mode==='neural'?`<span class="stat">Atualizações da rede: ${net.steps}</span>`:''}`;
 $('lastpred').textContent=n?`Última previsão: ${names[evals.at(-1).pred]} — ${evals.at(-1).hit?'correta':'incorreta'}.`: 'A previsão será avaliada após a primeira rodada.';
 let sum=0,pts=evals.map((r,i)=>{sum+=r.hit;return `${40+540*i/Math.max(1,n-1)},${150-130*sum/(i+1)}`;});
 $('curve').innerHTML=`<g fill="currentColor" font-size="12"><text x="3" y="23">100%</text><text x="8" y="110">33%</text><text x="12" y="154">0%</text><text x="40" y="174">1</text><text x="550" y="174">${n||1}</text></g><path d="M40 20V150H580" stroke="#aab8c6" fill="none"/><path d="M40 106.67H580" stroke="#a06b23" stroke-dasharray="6 4"/>${n>1?`<polyline points="${pts.join(' ')}" fill="none" stroke="#176ca2" stroke-width="3"/>`:n?`<circle cx="40" cy="${150-130*evals[0].hit}" r="4" fill="#176ca2"/>`:''}`;
}
function setBusy(value){animating=value;buttons.forEach(b=>b.disabled=value);$('mode').disabled=value;}
function pause(ms){return new Promise(resolve=>setTimeout(resolve,ms));}
async function play(u){if(animating)return;const token=++roundToken,mode=$('mode').value,p=estimate(hist,mode),{pred,c}=decide(p,mode),x=hist.length>=3?features(hist):null;setBusy(true);const arena=$('arena'),count=$('rps-count');arena.className='rps-arena playing';$('hand-user').textContent='✊';$('hand-cpu').textContent='✊';$('out').textContent='Pedra, papel, tesoura...';say('Rodada em andamento.');for(const step of reducedMotion.matches?['3','2','1']:['3','2','1','JÁ!']){if(token!==roundToken)return;count.classList.remove('pulse');void count.offsetWidth;count.textContent=step;count.classList.add('pulse');await pause(reducedMotion.matches?90:390);}if(token!==roundToken)return;
 $('hand-user').textContent=icons[u];$('hand-cpu').textContent=icons[c];const result=(u-c+3)%3;arena.className='rps-arena revealed '+(result===0?'tie':result===1?'win':'lose');count.classList.remove('pulse');count.textContent=result===0?'🤝':result===1?'🏆':'💻';evals.push({pred,hit:Number(pred===u)});if(mode==='neural'&&x)train(x,u);hist.push({u,r:result});if(result===0)t++;else if(result===1)w++;else l++;$('out').textContent=`Você: ${icons[u]} ${names[u]}. Computador: ${icons[c]} ${names[c]}. ${result===0?'Empate!':result===1?'Você venceu!':'O computador venceu!'}`;say(`Rodada ${hist.length} concluída.`);render();setBusy(false);}
function reset(){++roundToken;setBusy(false);hist=[];evals=[];w=l=t=0;net=initNet();$('arena').className='rps-arena';$('hand-user').textContent='✊';$('hand-cpu').textContent='✊';$('rps-count').textContent='VS';$('rps-count').classList.remove('pulse');$('out').textContent='Escolha sua jogada.';say('Pronto para jogar.');render();}
buttons.forEach(b=>b.addEventListener('click',()=>play(Number(b.dataset.play))));$('reset').addEventListener('click',reset);$('mode').addEventListener('change',reset);net=initNet();render();
