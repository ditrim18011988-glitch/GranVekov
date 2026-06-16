const tracks = [
  { title:"Чёрная лампа", file:"music/track1.mp3", cover:"music/cover1.jpg" },
  { title:"Всадники Ада", file:"music/track2.mp3", cover:"music/cover2.jpg" },
  { title:"Чёрное рождество", file:"music/track3.mp3", cover:"music/cover3.png" }
];

let current = 0;
let cards = [];
let cardPlayButtons = [];
let isDownloading = false;
let activeXHR = null;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const list = document.getElementById("list");
const searchInput = document.getElementById("search");

/* ===== ACTIVE TRACK ===== */
function setActiveTrack(i){
  cards.forEach(c => c.classList.remove("active"));
  if(cards[i]) cards[i].classList.add("active");
}

/* ===== BUTTON SYNC (ИСПРАВЛЕНО) ===== */
function updateCardButtons(){
  cardPlayButtons.forEach((btn, i) => {
    if(!btn) return;

    if(i === current){
      btn.innerText = audio.paused ? "▶ Play" : "⏸ Playing";
    } else {
      btn.innerText = "▶ Play";
    }
  });
}

/* ===== LOAD TRACK (ИСПРАВЛЕНО) ===== */
function load(i){

  // 🔥 ВАЖНО: если нажали тот же трек — просто toggle
  if(i === current){
    toggle();
    return;
  }

  current = i;

  audio.src = tracks[i].file;
  title.innerText = tracks[i].title;
  cover.src = tracks[i].cover;

  audio.play();
  playBtn.innerText = "⏸";

  setActiveTrack(i);
  updateCardButtons();
}

/* ===== PLAY / PAUSE ===== */
function toggle(){
  if(audio.paused){
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶️";
  }

  updateCardButtons();
}

/* ===== NEXT / PREV ===== */
function next(){ load((current + 1) % tracks.length); }
function prev(){ load((current - 1 + tracks.length) % tracks.length); }

/* ===== AUDIO EVENTS (ПОЛНАЯ СИНХРОНИЗАЦИЯ) ===== */
audio.addEventListener("play", updateCardButtons);
audio.addEventListener("pause", updateCardButtons);
audio.addEventListener("ended", next);

/* ===== PROGRESS ===== */
audio.ontimeupdate = () => {
  if(audio.duration){
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
};

progress.oninput = () => {
  if(audio.duration){
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
};

/* ===== CARDS ===== */
tracks.forEach((t, i) => {
  const div = document.createElement("div");
  div.className = "card";
  div.style.animationDelay = `${i * 0.1}s`;

  div.innerHTML = `
    <img src="${t.cover}">
    <h3>${t.title}</h3>

    <button class="playCardBtn" onclick="load(${i})">▶ Play</button>

    <div class="download-bar" onclick="download(${i})">
      <div class="download-fill"></div>
      <span>⬇ Скачать</span>
    </div>
  `;

  list.appendChild(div);
  cards.push(div);
  cardPlayButtons.push(div.querySelector(".playCardBtn"));
});

/* ===== DOWNLOAD (оставлено, но стабильно) ===== */
function download(i){
  if(isDownloading) return;

  const t = tracks[i];
  const bar = cards[i].querySelector(".download-bar");
  const fill = bar.querySelector(".download-fill");
  const text = bar.querySelector("span");

  if(activeXHR){
    activeXHR.abort();
    activeXHR = null;
  }

  isDownloading = true;
  bar.classList.add("loading");

  const xhr = new XMLHttpRequest();
  activeXHR = xhr;

  xhr.open("GET", t.file, true);
  xhr.responseType = "blob";

  fill.style.width = "0%";
  text.innerText = "0%";

  xhr.onprogress = (e) => {
    if(e.lengthComputable){
      const percent = Math.floor((e.loaded / e.total) * 100);
      fill.style.width = percent + "%";
      text.innerText = percent + "%";
    }
  };

  xhr.onload = () => {
    const url = URL.createObjectURL(xhr.response);

    const a = document.createElement("a");
    a.href = url;
    a.download = t.title + ".mp3";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    resetDownload(bar, fill, text);
  };

  xhr.onerror = () => {
    text.innerText = "Ошибка";
    resetDownload(bar, fill, text);
  };

  xhr.onabort = () => {
    resetDownload(bar, fill, text);
  };

  xhr.send();
}

/* ===== RESET DOWNLOAD ===== */
function resetDownload(bar, fill, text){
  setTimeout(() => {
    fill.style.width = "0%";
    text.innerText = "⬇ Скачать";
    bar.classList.remove("loading");

    isDownloading = false;
    activeXHR = null;
  }, 400);
}

/* ===== SEARCH ===== */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  let found = false;

  tracks.forEach((t, i) => {
    const match = t.title.toLowerCase().includes(value);
    cards[i].style.display = match ? "block" : "none";
    if(match) found = true;
  });

  list.style.opacity = (!found && value.length > 0) ? "0.5" : "1";
});
