const state={
 completed:new Set(JSON.parse(localStorage.getItem('completed')||'[]')),
 videoDone:new Set(JSON.parse(localStorage.getItem('videoDone')||'[]')),
 favorites:new Set(JSON.parse(localStorage.getItem('favorites')||'[]')),
 track:null,lesson:null,video:null,book:null,vfilter:'all'
};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const allLessons=()=>COURSE.tracks.flatMap(t=>t.lessons.map(l=>({...l,trackId:t.id,trackTitle:t.title})));
const lessonById=id=>allLessons().find(l=>l.id===id);
const videoByLesson=id=>VIDEOS.find(v=>v.lesson===id);
function save(){localStorage.setItem('completed',JSON.stringify([...state.completed]));localStorage.setItem('videoDone',JSON.stringify([...state.videoDone]));localStorage.setItem('favorites',JSON.stringify([...state.favorites]));renderHome();}
function go(id){
 const v=$('#lessonVideo'); if(v && id!=='videoPlayer') v.pause();
 $$('.page').forEach(p=>p.classList.remove('active')); const page=$('#'+id); if(page) page.classList.add('active');
 $$('.navItem').forEach(b=>b.classList.toggle('active',b.dataset.go===id));
 if(id==='home')renderHome(); if(id==='videos')renderVideos(); if(id==='tracks')renderTracks(); if(id==='books')renderBooks(); if(id==='progress')renderProgress();
 window.scrollTo({top:0,behavior:'smooth'});
}
function overall(){const total=allLessons().length+VIDEOS.length;const done=state.completed.size+state.videoDone.size;return {total,done,pct:total?Math.round(done/total*100):0};}
function renderHome(){
 const p=overall(); $('#overallProgress').style.width=p.pct+'%'; $('#overallText').textContent=`${p.pct}% concluído • ${p.done}/${p.total} atividades`;
 $('#lessonCount').textContent=allLessons().length; $('#videoCount').textContent=VIDEOS.length; $('#bookCount').textContent=BOOKS.length;
 $('#trackCards').innerHTML=COURSE.tracks.map(t=>{const d=t.lessons.filter(l=>state.completed.has(l.id)).length;return `<div class="card trackCard" data-track="${t.id}"><div><div class="trackIcon">${t.icon}</div><h3>${t.title}</h3><p class="muted">${t.subtitle}</p></div><div class="count">${d}/${t.lessons.length} aulas concluídas</div></div>`}).join('');
 $$('#trackCards [data-track]').forEach(el=>el.onclick=()=>openTrack(el.dataset.track));
 $('#homeBooks').innerHTML=BOOKS.map(b=>`<div class="card homeBook" data-book="${b.id}"><div class="bookCover" style="background:${b.color}">${b.icon} ${b.title}</div><p class="muted">${b.sections.length} capítulos</p></div>`).join('');
 $$('#homeBooks [data-book]').forEach(el=>el.onclick=()=>openBook(el.dataset.book));
 $('#tipCard').textContent=COURSE.tips[Math.floor(Date.now()/86400000)%COURSE.tips.length];
 const last=localStorage.getItem('lastLesson'); $('#continueBtn').onclick=()=> last?openLesson(last):openVideo('v02_ft_me_se');
 bindDynamicButtons();
}
function renderVideos(){
 $$('.chip[data-vfilter]').forEach(c=>c.classList.toggle('active',c.dataset.vfilter===state.vfilter));
 const list=VIDEOS.filter(v=>state.vfilter==='all'||v.category===state.vfilter);
 $('#videoList').innerHTML=list.map(v=>`<div class="card videoCard" data-video="${v.id}"><div class="videoThumb"><div class="playCircle">▶</div><div><span class="pill">${v.category}</span> ${state.videoDone.has(v.id)?'<span class="pill">✓ Visto</span>':''}<br><b>${v.title}</b></div></div><div class="videoMeta"><p class="muted">${v.duration} • offline</p><h3>${v.description}</h3></div></div>`).join('');
 $$('#videoList [data-video]').forEach(el=>el.onclick=()=>openVideo(el.dataset.video));
}
function openVideo(id){
 const v=VIDEOS.find(x=>x.id===id); if(!v)return; state.video=v;
 $('#videoCategory').textContent=v.category+' • VIDEOAULA'; $('#videoTitle').textContent=v.title;
 const el=$('#lessonVideo'); el.pause(); el.src=v.file; el.load();
 $('#videoDescription').innerHTML=`<h3>O que você vai aprender</h3><p>${v.description}</p><p class="muted">Duração: ${v.duration} • vídeo armazenado no aparelho</p>`;
 $('#videoDoneBtn').textContent=state.videoDone.has(v.id)?'✓ Vídeo assistido':'✓ Marcar vídeo como visto';
 $('#videoDoneBtn').onclick=()=>{state.videoDone.has(v.id)?state.videoDone.delete(v.id):state.videoDone.add(v.id);save();$('#videoDoneBtn').textContent=state.videoDone.has(v.id)?'✓ Vídeo assistido':'✓ Marcar vídeo como visto';};
 $('#videoLessonBtn').onclick=()=>openLesson(v.lesson);
 go('videoPlayer');
}
function renderTracks(){
 $('#trackList').innerHTML=COURSE.tracks.map(t=>`<div class="card listCard" data-track="${t.id}"><div class="number">${t.icon}</div><div><h4>${t.title}</h4><p>${t.subtitle} • ${t.lessons.length} aulas</p></div></div>`).join('');
 $$('#trackList [data-track]').forEach(el=>el.onclick=()=>openTrack(el.dataset.track));
}
function openTrack(id){state.track=COURSE.tracks.find(t=>t.id===id);if(!state.track)return;$('#lessonTrackTitle').textContent='TRILHA PRÁTICA';$('#lessonTrackName').textContent=state.track.title;renderLessons();go('lessons');}
function renderLessons(){if(!state.track)return;$('#lessonList').innerHTML=state.track.lessons.map((l,i)=>`<div class="card listCard ${state.completed.has(l.id)?'done':''}" data-lesson="${l.id}"><div class="number">${state.completed.has(l.id)?'✓':i+1}</div><div><h4>${l.title}</h4><p>${l.summary}</p><span class="pill">${l.time}</span>${videoByLesson(l.id)?'<span class="pill">🎬 vídeo</span>':''}${state.favorites.has(l.id)?'<span class="pill">★ favorito</span>':''}</div></div>`).join('');$$('#lessonList [data-lesson]').forEach(el=>el.onclick=()=>openLesson(el.dataset.lesson));}
function openLesson(id){
 const l=lessonById(id); if(!l)return; state.lesson=l; state.track=COURSE.tracks.find(t=>t.id===l.trackId); localStorage.setItem('lastLesson',id);
 $('#lessonEyebrow').textContent=l.trackTitle; $('#lessonTitle').textContent=l.title;
 const rv=videoByLesson(l.id); $('#relatedVideoSlot').innerHTML=rv?`<div class="card relatedVideo" data-video="${rv.id}"><div class="miniPlay">▶</div><div><b>Videoaula relacionada</b><div class="muted">${rv.title} • ${rv.duration}</div></div></div>`:'';
 if(rv) $('#relatedVideoSlot [data-video]').onclick=()=>openVideo(rv.id);
 $('#lessonBody').innerHTML=`<div class="lessonBlock callout"><h3>🎯 Objetivo</h3><p>${l.objective}</p></div><div class="lessonBlock"><h3>📌 Entenda fácil</h3><ul>${l.theory.map(x=>`<li>${x}</li>`).join('')}</ul></div>${l.code?`<div class="lessonBlock"><h3>🪜 Exemplo</h3><pre>${l.code}</pre></div>`:''}<div class="lessonBlock"><h3>👣 Faça comigo</h3><ol>${l.steps.map(x=>`<li>${x}</li>`).join('')}</ol></div><div class="lessonBlock callout warn"><h3>⚡ Dica de mantenedor</h3><p>${l.tip}</p></div><div class="lessonBlock"><h3>🔧 Exercício</h3><p>${l.exercise}</p></div><div class="lessonBlock callout"><h3>✅ Confira se entendeu</h3><p>${l.quiz}</p></div>`;
 $('#noteBox').value=localStorage.getItem('note:'+l.id)||''; $('#noteStatus').textContent='A anotação fica salva neste aparelho.'; updateLessonButtons(); go('lesson');
}
function updateLessonButtons(){if(!state.lesson)return;$('#completeBtn').textContent=state.completed.has(state.lesson.id)?'✓ Aula concluída':'✓ Marcar como concluída';$('#favoriteBtn').textContent=state.favorites.has(state.lesson.id)?'★ Favorita':'☆ Favoritar';}
function renderBooks(){
 $('#bookList').innerHTML=BOOKS.map(b=>`<div class="card bookCard" data-book="${b.id}"><div class="bookCover" style="background:${b.color}">${b.icon} ${b.title}</div><div class="bookInfo"><h3>${b.title}</h3><p class="muted">${b.subtitle}</p><span class="pill">${b.sections.length} capítulos</span><span class="pill">offline</span></div></div>`).join('');
 $$('#bookList [data-book]').forEach(el=>el.onclick=()=>openBook(el.dataset.book));
}
function openBook(id){
 const b=BOOKS.find(x=>x.id===id); if(!b)return; state.book=b; $('#bookEyebrow').textContent='APOSTILA • '+b.sections.length+' CAPÍTULOS'; $('#bookTitle').textContent=b.title;
 $('#bookToc').innerHTML=`<h3>Sumário</h3>${b.sections.map((s,i)=>`<button class="tocBtn" data-sec="${i}">${s.title}</button>`).join('')}`;
 $('#bookBody').innerHTML=b.sections.map((s,i)=>`<section class="bookSection" id="booksec-${i}"><div class="sectionNumber">CAPÍTULO ${String(i+1).padStart(2,'0')}</div><h3>${s.title}</h3>${s.text.map(p=>`<p>${p}</p>`).join('')}${s.check&&s.check.length?`<h4>Checklist</h4><ul>${s.check.map(x=>`<li>${x}</li>`).join('')}</ul>`:''}<div class="fieldTip"><b>⚡ Dica de campo:</b> ${s.tip}</div></section>`).join('');
 $$('.tocBtn').forEach(btn=>btn.onclick=()=>$('#booksec-'+btn.dataset.sec).scrollIntoView({behavior:'smooth',block:'start'})); go('book');
}
function renderProgress(){
 const p=overall(); $('#progressStats').innerHTML=`<h3>${p.done}/${p.total} atividades concluídas</h3><div class="progressWrap"><div class="progressBar" style="width:${p.pct}%"></div></div><p class="muted">${p.pct}% do Mega Curso • ${state.completed.size} aulas e ${state.videoDone.size} vídeos.</p>`;
 const fav=allLessons().filter(l=>state.favorites.has(l.id)); $('#favoriteList').innerHTML=fav.length?fav.map(l=>`<div class="card listCard" data-open="${l.id}"><div class="number">★</div><div><h4>${l.title}</h4><p>${l.trackTitle}</p></div></div>`).join(''):'<div class="card muted">Nenhuma aula favoritada ainda.</div>';
 $$('#favoriteList [data-open]').forEach(el=>el.onclick=()=>openLesson(el.dataset.open));
 $('#quickList').innerHTML=COURSE.tips.slice(0,6).map((t,i)=>`<div class="card tip"><b>⚡ ${i+1}</b><p>${t}</p></div>`).join('');
}
function bindDynamicButtons(){
 $$('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
 $$('[data-trackjump]').forEach(b=>b.onclick=()=>openTrack(b.dataset.trackjump));
 $$('[data-video]').forEach(b=>{if(!b.closest('#videoList')&&!b.closest('#relatedVideoSlot'))b.onclick=()=>openVideo(b.dataset.video)});
}
$$('.navItem[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
$$('.chip[data-vfilter]').forEach(c=>c.onclick=()=>{state.vfilter=c.dataset.vfilter;renderVideos();});
$('#completeBtn').onclick=()=>{const id=state.lesson.id;state.completed.has(id)?state.completed.delete(id):state.completed.add(id);save();updateLessonButtons();renderLessons();};
$('#favoriteBtn').onclick=()=>{const id=state.lesson.id;state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);save();updateLessonButtons();renderLessons();};
$('#noteBox').addEventListener('input',e=>{if(!state.lesson)return;localStorage.setItem('note:'+state.lesson.id,e.target.value);$('#noteStatus').textContent='Salvo automaticamente.';});
$('#themeBtn').onclick=()=>{document.documentElement.classList.toggle('light');localStorage.setItem('theme',document.documentElement.classList.contains('light')?'light':'dark');}; if(localStorage.getItem('theme')==='light')document.documentElement.classList.add('light');
$('#fontBtn').onclick=()=>{document.documentElement.classList.toggle('largeText');localStorage.setItem('font',document.documentElement.classList.contains('largeText')?'large':'normal');}; if(localStorage.getItem('font')==='large')document.documentElement.classList.add('largeText');
renderHome();