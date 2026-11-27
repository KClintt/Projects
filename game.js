'use strict';
const demo = new URLSearchParams(location.search).get('demo') === '1';
const requiredPhotos = demo ? 1 : 3;
const game = document.querySelector('#game');
const reset = document.querySelector('#reset');
const sound = document.querySelector('#sound');
const motion = document.querySelector('#motion');
const restart = document.querySelector('#restart');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = preference.matches;
let muted = true;
let audio, ambient, master;
let chapter, introLine, photos, present, selected, age, viewed, readingAge, aim, notice, choice;
const width = 720, height = 400, frameWidth = 246, frameHeight = 164;
const world = document.createElement('canvas');
world.width = width;
world.height = height;
const rooms = createRoomArt(world.getContext('2d'));
let display;
let pointerGoal = null;
let lastPaint = 0;
let lastRoomPaint = -Infinity;
const moments = [
  {name:'Dinner table', x:143, y:235, captions:{9:'Why we always gotta take pictures?',17:'We used to do this a lot.',25:"I didn't know how much I'd miss this."}},
  {name:'Funny face', x:356, y:275, captions:{9:"Bro can't ever be serious.",17:'They were always doing something.',25:'I wonder when we stopped acting like this.'}},
  {name:'Kitchen laughter', x:579, y:121, captions:{9:'They always laughing at something.',17:'I remember that laugh.',25:'I wish I could hear everybody together again.'}},
  {name:'Group picture', x:446, y:128, captions:{9:"This one isn't even good.",17:"This one's kinda funny.",25:'Funny how this one means more than the perfect ones.'}},
  {name:'Empty chair', x:619, y:281, captions:{9:"It's literally just a chair.",17:'Somebody was probably late.',25:'I wonder why I even took this picture.'}}
];
const interpretations = [
  ['The memories attached to it','The picture is quiet. The room you remember still has sound.'],
  ["The person I've become",'At nine, you were already thinking about going outside. Today, you stayed with the picture.'],
  ['The beauty was always there','Maybe the light was doing something that afternoon and nobody happened to look.']
];
const opening = ['“Come on, everybody. One more picture!”','“Bruh, didn’t we just take one?”','“Just one more.”'];
const clamp = (n,min,max) => Math.max(min,Math.min(n,max));
function begin() {
  photos = []; present = null; introLine = 0; choice = null;
  go('title',9);
}
function go(next,nextAge=age) {
  chapter = next; age = nextAge; readingAge = age; selected = 0;
  viewed = new Set(); notice = ''; pointerGoal = null; aim = {x:143,y:235}; render();
  (game.querySelector('h1,h2') || game).focus({preventScroll:true});
  window.scrollTo(0,0);
}
function btn(id,label,css='') {return `<button id="${id}" class="${css}">${label}</button>`;}
function heading(label,title) {return `<div class="eyebrow">${label}</div><h2 tabindex="-1">${title}</h2>`;}
function scene(camera=false) {
  return `<div class="scene"><canvas width="720" height="400" class="${camera?'camera':''}" ${camera?'tabindex="0" aria-label="Camera viewfinder. Aim with arrow keys. Press Space to take a picture."':'role="img" aria-label="Illustrated room."'}></canvas></div>`;
}
function photo(p, caption, position, total) {
  return `
    <figure class="photo playback-display">
      <div class="playback-status">
        <span><span aria-hidden="true">▶</span> Playback</span>
        <span aria-label="Photo ${position} of ${total}">${position} / ${total}</span>
      </div>
      <img width="246" height="164" src="${p.src}" alt="${p.name} as framed by you">
      <figcaption>“${caption}”</figcaption>
    </figure>`;
}
function film(list,active=-1) {
  return `<div class="film" aria-label="Album photos">${list.map((p,i)=>`<button data-photo="${i}" class="${i===active?'on ':''}${viewed.has(i)&&chapter==='album'?'seen':''}" aria-label="Photo ${i+1}, ${p.name}${viewed.has(i)&&chapter==='album'?', viewed':''}" aria-pressed="${i===active}"><img alt="" src="${p.src}"></button>`).join('')}</div>`;
}
function capturedMoments() {
  return new Set(photos.filter(p => p.id >= 0).map(p => p.id)).size;
}
function openAlbum() {go('album'); viewed.add(0); render(); document.querySelector('[data-photo="0"]').focus();}
function render(focusId) {
  const filmScroll = focusId ? game.querySelector('.film')?.scrollTop : 0;
  document.body.dataset.age = age;
  document.body.dataset.chapter = chapter;
  restart.hidden = chapter === 'title';
  switch(chapter) {
    case 'title':
      game.innerHTML = `
        <section class="title-page">
          ${scene()}
          <h1 tabindex="-1">The Picture Never Changed</h1>
          <p class="muted">${demo ? 'Short demo · About 1 minute' : 'A short game about looking back at family photos'}</p>
          <div class="actions">
            ${btn('start', demo ? 'Play demo' : 'Start game', 'primary')}
            <a class="download" href="${demo ? './index.html' : './demo.html'}">${demo ? 'Full game' : 'Short demo'}</a>
          </div>
        </section>`;
      break;
    case 'opening':
      game.innerHTML = `<div class="layout">${scene()}<section>${heading('Age 9','One more picture')}<div class="dialogue" aria-live="polite"><div class="eyebrow">${introLine===1?'You':'From the living room'}</div><p class="quote">${opening[introLine]}</p></div>${btn('next',introLine===2?'Take the camera':'Continue','primary')}</section></div>`;
      break;
    case 'camera':
    case 'present': {
      const here = chapter==='present';
      game.innerHTML = `
        <div class="camera-stage">
          ${scene(true)}
          <section class="camera-controls" aria-label="Camera controls">
            <div class="camera-heading">
              ${heading(here?'Age 25 · The present':'Age 9',here?'One more':'Just another day')}
            </div>
            <div class="actions">
              ${btn('shoot','Take picture','primary')}
              ${!here && capturedMoments() >= requiredPhotos ? btn('leave','Go play outside') : ''}
            </div>
            <p class="muted strip camera-instructions">
              ${here ? 'There’s still a moment happening right now.' : `Family moments found: ${capturedMoments()} · ${requiredPhotos} needed. Photograph anything in the room.`}
            </p>
            ${here ? '' : `<div class="moments strip">
              ${moments.map((m,i) => `<button data-moment="${i}">${m.name}${photos.some(p => p.id === i) ? ' ✓' : ''}</button>`).join('')}
            </div>`}
            <p class="muted strip camera-instructions">Mouse to aim and click. Touch to frame. Arrow keys to aim, Space to shoot.</p>
            ${here ? '' : film(photos)}
            <p id="notice" class="note" role="status">${notice}</p>
          </section>
        </div>`;
      break;
    }
    case 'interlude':
      game.innerHTML = `<section>${heading('Eight years pass','After the gathering')}<p class="quote">You never really thought about those pictures again.</p>${btn('teen','Continue','primary')}</section>`;
      break;
    case 'room':
      game.innerHTML = `<div class="layout">${scene()}<section>${heading(age===17?'Chapter 2 · Age 17':'Chapter 3 · Age 25',age===17?'Wait, I remember this':'Things change')}<p class="quote">${age===17?'You meant to clear a shelf for your school books. The old album was pushed right up against the wall.':'Rain taps the glass. You’re unpacking another box when something slips out from between two towels.'}</p>${btn('open','Open the album','primary')}</section></div>`;
      break;
    case 'album': {
      const p=photos[selected];
      const complete=viewed.size>=requiredPhotos;
      game.innerHTML = `<div class="layout playback">${photo(p,p.captions[readingAge],selected+1,photos.length)}<section>${heading('The album · Age '+age,p.name)}<div class="tabs" aria-label="Caption age">${[9,17,25].filter(y=>y<=age).map(y=>`<button data-age="${y}" class="${y===readingAge?'on':''}" aria-pressed="${y===readingAge}">Age ${y}</button>`).join('')}</div>${film(photos,selected)}<p class="muted" role="status">${complete?(age===17?'“I don’t remember when things started feeling different.”':'You leave the album open. A car goes by, then the room is quiet again.'):`Look through three photographs · ${viewed.size} of ${requiredPhotos}`}</p>${complete?btn('next-age',age===17?'Eight years later':'Sit with the first picture','primary'):''}</section></div>`;
      break;
    }
    case 'reflection':
      game.innerHTML = `<div class="layout playback">${photo(photos[0],photos[0].captions[readingAge],1,photos.length)}<section>${heading('The first photograph','The picture never changed.')}<p class="quote">But you did.</p><div class="tabs" aria-label="Caption age">${[9,17,25].map(y=>`<button data-age="${y}" class="${y===readingAge?'on':''}" aria-pressed="${y===readingAge}">Age ${y}</button>`).join('')}</div><p>So where did the beauty come from?</p><div class="choices">${interpretations.map(([label],i)=>`<button data-choice="${i}" class="${i===choice?'on':''}" aria-pressed="${i===choice}">${label}</button>`).join('')}</div>${choice===null?'':`<p role="status" class="quote">${interpretations[choice][1]}</p>${btn('present','Pick up the camera','primary')}`}</section></div>`;
      break;
    case 'ending': {
      const all=[...photos,present],p=all[selected];
      game.innerHTML = `<div class="layout playback">${photo(p,p.captions[25],selected+1,all.length)}<section>${heading('The album · The present','The Picture Never Changed')}<p class="quote">Maybe we don’t always know what we’re capturing.</p>${film(all,selected)}<div class="actions"><a class="download" href="${p.src}" download="picture-${selected+1}.png">Save this photo</a>${btn('replay','Play again')}${demo?'<a class="download" href="./index.html">Play the full game</a>':''}</div><p class="muted strip">Made for a english project</p></section></div>`;
      break;
    }
  }
  display = game.querySelector('canvas');
  if (display && display.classList.contains('camera')) bindCamera(display);
  if (display) draw(performance.now(), true);
  const photoList = game.querySelector('.film');
  if (photoList && filmScroll) photoList.scrollTop = filmScroll;
  if (focusId) game.querySelector(focusId)?.focus({preventScroll:true});
}
function clampAim(x, y) {
  return {
    x: clamp(x, frameWidth / 2, width - frameWidth / 2),
    y: clamp(y, frameHeight / 2, height - frameHeight / 2)
  };
}
function aimAt(x,y) {
  pointerGoal = null;
  const target = clampAim(x, y);
  aim = {x: Math.round(target.x), y: Math.round(target.y)};
  draw(performance.now());
}
function subject() {
  const ranked=moments.map((m,id)=>({id,d:Math.hypot((m.x-aim.x)/94,(m.y-aim.y)/67)})).sort((a,b)=>a.d-b.d);
  return ranked[0].d<=1.15?ranked[0].id:-1;
}
function bindCamera(canvas) {
  function point(e) {
    const bounds = canvas.getBoundingClientRect();
    return clampAim((e.clientX - bounds.left) * width / bounds.width,
                    (e.clientY - bounds.top) * height / bounds.height);
  }
  canvas.addEventListener('pointerdown', e => {
    const target = point(e);
    if (e.pointerType !== 'mouse' || reduced) aimAt(target.x, target.y);
    canvas.focus({preventScroll:true});
  });
  canvas.addEventListener('pointermove', e => {
    const target = point(e);
    if (e.pointerType === 'mouse' && !reduced) pointerGoal = target;
    else if (e.pointerType === 'mouse' || e.buttons) aimAt(target.x, target.y);
  });
  canvas.addEventListener('click',e=>{if(e.pointerType==='mouse')shoot(true);});
  canvas.addEventListener('keydown',e=>{
    const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
    if(directions[e.key]) {
      e.preventDefault();const [x,y]=directions[e.key],step=e.shiftKey?4:16;
      aimAt(aim.x+x*step,aim.y+y*step);
    } else if(e.key===' '||e.key==='Enter') {e.preventDefault();if(!e.repeat)shoot(true);}
  });
}
function shoot(fromCanvas=false) {
  const here=chapter==='present';
  const id=here?-1:subject();
  // Crop the room before the viewfinder overlay is drawn.
  pointerGoal = null;
  const snapshot=document.createElement('canvas');
  snapshot.width=frameWidth; snapshot.height=frameHeight;
  snapshot.getContext('2d').drawImage(world,Math.round(aim.x)-frameWidth/2,Math.round(aim.y)-frameHeight/2,frameWidth,frameHeight,0,0,frameWidth,frameHeight);
  const src=snapshot.toDataURL('image/png');
  shutter();
  if(here) {
    present={name:'One more',src,captions:{25:'I wonder what this will mean to me later.'}};
    go('ending');selected=photos.length;render('h2');return;
  }
  const m=moments[id] ?? {
    name:'Around the room',
    captions:{9:'I just wanted to see what it looked like.',17:'I forgot what that corner looked like.',25:'I don’t remember why I pointed the camera there.'}
  };
  photos.push({id,name:m.name,captions:m.captions,src});
  notice=`“${m.captions[9]}”`;
  render(fromCanvas?'canvas':'#shoot');
  const photoList = game.querySelector('.film');
  photoList.scrollLeft = photoList.scrollWidth;
  if(!reduced) document.querySelector('.scene').classList.add('flash');
}
game.addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(!b)return;
  if(b.dataset.moment!==undefined) {
    const m=moments[Number(b.dataset.moment)];
    aimAt(m.x,m.y); display.focus(); return;
  }
  if(b.dataset.photo!==undefined) {
    const i=Number(b.dataset.photo);
    if(chapter==='camera') {
      notice=`“${photos[i].captions[9]}”`;
      document.querySelector('#notice').textContent=notice;
    } else {
      selected=i;viewed.add(i);render(`[data-photo="${i}"]`);
    }
    return;
  }
  if(b.dataset.age) {readingAge=Number(b.dataset.age);render(`[data-age="${readingAge}"]`);return;}
  if(b.dataset.choice!==undefined) {choice=Number(b.dataset.choice);render(`[data-choice="${choice}"]`);return;}
  switch(b.id) {
    case 'start':go(demo?'camera':'opening');break;
    case 'next':if(++introLine===opening.length)go('camera');else render('#next');break;
    case 'shoot':shoot();break;
    case 'leave':go(demo?'room':'interlude',17);break;
    case 'teen':go('room',17);break;
    case 'open':openAlbum();break;
    case 'next-age':if(age===17)go('room',25);else go('reflection');break;
    case 'present':go('present');aimAt(430,225);break;
    case 'replay':restart.click();break;
  }
});
restart.onclick=()=>{reset.returnValue='cancel';reset.showModal();};
reset.addEventListener('close',()=>{if(reset.returnValue==='restart')begin();});
motion.onclick=()=>{reduced=!reduced;syncMotion();draw(performance.now(), true);};
function syncMotion(){motion.textContent=reduced?'Motion reduced':'Motion full';motion.setAttribute('aria-pressed',String(reduced));}
preference.addEventListener('change',e=>{reduced=e.matches;syncMotion();draw(performance.now(), true);});
sound.onclick=async()=>{
  if(!audio){
    const Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return;
    audio=new Context();
    master=audio.createGain();master.gain.value=0;master.connect(audio.destination);
    const buffer=audio.createBuffer(1,audio.sampleRate*3,audio.sampleRate);
    const data=buffer.getChannelData(0);
    let last=0;
    for(let i=0;i<data.length;i++){last=(last+Math.random()*.045-.0225)/1.035;data[i]=last;}
    ambient=audio.createBufferSource();ambient.buffer=buffer;ambient.loop=true;ambient.connect(master);ambient.start();
  }
  await audio.resume();
  muted=!muted;master.gain.setTargetAtTime(muted?0:.38,audio.currentTime,.1);
  sound.textContent=muted?'Sound off':'Sound on';sound.setAttribute('aria-pressed',String(!muted));
};
function shutter() {
  if(muted||!audio)return;
  const tone=audio.createOscillator(),gain=audio.createGain(),now=audio.currentTime;
  tone.type='triangle';tone.frequency.setValueAtTime(220,now);tone.frequency.exponentialRampToValueAtTime(55,now+.08);
  gain.gain.setValueAtTime(.075,now);gain.gain.exponentialRampToValueAtTime(.001,now+.09);
  tone.connect(gain);gain.connect(master);tone.start(now);tone.stop(now+.1);
}

function draw(now, refreshRoom = false) {
  if (!display) return;
  // Keep the viewfinder responsive without redrawing every paper layer on every frame.
  if (refreshRoom || (!reduced && now - lastRoomPaint >= 30)) {
    const t = reduced ? 1 : now / 1000;
    if (age === 9) rooms.childhood(t);
    else rooms.later(t, age === 25, chapter === 'room');
    lastRoomPaint = now;
  }
  const context=display.getContext('2d');
  context.drawImage(world,0,0);
  if(!display.classList.contains('camera'))return;
  const x=Math.round(aim.x)-frameWidth/2,y=Math.round(aim.y)-frameHeight/2,r=x+frameWidth,b=y+frameHeight;
  context.fillStyle='#1a142b62';
  context.fillRect(0,0,width,y);context.fillRect(0,b,width,height-b);
  context.fillRect(0,y,x,frameHeight);context.fillRect(r,y,width-r,frameHeight);
  context.strokeStyle='#fef0ce85';context.lineWidth=1;context.strokeRect(x+.5,y+.5,frameWidth-1,frameHeight-1);
  context.strokeStyle='#fff0ce';context.lineWidth=3;context.beginPath();
  for(const [cx,cy,dx,dy] of [[x,y,1,1],[r,y,-1,1],[x,b,1,-1],[r,b,-1,-1]]){
    context.moveTo(cx,cy+dy*15);context.lineTo(cx,cy);context.lineTo(cx+dx*15,cy);
  }
  context.stroke();
  context.fillStyle='#fff0ceaa';context.fillRect(aim.x-5,aim.y,11,1);context.fillRect(aim.x,aim.y-5,1,11);
}
function loop(now) {
  requestAnimationFrame(loop);
  if (now - lastPaint < 15) return;
  if (!display || (!pointerGoal && (reduced || now - lastRoomPaint < 30))) return;
  if (pointerGoal) {
    const blend = reduced ? 1 : 1 - Math.exp(-Math.min(now - lastPaint, 24) / 30);
    aim.x += (pointerGoal.x - aim.x) * blend;
    aim.y += (pointerGoal.y - aim.y) * blend;
    if (Math.hypot(pointerGoal.x - aim.x, pointerGoal.y - aim.y) < .5) {
      aim = {x: Math.round(pointerGoal.x), y: Math.round(pointerGoal.y)};
      pointerGoal = null;
    }
  }
  draw(now);
  lastPaint = now;
}
syncMotion();begin();requestAnimationFrame(loop);
