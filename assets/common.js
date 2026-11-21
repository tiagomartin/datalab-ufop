
'use strict';
const $=id=>document.getElementById(id), rnd=n=>Math.floor(Math.random()*n), pick=a=>a[rnd(a.length)];
const fmt=x=>Number(x).toLocaleString('pt-BR',{maximumFractionDigits:2});
const pct=x=>(100*x).toFixed(1).replace('.',',')+'%';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function say(t){$('status').textContent=t}
function resetCanvas(id,w=620,h=380){const c=$(id),r=window.devicePixelRatio||1;c.width=w*r;c.height=h*r;c.style.aspectRatio=w+'/'+h;const ctx=c.getContext('2d');ctx.scale(r,r);ctx.clearRect(0,0,w,h);return ctx}
function axes(ctx,w=620,h=380){ctx.strokeStyle='#dce6ee';ctx.lineWidth=1;for(let i=0;i<=10;i++){ctx.beginPath();ctx.moveTo(30+i*(w-55)/10,20);ctx.lineTo(30+i*(w-55)/10,h-25);ctx.stroke();ctx.beginPath();ctx.moveTo(30,20+i*(h-45)/10);ctx.lineTo(w-25,20+i*(h-45)/10);ctx.stroke()}}
function dot(ctx,x,y,color='#147bb5',radius=6){ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,radius,0,2*Math.PI);ctx.fill()}
function line(ctx,points,color='#176a9b',width=3){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke()}
function saveLocal(key,val){try{localStorage.setItem('datalab-'+key,JSON.stringify(val))}catch(e){}}
function loadLocal(key,def){try{return JSON.parse(localStorage.getItem('datalab-'+key))??def}catch(e){return def}}
function download(name,txt){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
