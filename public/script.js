const tracks = [
  { title:"Чёрная лампа", file:"music/track1.mp3", cover:"music/cover1.jpg" },
  { title:"Всадники Ада", file:"music/track2.mp3", cover:"music/cover2.jpg" },
  { title:"Чёрное рождество", file:"music/track3.mp3", cover:"music/cover3.jpg" },
  { title:"Кролик Роджер", file:"music/track4.mp3", cover:"music/cover4.jpg" },
  { title:"Падший Ангел", file:"music/track5.mp3", cover:"music/cover5.jpg" },
  { title:"Белоснежка и семь грехов: Союз тьмы", file:"music/track6.mp3", cover:"music/cover6.jpg" },
  { title:"Сын Дьявола", file:"music/track7.mp3", cover:"music/cover7.jpg" },
  { title:"До последнего шага", file:"music/track8.mp3", cover:"music/cover8.jpg" },
  { title:"Распутин-Демон порока", file:"music/track9.mp3", cover:"music/cover9.jpg" },
  { title:"Питер Пэн-похититель детей", file:"music/track10.mp3", cover:"music/cover10.jpg" },
  { title:"Пиковая Дама", file:"music/track11.mp3", cover:"music/cover11.jpg" },
  { title:"Безмолвный город", file:"music/track12.mp3", cover:"music/cover13.jpg" },
  { title:"Северный рубеж", file:"music/track14.mp3", cover:"music/cover14.jpg" }
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

function safePlay(){
  const p = audio.play();
  if (p && p.catch) p.catch(()=>{});
}

function load(i){
  current = i;

  audio.src = tracks[i].file;
  title.textContent = tracks[i].title;
  cover.src = tracks[i].cover;

  safePlay();
  syncUI();
}

function toggleTrack(i){

  if(i !== current){
    load(i);
    return;
  }

  if(audio.paused){
    safePlay();
  }else{
    audio.pause();
  }

  syncUI();
}

function toggle(){
  if(audio.paused){
    safePlay();
  }else{
    audio.pause();
  }

  syncUI();
}

function next(){
  if(current < 0){
    load(0);
  }else{
    load((current + 1) % tracks.length);
  }
}

function prev(){
  if(current < 0){
    load(0);
  }else{
    load((current - 1 + tracks.length) % tracks.length);
  }
}

function syncUI(){

  playBtn.textContent = audio.paused ? "▶️" : "⏸";

  cards.forEach((card, i)=>{

    const btn = card.querySelector(".playBtn");

    if(btn){
      if(i === current){
        btn.textContent = audio.paused ? "▶ Play" : "⏸ Pause";
      }else{
        btn.textContent = "▶ Play";
      }
    }

    card.classList.toggle("active", i === current);
  });
}

audio.addEventListener("play", syncUI);
audio.addEventListener("pause", syncUI);

audio.addEventListener("ended", ()=>{
  next();
});

audio.ontimeupdate = ()=>{
  if(audio.duration){
    progress.value =
      (audio.currentTime / audio.duration) * 100;
  }
};

progress.oninput = ()=>{
  audio.currentTime =
    (progress.value / 100) * audio.duration;
};
/* ================= CARDS ================= */

tracks.forEach((t, i) => {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${t.cover}">
    <h3>${t.title}</h3>

    <button class="playBtn" onclick="toggleTrack(${i})">▶ Play</button>

    <div class="downloadBtn" onclick="downloadTrack(${i})">
      <div class="fill"></div>
      <span>⬇ Скачать</span>
    </div>
  `;

  list.appendChild(div);
  cards.push(div);
});

/* ================= DOWNLOAD ================= */

function downloadTrack(i){
  const t = tracks[i];

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
    })
    .catch(err => {
      console.log("download error:", err);
    });
}

/* ================= SEARCH ================= */

searchInput.addEventListener("input", () => {
  const v = searchInput.value.toLowerCase();

  cards.forEach((c, i) => {
    const ok = tracks[i].title.toLowerCase().includes(v);
    c.style.display = ok ? "block" : "none";
  });
});
