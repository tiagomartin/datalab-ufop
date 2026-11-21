"use strict";
const W=620,H=380;
// Escala didática: 1 unidade das coordenadas do mapa equivale a 0,1 km fictício.
const KM_PER_UNIT=0.1;
const km=units=>units*KM_PER_UNIT;
const fmtKm=units=>`${fmt(km(units))} km`;

const levels={
 easy:{n:5,label:'Fácil',desc:'Pontos distribuídos pelo mapa. Comece identificando uma volta curta.'},
 medium:{n:7,label:'Intermediário',desc:'Destinos agrupados: visitar vizinhos próximos pode ajudar, mas nem sempre é ótimo.'},
 hard:{n:9,label:'Difícil',desc:'Três regiões com destinos próximos entre si. Planeje a ordem de visita dos grupos.'},
 expert:{n:11,label:'Especialista',desc:'Distribuição irregular com destinos próximos e distantes. Cuidado com atalhos enganosos!'}
};
let pts=[],path=[],optimal=null,finished=false,level='easy';
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function routeLength(order){let total=0,prev=0;for(const j of order){total+=dist(pts[prev],pts[j]);prev=j;}return total+dist(pts[prev],pts[0]);}
function partialLength(order){let total=0,prev=0;for(const j of order){total+=dist(pts[prev],pts[j]);prev=j;}return total;}
function random(min,max){return min+Math.random()*(max-min);}
function candidate(cx,cy,sx,sy){return {x:Math.max(50,Math.min(570,cx+random(-sx,sx))),y:Math.max(44,Math.min(335,cy+random(-sy,sy)))};}
function createPoints(){
 const cfg=levels[level];pts=[{x:310,y:190}];let tries=0;
 const centers=level==='medium'?[[160,100],[470,260]]:level==='hard'?[[125,90],[485,110],[320,290]]:[[115,100],[485,85],[120,285],[495,280],[315,75]];
 for(let i=0;i<cfg.n;i++){
   let p,attempt=0;
   do{
     if(level==='easy')p={x:random(65,555),y:random(55,325)};
     else{let center=centers[i%centers.length];let spread=level==='medium'?75:level==='hard'?57:75;p=candidate(center[0],center[1],spread,spread*.75);}
     attempt++;tries++;
   }while(pts.some(q=>dist(p,q)<(level==='expert'?30:37))&&attempt<300);
   pts.push(p);
 }
}
// Held-Karp: solução exata do problema do caixeiro-viajante, com base fixa (0).
function solveExact(){
 const n=pts.length-1, size=1<<n;
 const dp=Array.from({length:size},()=>new Float64Array(n).fill(Infinity));
 const parent=Array.from({length:size},()=>new Int16Array(n).fill(-1));
 const d=pts.map(a=>pts.map(b=>dist(a,b)));
 for(let j=0;j<n;j++)dp[1<<j][j]=d[0][j+1];
 for(let mask=1;mask<size;mask++)for(let j=0;j<n;j++){
   if(!(mask&(1<<j)))continue;
   const prev=mask^(1<<j);if(!prev)continue;
   for(let k=0;k<n;k++)if(prev&(1<<k)){
     const v=dp[prev][k]+d[k+1][j+1];
     if(v<dp[mask][j]){dp[mask][j]=v;parent[mask][j]=k;}
   }
 }
 let best=Infinity,end=-1,mask=size-1;
 for(let j=0;j<n;j++){const v=dp[mask][j]+d[j+1][0];if(v<best){best=v;end=j;}}
 const order=[];while(end!==-1){order.push(end+1);const prev=parent[mask][end];mask^=1<<end;end=prev;}
 order.reverse();return {best,order};
}
function draw(){
 const c=resetCanvas('map',W,H);axes(c,W,H);
 // Barra de escala: 100 unidades horizontais do mapa = 10 km fictícios.
 c.save();
 c.fillStyle='rgba(255,255,255,0.92)';c.fillRect(18,H-49,144,38);
 c.strokeStyle='#163d64';c.lineWidth=3;c.beginPath();
 c.moveTo(27,H-23);c.lineTo(127,H-23);
 c.moveTo(27,H-29);c.lineTo(27,H-17);
 c.moveTo(127,H-29);c.lineTo(127,H-17);c.stroke();
 c.font='12px sans-serif';c.fillStyle='#163d64';c.textAlign='center';
 c.fillText('10 km fictícios',77,H-32);c.restore();
 if(finished&&optimal){const seq=[0,...optimal.order,0];line(c,seq.map(i=>[pts[i].x,pts[i].y]),'#147bb5',3);}
 if(path.length){const seq=[0,...path,...(finished?[0]:[])];line(c,seq.map(i=>[pts[i].x,pts[i].y]),'#ed8a35',3);}
 pts.forEach((p,i)=>{
   const chosen=path.includes(i);dot(c,p.x,p.y,i===0?'#174b8d':chosen?'#ed8a35':'#1595a2',12);
   c.fillStyle='#fff';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText(i===0?'B':String(i),p.x,p.y+4.5);
   if(chosen){c.strokeStyle='#b96a25';c.lineWidth=2;c.beginPath();c.arc(p.x,p.y,15,0,2*Math.PI);c.stroke();}
 });c.textAlign='start';
 $('visited').textContent=`${path.length} de ${pts.length-1} destinos visitados`;
 $('distance').textContent=`Distância parcial: ${fmtKm(partialLength(path))}`;
 $('finish').disabled=finished||path.length!==pts.length-1;
 $('undo').disabled=finished||path.length===0;
}
function updateRecord(){const best=loadLocal('rotas-record-'+level,null);$('record').textContent=best===null?'Melhor resultado neste nível: ainda não registrado.':`Seu melhor excesso neste nível: ${pct(best)} em relação ao ótimo.`;}
function fresh(){level=$('level').value;createPoints();path=[];finished=false;optimal=null;
 $('level-desc').textContent=levels[level].desc;
 $('route').textContent='Clique nos destinos, um de cada vez.';
 $('segments').innerHTML='';
 draw();updateRecord();say(`Novo desafio ${levels[level].label.toLowerCase()}: ${pts.length-1} destinos.`);
}
$('map').addEventListener('click',e=>{
 if(finished)return;
 const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
 let closest=-1,minimum=22;
 pts.forEach((p,i)=>{if(i===0||path.includes(i))return;const dd=dist(p,{x,y});if(dd<minimum){minimum=dd;closest=i;}});
 if(closest<0)return;
 path.push(closest);draw();say(path.length===pts.length-1?'Todos os destinos escolhidos. Clique em Avaliar rota.':`${path.length} de ${pts.length-1} destinos visitados.`);
});
$('undo').onclick=()=>{if(finished||!path.length)return;path.pop();draw();say('Última escolha desfeita.');};
$('finish').onclick=()=>{
 if(finished||path.length!==pts.length-1)return;
 optimal=solveExact();finished=true;
 const actual=routeLength(path),extra=Math.max(0,actual/optimal.best-1);
 const previous=loadLocal('rotas-record-'+level,null);
 if(previous===null||extra<previous)saveLocal('rotas-record-'+level,extra);
 $('route').innerHTML=`<strong>Sua rota:</strong> ${fmtKm(actual)}<br><strong>Rota ótima:</strong> ${fmtKm(optimal.best)}<br><strong>Excesso:</ ${pct(extra)}<br><strong>Ordem ótima:</strong> Base → ${optimal.order.join(' → ')} → Base<br><strong>${extra<0.00001?'🏆 Parabéns! Você encontrou uma rota ótima.':extra<.1?'Excelente! Você ficou a menos de 10% do ótimo.':'Experimente uma ordem diferente no próximo desafio.'}</strong>`;
 const seq=[0,...path,0];
 const segments=seq.slice(1).map((id,i)=>({from:seq[i],to:id,units:dist(pts[seq[i]],pts[id])}));
 $('segments').innerHTML='<strong>Como foi calculada sua distância</strong><p class="small muted">Somamos os trechos em linha reta, incluindo a volta à base:</p><div class="segments-table"><table><thead><tr><th>Trecho</th><th>Distância</th></tr></thead><tbody>'+segments.map(v=>`<tr><td>${v.from===0?'Base':v.from} → ${v.to===0?'Base':v.to}</td><td>${fmtKm(v.units)}</td></tr>`).join('')+`<tr class="total-row"><td>Total</td><td>${fmtKm(actual)}</td></tr>`+'</tbody></table></div>';
 draw();updateRecord();say('Rota avaliada. Laranja: sua rota. Azul: rota ótima. Distâncias em quilômetros fictícios.');
};
$('new').onclick=fresh;$('level').onchange=fresh;fresh();
