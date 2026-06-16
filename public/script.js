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
const searchInput = document.getElementById("search");

/* ===== PLAY SAFE ===== */
function safePlay(){
  const p = audio.play();
  if(p && p.catch) p.catch(()=>{});
}

/* ===== SET TRACK (БЕЗ AUTO PLAY) ===== */
function setTrack(i){
  current = i;
  audio.src = tracks[i].file;
  title.textContent = tracks[i].title;
  cover.src = tracks[i].cover;
  setActiveTrack(i);
}

/* ===== LOAD + PLAY ===== */
function playTrack(i){
  if(i !== current){
    setTrack(i);
    safePlay();
  } else {
    // toggle
    if(audio.paused) safePlay();
    else audio.pause();
  }
  syncUI();
}

/* ===== ACTIVE ===== */
function setActiveTrack(i){
  cards.forEach(c => c.classList.remove("active"));
  if(cards[i]) cards[i].classList.add("active");
}

/* ===== PLAYER BUTTON ===== */
function toggle(){
  if(audio.paused) safePlay();
  else audio.pause();
  syncUI();
}

/* ===== UI ===== */
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
}

/* ===== NEXT / PREV ===== */
function next(){ playTrack((current+1)%tracks.length); }
function prev(){ playTrack((current-1+tracks.length)%tracks.length); }

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
  audio.currentTime = (progress.value/100)*audio.duration;
};

/* ===== CARDS ===== */
tracks.forEach((t,i)=>{
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${t.cover}">
    <h3>${t.title}</h3>

    <button onclick="playTrack(${i})">▶ Play</button>

    <div class="download-bar" onclick="download(${i})">
      <div class="download-fill"></div>
      <span>⬇ Скачать</span>
    </div>
  `;

  list.appendChild(div);
  cards.push(div);
});

/* ===== DOWNLOAD ===== */
function download(i){
  const t = tracks[i];
  const bar = cards[i].querySelector(".download-bar");
  const fill = bar.querySelector(".download-fill");
  const text = bar.querySelector("span");

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
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  cards.forEach((c,i)=>{
    c.style.display = tracks[i].title.toLowerCase().includes(value) ? "block":"none";
  });
});
