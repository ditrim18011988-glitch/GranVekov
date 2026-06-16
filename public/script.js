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

/* ===== PLAYER (collapse system) ===== */
const player = document.getElementById("player");
const togglePlayerBtn = document.getElementById("togglePlayer");

let isCollapsed = false;

function setCollapsed(state){
  isCollapsed = state;
  player.classList.toggle("collapsed", state);
  if(togglePlayerBtn){
    togglePlayerBtn.textContent = state ? "▴" : "▾";
  }
}

/* toggle button */
if(togglePlayerBtn){
  togglePlayerBtn.addEventListener("click", () => {
    setCollapsed(!isCollapsed);
  });
}

/* ===== PLAY SAFE ===== */
function safePlay(){
  const p = audio.play();
  if(p && p.catch) p.catch(()=>{});
}

/* ===== LOAD TRACK ===== */
function load(i){
  current = i;

  audio.src = tracks[i].file;
  title.textContent = tracks[i].title;
  cover.src = tracks[i].cover;

  safePlay();
  syncUI();
}

/* ===== TOGGLE TRACK ===== */
function toggleTrack(i){

  if(i === current){
    if(audio.paused) safePlay();
    else audio.pause();
    return;
  }

  load(i);
}

/* ===== MAIN BUTTON ===== */
function toggle(){
  if(audio.paused) safePlay();
  else audio.pause();
}

/* ===== UI ===== */
function syncUI(){
  playBtn.textContent = audio.paused ? "▶️" : "⏸";

  cards.forEach((c,i)=>{
    const btn = c.querySelector("button");

    if(i === current){
      btn.textContent = audio.paused ? "▶ Play" : "⏸ Pause";
    } else {
      btn.textContent = "▶ Play";
    }

    c.classList.remove("active");
    if(i === current) c.classList.add("active");
  });
}

/* ===== EVENTS ===== */
audio.addEventListener("play", syncUI);
audio.addEventListener("pause", syncUI);

audio.addEventListener("ended", () => {
  if(current >= 0) load((current + 1) % tracks.length);
});

/* ===== PROGRESS ===== */
audio.ontimeupdate = () => {
  if(audio.duration){
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

/* ===== CARDS ===== */
tracks.forEach((t,i)=>{
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${t.cover}">
    <h3>${t.title}</h3>
    <button onclick="toggleTrack(${i})">▶ Play</button>

    <div class="downloadBtn" onclick="downloadTrack(${i})">
      <div class="fill"></div>
      <span>⬇ Скачать</span>
    </div>
  `;

  list.appendChild(div);
  cards.push(div);
});

/* ===== DOWNLOAD ===== */
function downloadTrack(i){
  fetch(tracks[i].file)
    .then(r => r.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = tracks[i].title + ".mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
}

/* ===== SEARCH ===== */
searchInput.addEventListener("input", () => {
  const v = searchInput.value.toLowerCase();

  cards.forEach((c,i)=>{
    c.style.display = tracks[i].title.toLowerCase().includes(v) ? "block" : "none";
  });
});

/* ===== SWIPE GESTURES ===== */
let startY = 0;

player.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});

player.addEventListener("touchend", (e) => {
  const endY = e.changedTouches[0].clientY;
  const diff = endY - startY;

  // свайп вниз → свернуть
  if(diff > 50){
    setCollapsed(true);
  }

  // свайп вверх → развернуть
  if(diff < -50){
    setCollapsed(false);
  }
});
