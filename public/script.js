const tracks = [
  {
    title: "Чёрная лампа",
    file: "music/track1.mp3",
    cover: "music/cover1.jpg"
  },
  {
    title: "Всадники Ада",
    file: "music/track2.mp3",
    cover: "music/cover2.jpg"
  },
  {
    title: "Чёрное рождество",
    file: "music/track3.mp3",
    cover: "music/cover3.png"
  }
];

let current = 0;
let cards = [];

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const list = document.getElementById("list");
const searchInput = document.getElementById("search");

/* ===== АКТИВНЫЙ ТРЕК ===== */
function setActiveTrack(index) {
  cards.forEach(c => c.classList.remove("active"));
  if (cards[index]) cards[index].classList.add("active");
}

/* ===== ЗАГРУЗКА ТРЕКА ===== */
function load(i) {
  current = i;

  audio.src = tracks[i].file;
  title.innerText = tracks[i].title;
  cover.src = tracks[i].cover;

  audio.play();
  playBtn.innerText = "⏸";

  setActiveTrack(i);
}

/* ===== NEXT / PREV ===== */
function next() {
  load((current + 1) % tracks.length);
}

function prev() {
  load((current - 1 + tracks.length) % tracks.length);
}

/* ===== PLAY / PAUSE ===== */
function toggle() {
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶️";
  }
}

/* ===== ПРОГРЕСС ===== */
audio.ontimeupdate = () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
};

progress.oninput = () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
};

audio.onended = next;

/* ===== СОЗДАНИЕ КАРТОЧЕК ===== */
tracks.forEach((t, i) => {
  const div = document.createElement("div");
  div.className = "card";
  div.style.animationDelay = `${i * 0.1}s`;

  div.innerHTML = `
    <img src="${t.cover}">
    <h3>${t.title}</h3>
    <button onclick="load(${i})">▶ Play</button>
    <button onclick="download(${i})">⬇ Скачать</button>
  `;

  list.appendChild(div);
  cards.push(div);
});

/* ===== ПОИСК ===== */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  let found = false;

  tracks.forEach((t, i) => {
    const match = t.title.toLowerCase().includes(value);

    if (cards[i]) {
      cards[i].style.display = match ? "block" : "none";
    }

    if (match) found = true;
  });

  // если ничего не найдено — можно слегка подсветить
  if (!found && value.length > 0) {
    list.style.opacity = "0.5";
  } else {
    list.style.opacity = "1";
  }
});

/* ===== СКАЧИВАНИЕ ===== */
async function download(i) {
  const t = tracks[i];

  const response = await fetch(t.file);
  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = t.title + ".mp3";

  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}

/* ===== ДОП ===== */
function donate() {
  window.open("https://paypal.me/yourlink", "_blank");
}

function ads() {
  alert("Реклама здесь");
}
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("mousedown", () => {
    btn.style.transform = "scale(0.92)";
  });

  btn.addEventListener("mouseup", () => {
    btn.style.transform = "";
  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "";
  });
});
