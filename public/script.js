const tracks = [
  {id:17, title:"Аид V.2", file:"music/track1.2.mp3", cover:"music/cover1.2.png"},
  {id:16, title:"Северный рубеж V.2", file:"music/track1.1.mp3", cover:"music/cover1.1.png"},
  {id:15, title:"Крампус", file:"music/track15.mp3", cover:"music/cover15.png"},
  {id:14, title:"Северный рубеж", file:"music/track14.mp3", cover:"music/cover14.jpg"},
  {id:13, title:"Безмолвный город", file:"music/track13.mp3", cover:"music/cover13.jpg"},
  {id:12, title:"Аид", file:"music/track12.mp3", cover:"music/cover12.jpg"},
  {id:11, title:"Пиковая Дама", file:"music/track11.mp3", cover:"music/cover11.jpg"},
  {id:10, title:"Питер Пэн - Похититель детей", file:"music/track10.mp3", cover:"music/cover10.jpg"},
  {id:9, title:"Распутин-Демон порока", file:"music/track9.mp3", cover:"music/cover9.jpg"},
  {id:8, title:"До последнего шага", file:"music/track8.mp3", cover:"music/cover8.jpg"},
  {id:7, title:"Сын Дьявола", file:"music/track7.mp3", cover:"music/cover7.jpg"},
  {id:6, title:"Белоснежка и семь грехов: Союз тьмы", file:"music/track6.mp3", cover:"music/cover6.jpg"},
  {id:5, title:"Падший Ангел", file:"music/track5.mp3", cover:"music/cover5.jpg"},
  {id:4, title:"Кролик Роджер", file:"music/track4.mp3", cover:"music/cover4.jpg"},
  {id:3, title:"Чёрное рождество", file:"music/track3.mp3", cover:"music/cover3.jpg"},
  {id:2, title:"Всадники Ада", file:"music/track2.mp3", cover:"music/cover2.jpg"},
  {id:1, title:"Чёрная лампа", file:"music/track1.mp3", cover:"music/cover1.jpg"}
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

/* ================= SAFE PLAY ================= */
function safePlay(){
  const p = audio.play();
  if(p && p.catch) p.catch(()=>{});
}

/* ================= LOAD TRACK ================= */
function load(i){
  current = i;

  audio.src = tracks[i].file;
  title.textContent = tracks[i].title;
  cover.src = tracks[i].cover;

  safePlay();
  syncUI();
}

/* ================= CARD CLICK ================= */
function toggleTrack(i){

  // другой трек
  if(i !== current){
    load(i);
    return;
  }

  // тот же трек → play/pause
  if(audio.paused){
    safePlay();
  } else {
    audio.pause();
  }

  syncUI();
}

/* ================= PLAYER BUTTON ================= */
function toggle(){
  if(audio.paused){
    safePlay();
  } else {
    audio.pause();
  }

  syncUI();
}

/* ================= UI SYNC ================= */
function syncUI(){

  const isPlaying = !audio.paused;

  playBtn.textContent = isPlaying ? "⏸" : "▶️";

  cards.forEach((c,i)=>{
    const btn = c.querySelector("button");
    if(!btn) return;

    if(i === current){
      btn.textContent = isPlaying ? "⏸ Pause" : "▶ Play";
    } else {
      btn.textContent = "▶ Play";
    }

    c.classList.toggle("active", i === current);
  });
}

/* ================= EVENTS ================= */
audio.addEventListener("play", syncUI);
audio.addEventListener("pause", syncUI);

audio.addEventListener("ended", () => {
  if(current >= 0){
    load((current + 1) % tracks.length);
  }
});

/* ================= PROGRESS ================= */
audio.ontimeupdate = () => {
  if(audio.duration){
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
};

progress.oninput = () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
};

/* ================= CARDS ================= */
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

/* ================= DOWNLOAD (ВОЗВРАТ НОРМАЛЬНОЙ ВЕРСИИ) ================= */
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
    });
}

/* ================= SEARCH ================= */
searchInput.addEventListener("input", () => {
  const v = searchInput.value.toLowerCase();

  cards.forEach((c,i)=>{
    c.style.display = tracks[i].title.toLowerCase().includes(v)
      ? "block"
      : "none";
  });
});
function downloadTrack(i){
  const t = tracks[i];

  fetch(t.file)
    .then(res => {
      if(!res.ok) throw new Error("File not found");
      return res.blob();
    })
    .then(blob => {

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      // 🔥 НОРМАЛЬНОЕ ИМЯ ФАЙЛА
      const safeName = t.title
        .replace(/[\/\\:*?"<>|]/g, "")  // убираем запрещённые символы
        .trim();

      a.download = `${safeName}.mp3`;

      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
    })
    .catch(err => {
      console.error("Download error:", err);
      alert("Не удалось скачать файл");
    });
}
