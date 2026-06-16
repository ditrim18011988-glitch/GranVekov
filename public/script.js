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
let cardPlayButtons = [];
let isDownloading = false;

const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");
const list = document.getElementById("list");
const searchInput = document.getElementById("search");

/* ===== ACTIVE TRACK ===== */
function setActiveTrack(index) {
  cards.forEach(c => c.classList.remove("active"));
  if (cards[index]) cards[index].classList.add("active");
}

/* ===== CARD BUTTON SYNC ===== */
function updateCardButtons(activeIndex, isPlaying) {
  cardPlayButtons.forEach((btn, i) => {
    if (!btn) return;
    btn.innerText = (i === activeIndex && isPlaying) ? "⏸ Playing" : "▶ Play";
  });
}

/* ===== LOAD TRACK ===== */
function load(i) {
  current = i;

  audio.src = tracks[i].file;
  title.innerText = tracks[i].title;
  cover.src = tracks[i].cover;

  audio.play();
  playBtn.innerText = "⏸";

  setActiveTrack(i);
  updateCardButtons(i, true);
}

/* ===== NEXT / PREV ===== */
function next() {
  load((current + 1) % tracks.length);
}

function prev() {
  load((current - 1 + tracks.length) % tracks.length);
}

/* ===== TOGGLE PLAY ===== */
function toggle() {
  if (audio.paused) {
    audio.play();
    playBtn.innerText = "⏸";
    updateCardButtons(current, true);
  } else {
    audio.pause();
    playBtn.innerText = "▶️";
    updateCardButtons(current, false);
  }
}

/* ===== PLAYER PROGRESS ===== */
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

/* ===== CREATE CARDS ===== */
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

/* ===== DOWNLOAD WITH PROGRESS ===== */
function download(i) {
  if (isDownloading) return; // защита от спама

  const t = tracks[i];
  const bar = cards[i].querySelector(".download-bar");
  const fill = bar.querySelector(".download-fill");
  const text = bar.querySelector("span");

  isDownloading = true;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", t.file, true);
  xhr.responseType = "blob";

  fill.style.width = "0%";
  text.innerText = "0%";

  xhr.onprogress = (e) => {
    if (e.lengthComputable) {
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

    setTimeout(() => {
      fill.style.width = "0%";
      text.innerText = "⬇ Скачать";
      isDownloading = false;
    }, 500);
  };

  xhr.onerror = () => {
    text.innerText = "Ошибка";
    isDownloading = false;
  };

  xhr.send();
}

/* ===== SEARCH ===== */
searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();

  let found = false;

  tracks.forEach((t, i) => {
    const match = t.title.toLowerCase().includes(value);
    cards[i].style.display = match ? "block" : "none";
    if (match) found = true;
  });

  list.style.opacity = (!found && value.length > 0) ? "0.5" : "1";
});

/* ===== BUTTON EFFECTS ===== */
document.querySelectorAll("button").forEach(btn => {
  btn.addEventListener("mousedown", () => btn.style.transform = "scale(0.92)");
  btn.addEventListener("mouseup", () => btn.style.transform = "");
  btn.addEventListener("mouseleave", () => btn.style.transform = "");
});
