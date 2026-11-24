'use strict';
const $=id=>document.getElementById(id);
const looks=[
 {name:'浅湾蓝花',place:'浅湾海岸',en:'By the sea',file:'shore',bg:'#dcebe5',color:'#6799a9',dark:'#376779',cta:'走进这片海',text:'沿着棕榈树的影子往前走，浅蓝色的小花，刚好和脚边那片海一个颜色。'},
 {name:'珊瑚晚霞',place:'篝火之夜',en:'After sunset',file:'fire',bg:'#f1ddd0',color:'#ce796b',dark:'#a1504b',cta:'走向篝火',text:'赤脚坐在沙地上。天色一点点暗下去，珊瑚色的肩带还留着最后一点霞光。'},
 {name:'风帆条纹',place:'船上海风',en:'Set sail',file:'sail',bg:'#dde5ec',color:'#44667a',dark:'#2b4a61',cta:'一起出海',text:'白帆在头顶鼓起来，甲板轻轻摇晃。今天想穿海军蓝条纹，把头发交给风。'},
 {name:'青瓷晨光',place:'花园露台',en:'Slow morning',file:'hotel',bg:'#e4e7d5',color:'#8fa28b',dark:'#60755e',cta:'推开露台门',text:'晨光落在青绿色的布料上。推开木门，在花影里慢慢吃完一顿早餐。'}
];
let current=0,previewURL='',audioContext=null,dbPromise;
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
function drawSuit(canvas,i){
 const ctx=canvas.getContext('2d'),l=looks[i];ctx.save();ctx.clearRect(0,0,canvas.width,canvas.height);ctx.scale(canvas.width/210,canvas.height/178);ctx.lineJoin='round';ctx.lineCap='round';
 function line(d,w=1.8,color=l.dark){ctx.strokeStyle=color;ctx.lineWidth=w;ctx.stroke(new Path2D(d))}
 function fabric(d){
  const p=new Path2D(d),g=ctx.createLinearGradient(50,30,155,100);g.addColorStop(0,l.color);g.addColorStop(.48,i===0?'#b0c9c8':l.color);g.addColorStop(1,l.dark);ctx.fillStyle=g;ctx.fill(p);ctx.save();ctx.clip(p);
  if(i===0){for(let y=14;y<175;y+=12)for(let x=25;x<186;x+=14){let cx=x+(y%24?5:0),cy=y+Math.sin(x)*2;ctx.fillStyle='#faf1d9';for(let n=0;n<5;n++){const a=n*1.256;ctx.beginPath();ctx.ellipse(cx+1.8*Math.cos(a),cy+1.8*Math.sin(a),1.6,1.15,a,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#a77c4e';ctx.fillRect(cx-.7,cy-.7,1.4,1.4)}}
  if(i===2){for(let y=10;y<175;y+=9)line('M 20 '+y+' Q 100 '+(y+8)+' 190 '+(y-2),3.6,'#f5efdb')}
  for(let x=15;x<210;x+=3)line('M '+x+' 10 l -23 160',.35,'#fff3');ctx.restore();ctx.lineWidth=1;ctx.strokeStyle=l.dark;ctx.stroke(p)
 }
 if(i===0||i===2){
 line('M52 76 Q62 42 70 20 Q76 8 80 15 Q82 18 78 23 M157 76 Q150 43 140 18 Q135 9 132 16');line('M48 78 Q94 94 162 78',2.7);
 fabric('M48 78 Q59 48 71 26 Q77 24 81 38 L101 79 Q81 89 48 78 Z');fabric('M110 79 Q122 48 134 28 Q140 23 143 35 L161 78 Q139 88 110 79 Z');line('M99 79 Q105 75 111 79 M103 80 Q100 89 96 91 M106 80 Q109 86 113 91');
 }else{
 if(i===3){line('M56 64 L66 19 Q69 12 73 18 L71 57 M140 58 L139 18 Q144 12 146 20 L155 65',3)}
 fabric('M45 57 Q72 47 94 57 Q103 65 107 64 Q125 50 160 56 L156 74 Q144 91 120 81 Q110 74 104 72 Q97 79 83 83 Q57 88 48 72 Z');line('M103 64 Q109 58 121 62 Q116 70 106 68 Q98 62 90 62 Q94 71 103 68',2.1);line('M104 69 l-9 16 M106 69 l8 15',2);
 }
 const bottom=i===3?'M58 104 Q104 112 151 104 L147 124 Q124 131 113 154 Q105 166 96 154 Q84 134 62 126 Z':'M51 109 Q100 125 158 108 Q139 122 119 148 Q111 161 102 158 Q81 129 51 109 Z';
 fabric(bottom);line(i===3?'M59 111 Q102 119 150 110':'M53 111 Q107 128 155 110',1,'#fff8');
 if(i!==3){line('M55 111 Q45 105 39 104 Q38 112 53 113 Q41 116 36 124 M154 111 Q169 100 172 104 Q171 110 157 113 Q169 117 174 125',1.7)}
 ctx.restore()
}
const cards=$('cards');looks.forEach((l,i)=>{
 const b=document.createElement('button');b.className='card';b.innerHTML='<div class="sample"><small>0'+(i+1)+'</small><canvas width="420" height="356"></canvas><i class="dot"></i></div><div class="cardText"><div><strong>'+l.name+'</strong><b>'+l.place+'</b></div><em>'+l.en+'</em></div>';b.querySelector('.sample').style.backgroundColor=l.bg;b.querySelector('.dot').style.background=l.color;b.setAttribute('aria-label','选择'+l.name+'，预览'+l.place);b.onclick=()=>{choose(i);if(innerWidth<600)$('heroPhoto').scrollIntoView({behavior:reducedMotion?'instant':'smooth',block:'center'})};cards.append(b);drawSuit(b.querySelector('canvas'),i);
 for (const select of [$('look'), $('bookLook')]) select.add(new Option(l.name+' · '+l.place,i));
});
function choose(i){current=i;const l=looks[i];$('heroImg').src=l.file+'.jpg';$('heroImg').alt='想象中的'+l.place;$('enTitle').textContent=l.en;$('hLabel').textContent=l.name+' / Look 0'+(i+1);$('heroNum').textContent='0'+(i+1)+' / 04';$('enter').innerHTML=l.cta+' <b>↗</b>';$('heroPhoto').setAttribute('aria-label','进入'+l.place);drawSuit($('bigSuit'),i);[...cards.children].forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)))}
choose(0);
const scene=$('scene'),bg=scene.querySelector('.sceneBg');
function renderScene(){const l=looks[current];bg.style.backgroundImage='url('+l.file+'.jpg)';bg.style.transform='none';$('sceneKicker').textContent='想象手记　/　LOOK 0'+(current+1);$('sceneTitle').textContent=l.place;$('sceneText').textContent=l.text}
const video = $('livingScene');
let motionWanted = !reducedMotion;
let motionRequest = 0;

function updateMotion() {
 const request = ++motionRequest;
 video.pause();
 video.hidden = true;
 const button = $('motion');
 button.textContent = '播放动态';
 button.setAttribute('aria-pressed', 'false');
 if (!motionWanted || !scene.open) return;
 const source = looks[current].file + '.mp4';
 if (video.getAttribute('src') !== source) video.src = source;
 video.muted = true;
 video.play().then(() => {
  if (request !== motionRequest) return;
  video.hidden = false;
  button.textContent = '暂停动态';
  button.setAttribute('aria-pressed', 'true');
 }).catch(() => {
  if (request === motionRequest) motionWanted = false;
 });
}
$('motion').onclick = () => { motionWanted = !motionWanted; updateMotion(); };
function openScene(){scene.showModal();renderScene();updateMotion()}
for(const id of ['enter','heroPhoto','swatch'])$(id).onclick=openScene;
$('back').onclick=()=>scene.close();$('next').onclick=()=>{choose((current+1)%looks.length);renderScene();updateMotion()};
function pan(e){if(reducedMotion)return;bg.style.transform='translate('+(0.5-e.clientX/innerWidth)*4+'%,'+(0.5-e.clientY/innerHeight)*4+'%)'}
scene.onpointermove=pan;scene.addEventListener('touchmove',e=>pan(e.touches[0]),{passive:true});
function quiet(){if(audioContext){audioContext.close().catch(()=>{});audioContext=null}$('sound').textContent='开启环境音 ♪';$('sound').setAttribute('aria-pressed','false')}
$('sound').onclick=async()=>{if(audioContext){quiet();return}try{const ac=new (window.AudioContext||window.webkitAudioContext)();audioContext=ac;await ac.resume();if(audioContext!==ac)return;const buf=ac.createBuffer(1,ac.sampleRate*4,ac.sampleRate),data=buf.getChannelData(0);let last=0;for(let j=0;j<data.length;j++){last=(last+(Math.random()*2-1)*.025)/1.02;data[j]=last*5}const source=ac.createBufferSource(),gain=ac.createGain(),filter=ac.createBiquadFilter(),wave=ac.createOscillator(),depth=ac.createGain();source.buffer=buf;source.loop=true;filter.frequency.value=1200;gain.gain.value=.28;wave.frequency.value=.12;depth.gain.value=.17;wave.connect(depth).connect(gain.gain);source.connect(filter).connect(gain).connect(ac.destination);wave.start();source.start();$('sound').textContent='关闭环境音 ♪';$('sound').setAttribute('aria-pressed','true')}catch{quiet();$('sound').textContent='环境音暂不可用'}};
scene.onclose=()=>{quiet();updateMotion()};
function tab(isJournal){$('journal').hidden=!isJournal;$('wardrobe').hidden=isJournal;$('notesTab').classList.toggle('on',isJournal);$('homeTab').classList.toggle('on',!isJournal);if(isJournal){$('bookLook').value=String(current);showEntries();}window.scrollTo(0,0)}
$('notesTab').onclick=()=>tab(true);$('homeTab').onclick=()=>tab(false);document.querySelector('.brand').onclick=()=>tab(false);
const phaseTitles = {before:'出发前的想象', after:'抵达后的回忆'};
function updatePrompt() {
 const before = $('phase').value === 'before';
 $('noteLabel').textContent = before ? '此刻的想象' : '那天的体感';
 $('note').placeholder = before ? '穿着它，我想象自己……' : '照片里看不见的是……';
}
function openEditor(phase) {
 $('memoryForm').reset();
 $('status').textContent = '';
 $('look').value = String(current);
 $('phase').value = phase;
 $('filePreview').hidden = true;
 updatePrompt();
 $('editor').showModal();
}
$('bookLook').onchange = () => { choose(Number($('bookLook').value)); showEntries(); };
$('phase').onchange = updatePrompt;
$('record').onclick = () => { scene.close(); openEditor('before'); };
$('cancel').onclick = () => $('editor').close();
$('photo').onchange=()=>{if(previewURL)URL.revokeObjectURL(previewURL);const f=$('photo').files[0];previewURL=f?URL.createObjectURL(f):'';$('filePreview').hidden=!f;if(f)$('filePreview').src=previewURL};
$('editor').onclose=()=>{if(previewURL){URL.revokeObjectURL(previewURL);previewURL=''}};
function db(){if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{const req=indexedDB.open('ruby-island-memories',1);req.onupgradeneeded=()=>req.result.createObjectStore('notes',{keyPath:'id',autoIncrement:true});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)}).catch(e=>{dbPromise=null;throw e});return dbPromise}
async function transact(mode,action){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('notes',mode),req=action(t.objectStore('notes'));t.oncomplete=()=>resolve(req.result);t.onabort=t.onerror=()=>reject(t.error)})}
const memoryForm=$('memoryForm');memoryForm.onsubmit=async e=>{e.preventDefault();const note=$('note').value.trim(),image=$('photo').files[0],btn=memoryForm.querySelector('[type=submit]');if(!note&&!image){$('status').textContent='写一句话，或选择一张照片，就可以保存。';return}if(image&&!image.type.startsWith('image/')){$('status').textContent='请选择图片文件。';return}btn.disabled=true;try{await transact('readwrite',s=>s.add({note,image,phase:$('phase').value,look:Number($('look').value),date:Date.now()}));choose(Number($('look').value));$('editor').close();tab(true)}catch{$('status').textContent='保存失败，请检查浏览器存储空间后重试。'}finally{btn.disabled=false}};
let urls = [], sequence = 0;
function el(tag, text, className) {
 const node = document.createElement(tag);
 if (text) node.textContent = text;
 if (className) node.className = className;
 return node;
}
function renderEntry(note) {
 const card = el('article', '', 'entry');
 if (note.image) {
  const photo = new Image();
  photo.alt = '我为这篇手记收藏的照片';
  photo.src = URL.createObjectURL(note.image);
  urls.push(photo.src);
  card.append(photo);
 }
 card.append(el('small', new Date(note.date).toLocaleDateString('zh-CN')));
 if (note.note) card.append(el('p', note.note));
 const remove = el('button', '删除手记');
 remove.onclick = async () => {
  if (!confirm('删除这篇手记和附带的照片？')) return;
  try { await transact('readwrite', store => store.delete(note.id)); showEntries(); }
  catch { alert('删除失败，请重试。'); }
 };
 card.append(remove);
 return card;
}
function journalPage(phase, notes) {
 const page = el('section', '', 'bookPage ' + phase);
 page.append(el('h2', phaseTitles[phase] || '以前的手记'));
 if (phaseTitles[phase]) {
  const add = el('button', phase === 'before' ? '写下想象 ＋' : '收藏回忆 ＋', 'pageAction');
  add.onclick = () => openEditor(phase);
  page.append(add);
  if (!notes.length) page.append(el('p', phase === 'before' ? '穿上这套衣服时，你想象自己在哪里？' : '等抵达，再把这身穿搭的真实照片放进来。', 'pageHint'));
 }
 for (const note of notes) page.append(renderEntry(note));
 return page;
}
async function showEntries() {
 const request = ++sequence;
 const holder = $('entries');
 try {
  const records = await transact('readonly', store => store.getAll());
  if (request !== sequence) return;
  const notes = records.filter(note => note.look === current).reverse();
  urls.forEach(url => URL.revokeObjectURL(url));
  urls = [];
  holder.replaceChildren(...Object.keys(phaseTitles).map(phase =>
   journalPage(phase, notes.filter(note => note.phase === phase))));
  const earlier = notes.filter(note => !Object.hasOwn(phaseTitles, note.phase));
  if (earlier.length) holder.append(journalPage('legacy', earlier));
 } catch {
  if (request === sequence) holder.textContent = '无法读取当前浏览器的手记，请检查存储权限。';
 }
}
