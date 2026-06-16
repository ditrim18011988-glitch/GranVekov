const tracks = [
  { title:"Чёрная лампа", file:"music/track1.mp3", cover:"music/cover1.jpg" },
  { title:"Всадники Ада", file:"music/track2.mp3", cover:"music/cover2.jpg" },
  { title:"Чёрное рождество", file:"music/track3.mp3", cover:"music/cover3.png" }
];

let current = -1;
let cards = [];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const list = document.getElementById("list");
const search = document.getElementById("search");

/* ===== SAFE PLAY ===== */
function safePlay(){
  const p = audio.play();
  if(p && p.catch) p.catch(()=>{});
}

/* ===== SET ACTIVE ===== */
function setActive(i){
  cards.forEach(c => c.classList.remove("active"));
  if(cards[i]) cards[i].classList.add("active");
}

/* ===== SYNC UI ===== */
function syncUI(){
  playBtn.textContent = audio.paused ? "▶️" : "⏸";

  cards.forEach((c,i)=>{
    const btn = c.querySelector("button");
    if(!btn) return;

    if(i === current){
      btn.textContent = audio.paused ? "▶ Play" : "⏸ Pause";
    } else {
      btn.textContent = "▶ Play";
    }
  });

  setActive(current);
}

/* ===== LOAD TRACK (ТОЛЬКО ЗАГРУЗКА) ===== */
function load(i){
  current = i;

  audio.src = tracks[i].file;
  title.textContent = tracks[i].title;
  cover.src = tracks[i].cover;

  safePlay();
  syncUI();
}

/* ===== CLICK CARD BUTTON ===== */
function toggleCard(i){

  // если тот же трек — просто пауза/плей
  if(i === current){
    if(audio.paused) safePlay();
    else audio.pause();

    syncUI();
    return;
  }

  // если другой трек — загружаем новый
  load(i);
}

/* ===== PLAYER BUTTON ===== */
function toggle(){
  if(audio.paused) safePlay();
  else audio.pause();
  syncUI();
}

/* ===== NEXT / PREV ===== */
function next(){ load((current+1)%tracks.length); }
function prev(){ load((current-1+tracks.length)%tracks.length); }

/* ===== EVENTS ===== */
audio.addEventListener("play", syncUI);
audio.addEventListener("pause", syncUI);
audio.addEventListener("ended", next);

/* ===== PROGRESS ===== */
audio.ontimeupdate = () => {
  if(audio.duration){
    progress.value = (audio.currentTime/audio.duration)*100;
  }
};

progress.oninput = () => {
  if(audio.duration){
    audio.currentTime = (progress.value/100)*audio.duration;
  }
};

/* ===== CARDS ===== */
tracks.forEach((t,i)=>{
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${t.cover}">
    <h3>${t.title}</h3>
    <button onclick="toggleCard(${i})">▶ Play</button>

    <div class="downloadBtn" onclick="downloadTrack(${i})">
      <div class="fill"></div>
      <span>⬇ Скачать</span>
    </div>
  `;

  list.appendChild(div);
  cards.push(div);
});

/* ===== DOWNLOAD (НЕ ТРОГАЕМ) ===== */
function downloadTrack(i){
  const t = tracks[i];
  const btn = cards[i].querySelector(".downloadBtn");
  const fill = btn.querySelector(".fill");
  const text = btn.querySelector("span");

  fetch(t.file)
    .then(r => r.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = t.title + ".mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      fill.style.width = "100%";
      text.textContent = "✔ Готово";

      setTimeout(()=>{
        fill.style.width = "0%";
        text.textContent = "⬇ Скачать";
      },800);
    });
}

/* ===== SEARCH ===== */
search.oninput = () => {
  const v = search.value.toLowerCase();
  cards.forEach((c,i)=>{
    c.style.display = tracks[i].title.toLowerCase().includes(v) ? "block":"none";
  });
};
