'use strict';
// Características didáticas simplificadas para cada animal.
const QUESTIONS = [{"key": "agua", "text": "Vive principalmente na água?"}, {"key": "mamifero", "text": "É mamífero?"}, {"key": "ave", "text": "É uma ave?"}, {"key": "voa", "text": "Consegue voar?"}, {"key": "reptil", "text": "É réptil?"}, {"key": "anfibio", "text": "É anfíbio?"}, {"key": "peixe", "text": "É peixe?"}, {"key": "invertebrado", "text": "É invertebrado?"}, {"key": "marinho", "text": "Vive no mar?"}, {"key": "doce", "text": "Vive em rios ou lagos?"}, {"key": "terrestre", "text": "Vive principalmente em terra firme?"}, {"key": "arvore", "text": "Costuma viver em árvores?"}, {"key": "carnivoro", "text": "Alimenta-se principalmente de outros animais?"}, {"key": "herbivoro", "text": "Alimenta-se principalmente de plantas?"}, {"key": "onivoro", "text": "Come alimentos de origem animal e vegetal?"}, {"key": "grande", "text": "Um adulto costuma ter mais de 1 metro de comprimento ou altura?"}, {"key": "pelos", "text": "Tem pelos?"}, {"key": "penas", "text": "Tem penas?"}, {"key": "escamas", "text": "Tem escamas visíveis?"}, {"key": "casco", "text": "Tem casco ou carapaça rígida?"}, {"key": "patas4", "text": "Tem quatro patas?"}, {"key": "patas6", "text": "Tem seis patas?"}, {"key": "patas8", "text": "Tem oito patas?"}, {"key": "bico", "text": "Tem bico?"}, {"key": "venenoso", "text": "Possui veneno ou peçonha?"}, {"key": "domestico", "text": "É comumente criado por seres humanos?"}, {"key": "noturno", "text": "É predominantemente noturno?"}, {"key": "antartida", "text": "Vive naturalmente na Antártida?"}, {"key": "tromba", "text": "Possui tromba?"}, {"key": "listras", "text": "Possui listras marcantes?"}, {"key": "manchas", "text": "Possui manchas marcantes?"}, {"key": "chifres", "text": "Possui chifres ou galhadas?"}, {"key": "salta", "text": "Desloca-se frequentemente por saltos?"}, {"key": "sempernas", "text": "Não possui pernas?"}];
const ANIMALS = [{"name": "Leão", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Elefante", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]}, {"name": "Golfinho", "traits": [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Tubarão", "traits": [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Águia", "traits": [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Pinguim", "traits": [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0]}, {"name": "Cobra", "traits": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]}, {"name": "Jacaré", "traits": [1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Morcego", "traits": [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Baleia", "traits": [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]}, {"name": "Gato", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Cachorro", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Cavalo", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Vaca", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0]}, {"name": "Zebra", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]}, {"name": "Girafa", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]}, {"name": "Tigre", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]}, {"name": "Onça-pintada", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]}, {"name": "Urso-polar", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Coelho", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0]}, {"name": "Canguru", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]}, {"name": "Macaco", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Preguiça", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Capivara", "traits": [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Lontra", "traits": [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Foca", "traits": [1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Pato", "traits": [1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Galinha", "traits": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Coruja", "traits": [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Papagaio", "traits": [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Avestruz", "traits": [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Flamingo", "traits": [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Tartaruga-marinha", "traits": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Jabuti", "traits": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Camaleão", "traits": [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Sapo", "traits": [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]}, {"name": "Rã", "traits": [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]}, {"name": "Salamandra", "traits": [0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Peixe-palhaço", "traits": [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0]}, {"name": "Piranha", "traits": [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Polvo", "traits": [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]}, {"name": "Água-viva", "traits": [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1]}, {"name": "Caranguejo", "traits": [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Borboleta", "traits": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Abelha", "traits": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Formiga", "traits": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Aranha", "traits": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Escorpião", "traits": [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0]}, {"name": "Joaninha", "traits": [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]}];

// Fotografias: primeiro arquivos locais fornecidos pelo organizador; depois
// miniaturas da Wikipedia (requer internet); sem conexao, cartao ilustrado.
const ANIMAL_EMOJI=['🦁','🐘','🐬','🦈','🦅','🐧','🐍','🐊','🦇','🐋','🐈','🐕','🐎','🐄','🦓','🦒','🐅','🐆','🐻‍❄️','🐇','🦘','🐒','🦥','🦫','🦦','🦭','🦆','🐔','🦉','🦜','🐦','🦩','🐢','🐢','🦎','🐸','🐸','🦎','🐠','🐟','🐙','🪼','🦀','🦋','🐝','🐜','🕷️','🦂','🐞'];
const PHOTO_SLUGS=['leao','elefante','golfinho','tubarao','aguia','pinguim','cobra','jacare','morcego','baleia','gato','cachorro','cavalo','vaca','zebra','girafa','tigre','onca-pintada','urso-polar','coelho','canguru','macaco','preguica','capivara','lontra','foca','pato','galinha','coruja','papagaio','avestruz','flamingo','tartaruga-marinha','jabuti','camaleao','sapo','ra','salamandra','peixe-palhaco','piranha','polvo','agua-viva','caranguejo','borboleta','abelha','formiga','aranha','escorpiao','joaninha'];
const WIKI_TITLES=['Leão','Elefante','Golfinho','Tubarão','Águia','Pinguim','Serpente','Jacaré','Morcego','Baleia','Gato','Cão','Cavalo','Vaca','Zebra','Girafa','Tigre','Onça-pintada','Urso-polar','Coelho','Canguru','Macaco','Bicho-preguiça','Capivara','Lontra','Foca','Pato','Galinha','Coruja','Papagaio','Avestruz','Flamingo','Tartaruga-marinha','Jabuti','Camaleão','Sapo','Rã','Salamandra','Peixe-palhaço','Piranha','Polvo','Água-viva','Caranguejo','Borboleta','Abelha','Formiga','Aranha','Escorpião','Joaninha'];
function animalPhoto(targetId,id){
  const box=$(targetId);if(!box)return;
  box.hidden=false;box.replaceChildren();
  const name=ANIMALS[id].name;
  const fig=document.createElement('figure');fig.className='animal-photo-figure';
  const visual=document.createElement('div');visual.className='animal-photo-placeholder';visual.textContent=ANIMAL_EMOJI[id]||'🐾';
  const img=document.createElement('img');img.alt=`Fotografia de ${name}`;img.loading='lazy';img.hidden=true;
  const cap=document.createElement('figcaption');cap.textContent=name;
  fig.append(visual,img,cap);box.append(fig);
  let active=true;
  const showImage=url=>{if(!active||!box.isConnected)return;img.onload=()=>{img.hidden=false;visual.hidden=true;};img.onerror=()=>{img.hidden=true;visual.hidden=false;};img.src=url;};
  const local=`assets/animais/${PHOTO_SLUGS[id]}.webp`;
  // Preferir fotos locais. Caso nao existam, tentar fonte online.
  const probe=new Image();
  probe.onload=()=>showImage(local);
  probe.onerror=()=>{
    const url=`https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(WIKI_TITLES[id])}`;
    if(!navigator.onLine){return;}
    fetch(url).then(r=>r.ok?r.json():Promise.reject(Error('sem foto')))
      .then(d=>{if(d.thumbnail&&d.thumbnail.source){showImage(d.thumbnail.source);cap.textContent=`${name} · imagem: Wikipédia/Wikimedia Commons`;}})
      .catch(()=>{});
  };
  probe.src=local;
}
function animalProgress(n,trackId,barId,labelId){
  const initial=Math.log2(ANIMALS.length), current=n>0?Math.log2(n):0;
  const pct=n===0?0:Math.max(0,Math.min(100,100*(1-current/initial)));
  $(barId).style.width=pct.toFixed(1)+'%';$(trackId).setAttribute('aria-valuenow',pct.toFixed(1));
  $(labelId).textContent=n===0?'Aguardando o início do desafio.':`${pct.toFixed(1).replace('.',',')}% de redução da incerteza · ${n} candidato(s) · ${current.toFixed(2).replace('.',',')} bits`;
}

let secret=0, possible=[], asked=new Set(), turns=0, wins=0, done=false;
const ent=n=>n>0?Math.log2(n):0;
const questionSelect=$('question');
const guessSelect=$('guess');
const allIds=ANIMALS.map((_,i)=>i);
function fillQuestions(){
  questionSelect.innerHTML=QUESTIONS.map((q,i)=>`<option value="${i}">${esc(q.text)}</option>`).join('');
}
function fillGuesses(){
  guessSelect.innerHTML=possible.map(i=>`<option value="${i}">${esc(ANIMALS[i].name)}</option>`).join('');
}
function updateQuestionOptions(){
  const selected=Number(questionSelect.value);
  questionSelect.innerHTML=QUESTIONS.map((q,i)=>{
    const yes=possible.filter(j=>ANIMALS[j].traits[i]).length;
    const no=possible.length-yes;
    const disabled=asked.has(i)||yes===0||no===0;
    return `<option value="${i}" ${disabled?'disabled':''}>${esc(q.text)}${asked.has(i)?' ✓':''}</option>`;
  }).join('');
  const chosen=questionSelect.querySelector(`option[value="${selected}"]`);
  if(chosen&&!chosen.disabled)questionSelect.value=String(selected);
  else {const first=Array.from(questionSelect.options).find(o=>!o.disabled);if(first)questionSelect.value=first.value;}
  $('ask').disabled=done||!Array.from(questionSelect.options).some(o=>!o.disabled);
}
function render(){
  const remaining=possible.length;
  $('remaining').innerHTML=`<p><strong>${remaining} candidatos:</strong> ${possible.map(i=>esc(ANIMALS[i].name)).join(', ')}</p>`;
  const ranked=QUESTIONS.map((q,i)=>{
    const yes=possible.filter(j=>ANIMALS[j].traits[i]).length;
    const no=remaining-yes;
    const p=yes/remaining;
    const h= (p>0&&p<1)?(-p*Math.log2(p)-(1-p)*Math.log2(1-p)):0;
    return {i,yes,no,h};
  }).filter(r=>!asked.has(r.i)&&r.yes&&r.no).sort((a,b)=>b.h-a.h);
  const top=ranked.slice(0,5);
  $('suggestions').innerHTML=top.length?`<strong>Perguntas mais informativas agora:</strong><ul>${top.map(r=>`<li>${esc(QUESTIONS[r.i].text)} — Sim: ${r.yes}, Não: ${r.no} (ganho esperado: ${fmt(r.h)} bits)</li>`).join('')}</ul>`:'Nenhuma pergunta restante divide os candidatos.';
  animalProgress(remaining,'human-progress-track','human-progress-bar','human-progress-label');
  $('entropy').textContent=`Incerteza inicial: ${fmt(ent(ANIMALS.length))} bits. Atual: ${fmt(ent(remaining))} bits (hipótese de animais equiprováveis).`;
  $('score').textContent=`Perguntas nesta rodada: ${turns} • Acertos acumulados: ${wins}`;
  fillGuesses();updateQuestionOptions();
  guessSelect.disabled=done;
  $('guessbtn').disabled=done;
  say(`${remaining} candidatos restantes. ${turns} pergunta(s) feita(s).`);
}
function fresh(){
  secret=rnd(ANIMALS.length);possible=allIds.slice();asked=new Set();turns=0;done=false;
  $('human-reveal').hidden=true;
  $('log').textContent='Novo animal escolhido. Faça uma pergunta.';
  render();
}
$('ask').addEventListener('click',()=>{
  if(done)return;
  const i=Number(questionSelect.value);
  if(!Number.isInteger(i)||i<0||i>=QUESTIONS.length||asked.has(i))return;
  const yes=possible.filter(j=>ANIMALS[j].traits[i]).length;
  if(yes===0||yes===possible.length)return;
  asked.add(i);turns++;
  const answer=ANIMALS[secret].traits[i];
  possible=possible.filter(j=>ANIMALS[j].traits[i]===answer);
  $('log').textContent=`${QUESTIONS[i].text} — ${answer?'Sim':'Não'}.`;
  render();
});
$('guessbtn').addEventListener('click',()=>{
  if(done)return;
  const guess=Number(guessSelect.value);
  if(!Number.isInteger(guess)||!possible.includes(guess))return;
  done=true;const ok=guess===secret;if(ok)wins++;
  animalPhoto('human-reveal',secret);
  $('log').textContent=`${ok?'🎉 Acertou!':'Não foi dessa vez.'} O animal era ${ANIMALS[secret].name}. Você fez ${turns} pergunta(s).`;
  render();
});
$('new').addEventListener('click',fresh);
fillQuestions();fresh();


// Modo inverso: o visitante pensa em um animal e a IA seleciona perguntas
// por ganho de informacao (entropia binaria, candidatos equiprovaveis).
(function initAIGuesser(){
  const humanGame=$('human-game'), aiGame=$('ai-game');
  const humanBtn=$('mode-human'), aiBtn=$('mode-ai');
  let candidates=[], used=new Set(), history=[], pending=null, active=false, finished=false;
  const show=(id,on)=>{$(id).hidden=!on;};
  function setMode(ai){
    humanGame.hidden=ai; aiGame.hidden=!ai;
    humanBtn.classList.toggle('mode-selected',!ai);
    aiBtn.classList.toggle('mode-selected',ai);
    humanBtn.setAttribute('aria-pressed',String(!ai));
    aiBtn.setAttribute('aria-pressed',String(ai));
    say(ai?'Modo IA: pense em um animal e inicie o desafio.':'Modo visitante: descubra o animal secreto.');
  }
  humanBtn.addEventListener('click',()=>setMode(false));
  aiBtn.addEventListener('click',()=>setMode(true));
  $('ai-animals').textContent=ANIMALS.map(a=>a.name).join(' • ');
  function metrics(){
    $('ai-metrics').textContent=`${candidates.length} candidato(s) • ${history.filter(h=>h.kind==='answer').length} pergunta(s) • Incerteza: ${fmt(ent(candidates.length))} bits`;
    animalProgress(candidates.length,'ai-progress-track','ai-progress-bar','ai-progress-label');
    $('ai-history').innerHTML=history.length?`<strong>Histórico:</strong><ol>${history.map(h=>`<li>${esc(h.text)}</li>`).join('')}</ol>`:'';
  }
  function finish(message){
    finished=true; active=false; pending=null;
    show('ai-question-box',false);show('ai-guess-box',false);
    $('ai-message').textContent=message;metrics();
  }
  function advance(){
    metrics();
    if(!active||finished)return;
    show('ai-question-box',false);show('ai-guess-box',false);
    $('ai-reveal').hidden=true;
    if(!candidates.length){
      finish('Não restou nenhum animal compatível com as respostas. Confira se todas as respostas foram consistentes com a lista didática. Reinicie para tentar novamente.');return;
    }
    if(candidates.length===1){
      pending={kind:'guess',id:candidates[0]};
      $('ai-guess').textContent=`É ${ANIMALS[pending.id].name}?`;
      animalPhoto('ai-reveal',pending.id);
      $('ai-explanation').textContent='Resta apenas um candidato: a incerteza é zero bit.';
      $('ai-message').textContent='A IA chegou a uma hipótese. Confirme ou rejeite o palpite.';
      show('ai-guess-box',true);return;
    }
    let best=null;
    QUESTIONS.forEach((q,i)=>{
      if(used.has(i))return;
      const yes=candidates.filter(j=>ANIMALS[j].traits[i]===1).length;
      const no=candidates.length-yes;
      if(!yes||!no)return;
      const prop=yes/candidates.length;
      const gain=-prop*Math.log2(prop)-(1-prop)*Math.log2(1-prop);
      if(!best||gain>best.gain)best={kind:'question',i,yes,no,gain};
    });
    if(!best){
      pending={kind:'guess',id:candidates[0]};
      $('ai-guess').textContent=`É ${ANIMALS[pending.id].name}?`;
      animalPhoto('ai-reveal',pending.id);
      $('ai-explanation').textContent='Nenhuma pergunta disponível separa os candidatos restantes. A IA tentará um palpite.';
      $('ai-message').textContent='Não há mais perguntas discriminantes. Confirme ou rejeite o palpite.';
      show('ai-guess-box',true);return;
    }
    pending=best;
    $('ai-question').textContent=QUESTIONS[best.i].text;
    $('ai-explanation').textContent=`Esta pergunta divide os ${candidates.length} candidatos em ${best.yes} que responderiam “sim” e ${best.no} que responderiam “não”. Ganho esperado de informação: ${fmt(best.gain)} bits.`;
    $('ai-message').textContent='Responda à pergunta da IA de acordo com o animal escolhido.';
    show('ai-question-box',true);
  }
  function start(){
    candidates=allIds.slice();used=new Set();history=[];pending=null;active=true;finished=false;
    $('ai-reveal').hidden=true;
    $('ai-message').textContent='A IA começou a investigar!';advance();
  }
  function answer(value){
    if(!active||!pending||pending.kind!=='question')return;
    const i=pending.i;
    history.push({kind:'answer',text:`${QUESTIONS[i].text} — ${value?'Sim':'Não'}`});
    used.add(i);
    candidates=candidates.filter(j=>ANIMALS[j].traits[i]===Number(value));
    pending=null;advance();
  }
  $('ai-start').addEventListener('click',start);
  $('ai-restart').addEventListener('click',()=>{
    candidates=[];used=new Set();history=[];pending=null;active=false;finished=false;
    $('ai-reveal').hidden=true;
    show('ai-question-box',false);show('ai-guess-box',false);
    $('ai-message').textContent='Clique em Começar desafio para iniciar.';
    $('ai-explanation').textContent='Aguardando o início do desafio.';metrics();
  });
  $('ai-yes').addEventListener('click',()=>answer(true));
  $('ai-no').addEventListener('click',()=>answer(false));
  $('ai-correct').addEventListener('click',()=>{
    if(!active||!pending||pending.kind!=='guess')return;
    const name=ANIMALS[pending.id].name;
    history.push({kind:'guess',text:`Palpite: ${name} — correto`});
    finish(`🎉 A IA acertou: ${name}! Foram necessárias ${history.filter(h=>h.kind==='answer').length} perguntas.`);
  });
  $('ai-wrong').addEventListener('click',()=>{
    if(!active||!pending||pending.kind!=='guess')return;
    const id=pending.id;
    history.push({kind:'guess',text:`Palpite: ${ANIMALS[id].name} — incorreto`});
    candidates=candidates.filter(j=>j!==id);pending=null;advance();
  });
  metrics();setMode(false);
})();
