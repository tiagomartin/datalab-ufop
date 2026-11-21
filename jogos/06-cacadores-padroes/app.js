 'use strict';
const W=620,H=380, colors=['#e47731','#277db4','#299b76','#9a62c8','#d64e83','#ad8031','#3f94a1','#c25555'];
let pts=[], centers=[], algorithm=null, generation=0;
const dist2=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
const randn=()=>Math.sqrt(-2*Math.log(Math.max(1e-12,Math.random())))*Math.cos(2*Math.PI*Math.random());
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
const add=(x,y)=>pts.push({x:clamp(x,38,W-32),y:clamp(y,28,H-32)});
function fresh(){
  generation++;pts=[];centers=[];algorithm=null;
  const mode=$('structure').value;
  const jitter=()=>randn()*2.8;
  if(mode==='blobs'||mode==='overlap'){
    const loc=mode==='blobs'?[[150,110],[445,120],[300,285]]:[[200,145],[335,165],[295,258]];
    const sd=mode==='blobs'?28:57;
    for(const [x,y] of loc)for(let i=0;i<65;i++)add(x+randn()*sd,y+randn()*sd);
  }else if(mode==='ellipses'){
    for(let j=0;j<3;j++){
      const cx=[195,335,405][j],cy=[150,250,120][j],a=[.7,-.6,.45][j];
      for(let i=0;i<75;i++){
        let u=randn()*76,v=randn()*13;
        add(cx+Math.cos(a)*u-Math.sin(a)*v,cy+Math.sin(a)*u+Math.cos(a)*v);
      }
    }
  }else if(mode==='moons'){
    for(let j=0;j<2;j++)for(let i=0;i<135;i++){
      const t=Math.random()*Math.PI;
      const x=j===0?240+125*Math.cos(t):370-125*Math.cos(t);
      const y=j===0?220-105*Math.sin(t):175+105*Math.sin(t);
      add(x+randn()*11,y+randn()*11);
    }
  }else if(mode==='rings'){
    for(let j=0;j<2;j++)for(let i=0;i<150;i++){
      const t=Math.random()*Math.PI*2,r=(j?125:58)+randn()*8;
      add(310+r*Math.cos(t),192+r*Math.sin(t));
    }
  }else if(mode==='density'){
    for(let i=0;i<150;i++)add(175+randn()*22,175+randn()*22);
    for(let i=0;i<65;i++)add(410+randn()*57,175+randn()*48);
    for(let i=0;i<35;i++)add(300+randn()*22,290+randn()*18);
    for(let i=0;i<22;i++)add(40+Math.random()*535,28+Math.random()*310);
  }
  $('result').textContent='Clique no gráfico para posicionar os centros.';
  $('lab').textContent='Selecione um método para comparar com sua solução.';
  $('methodLegend').replaceChildren();draw();say('Novo conjunto gerado: '+$('structure').selectedOptions[0].text+'.');
}
function nearest(p,cs){let best=0,d=Infinity;for(let j=0;j<cs.length;j++){let t=dist2(p,cs[j]);if(t<d){d=t;best=j}}return best}
function cost(cs){if(!cs.length)return NaN;return pts.reduce((s,p)=>s+dist2(p,cs[nearest(p,cs)]),0)}
function legend(target,labels,ids){const el=$(target);el.replaceChildren();labels.forEach((t,j)=>{const span=document.createElement('span'),sw=document.createElement('i');sw.style.background=ids[j]<0?'#9aa5b1':colors[ids[j]%colors.length];span.append(sw,document.createTextNode(t));el.append(span)})}
function draw(){
  const c=resetCanvas('scatter',W,H);axes(c,W,H);
  pts.forEach((p,i)=>{
    let color='#65a9c6';
    if(algorithm){let a=algorithm.labels[i];color=a<0?'#a5aeb8':colors[a%colors.length]}
    else if(centers.length)color=colors[nearest(p,centers)%colors.length];
    dot(c,p.x,p.y,color,3.7);
  });
  if(algorithm&&algorithm.type==='kmeans')algorithm.centers.forEach((p,i)=>{c.strokeStyle='#153a67';c.lineWidth=3;c.strokeRect(p.x-9,p.y-9,18,18);dot(c,p.x,p.y,colors[i%colors.length],4)});
  if(!algorithm)centers.forEach((p,i)=>{dot(c,p.x,p.y,colors[i%colors.length],12);c.fillStyle='#fff';c.textAlign='center';c.font='bold 14px sans-serif';c.fillText(String(i+1),p.x,p.y+5)});
  if(algorithm){$('legend').textContent='Visualização do algoritmo. Clique em “Ver minha solução” para voltar.'}
  else{legend('legend',centers.map((_,i)=>'Grupo '+(i+1)),centers.map((_,i)=>i))}
}
function kmeans(k,restarts=12){
  let best=null;
  for(let rep=0;rep<restarts;rep++){
    let cs=[{...pick(pts)}];
    while(cs.length<k){const ds=pts.map(p=>Math.min(...cs.map(c=>dist2(p,c))));const sum=ds.reduce((a,b)=>a+b,0);let r=Math.random()*sum,j=0;while(j<ds.length-1&&(r-=ds[j])>0)j++;cs.push({...pts[j]})}
    for(let it=0;it<100;it++){
      const sums=Array.from({length:k},()=>({x:0,y:0,n:0}));
      pts.forEach(p=>{const j=nearest(p,cs);sums[j].x+=p.x;sums[j].y+=p.y;sums[j].n++});
      const next=cs.map((c,j)=>sums[j].n?{x:sums[j].x/sums[j].n,y:sums[j].y/sums[j].n}:{...pick(pts)});
      const shift=next.reduce((s,p,j)=>s+dist2(p,cs[j]),0);cs=next;if(shift<1e-5)break;
    }
    const sse=cost(cs);if(!best||sse<best.sse)best={type:'kmeans',centers:cs,labels:pts.map(p=>nearest(p,cs)),sse};
  }
  return best;
}
function dbscan(eps,minPts){
  const eps2=eps*eps,n=pts.length,neighbors=pts.map(p=>[]);
  for(let i=0;i<n;i++)for(let j=i;j<n;j++)if(dist2(pts[i],pts[j])<=eps2){neighbors[i].push(j);if(i!==j)neighbors[j].push(i)}
  const UNVISITED=-2,NOISE=-1,labels=Array(n).fill(UNVISITED);let cluster=0;
  for(let i=0;i<n;i++){
    if(labels[i]!==UNVISITED)continue;
    if(neighbors[i].length<minPts){labels[i]=NOISE;continue}
    labels[i]=cluster;const queue=neighbors[i].filter(j=>j!==i);const queued=new Set(queue);
    for(let q=0;q<queue.length;q++){
      const j=queue[q];
      if(labels[j]===NOISE)labels[j]=cluster;
      if(labels[j]!==UNVISITED)continue;
      labels[j]=cluster;
      if(neighbors[j].length>=minPts)for(const t of neighbors[j])if(!queued.has(t)){queued.add(t);queue.push(t)}
    }
    cluster++;
  }
  return{type:'dbscan',labels,clusters:cluster,noise:labels.filter(x=>x<0).length};
}
$('scatter').addEventListener('click',e=>{
  if(algorithm){algorithm=null;$('methodLegend').replaceChildren()}
  const max=+$('userK').value;if(centers.length>=max){say('Todos os centros já foram colocados. Use Desfazer ou Novo conjunto.');draw();return}
  const r=e.currentTarget.getBoundingClientRect();const x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
  if(x<30||x>W-25||y<20||y>H-25)return;
  centers.push({x,y});draw();say(`${centers.length} de ${max} centros definidos.`);
});
$('undo').onclick=()=>{algorithm=null;centers.pop();$('methodLegend').replaceChildren();draw();say(`${centers.length} centros definidos.`)};
$('check').onclick=()=>{
  const k=+$('userK').value;if(centers.length!==k){say(`Coloque ${k} centros antes de avaliar.`);return}
  const baseline=kmeans(k);const a=cost(centers),b=baseline.sse;
  $('result').textContent=`Sua soma de quadrados (SSE): ${fmt(a)}. Referência k-means com ${k} centros: ${fmt(b)}. Sua SSE é ${fmt(a/b)} vez(es) a referência. Para luas ou anéis, esta medida não representa necessariamente a qualidade dos grupos naturais.`;
  say('Sua solução foi avaliada.');
};
$('run').onclick=()=>{
  const method=$('method').value;
  if(method==='kmeans'){
    const k=+$('k').value;algorithm=kmeans(k);$('lab').textContent=`k-means: ${k} grupos, SSE = ${fmt(algorithm.sse)}. Cada ponto recebe a cor do centróide mais próximo. Os quadrados são os centróides.`;
    legend('methodLegend',Array.from({length:k},(_,i)=>`Grupo ${i+1}`),Array.from({length:k},(_,i)=>i));
  }else{
    const eps=+$('eps').value,minPts=+$('minpts').value;
    if(!Number.isInteger(minPts)||minPts<3||minPts>15){say('MinPts deve ser um inteiro entre 3 e 15.');return}
    algorithm=dbscan(eps,minPts);
    $('lab').textContent=`DBSCAN: ${algorithm.clusters} grupo(s), ${algorithm.noise} ponto(s) de ruído. Parâmetros: ε = ${eps}, MinPts = ${minPts}. Altere ε e MinPts para investigar como a estrutura muda.`;
    const labels=Array.from({length:algorithm.clusters},(_,i)=>`Grupo ${i+1}`);labels.push('Ruído');legend('methodLegend',labels,[...labels.slice(0,-1).map((_,i)=>i),-1]);
  }
  draw();say(`Resultado de ${method==='kmeans'?'k-means':'DBSCAN'} exibido.`);
};
$('resetCompare').onclick=()=>{algorithm=null;$('methodLegend').replaceChildren();draw();say('Sua solução foi restaurada.')};
$('method').onchange=()=>{const db=$('method').value==='dbscan';$('dbControls').hidden=!db;$('kControls').hidden=db};
$('eps').oninput=()=>{$('epsOut').textContent=$('eps').value};
$('structure').onchange=fresh;
$('userK').onchange=()=>{centers=[];algorithm=null;draw();$('result').textContent=`Clique ${$('userK').value} vezes para indicar os centros.`;say('Quantidade de centros atualizada.')};
$('new').onclick=fresh;
fresh();
