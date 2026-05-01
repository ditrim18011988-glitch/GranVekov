<script>

const tracks = [
  {
    title: "Чёрная лампа",
    file: "music/track1.mp3",
    cover: "music/cover1.jpeg"
  },
  {
    title: "Всадники Ада",
    file: "music/track2.mp3",
    cover: "music/cover2.jpeg"
  }
];

let current = 0;

let audio;
let title;
let cover;
let progress;
let playBtn;

/* ждём загрузки страницы */
window.addEventListener("DOMContentLoaded", () => {

  audio = document.getElementById("audio");
  title = document.getElementById("title");
  cover = document.getElementById("cover");
  progress = document.getElementById("progress");
  playBtn = document.getElementById("playBtn");

  load(0);

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progress.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  progress.addEventListener("input", () => {
    if (audio.duration) {
      audio.currentTime = (progress.value / 100) * audio.duration;
    }
  });

  audio.addEventListener("ended", next);

});

/* загрузка трека */
function load(i) {
  current = i;

  audio.src = tracks[i].file;
  title.textContent = tracks[i].title;
  cover.src = tracks[i].cover;

  audio.play();
  playBtn.textContent = "⏸";
}

/* управление */
function next() {
  load((current + 1) % tracks.length);
}

function prev() {
  load((current - 1 + tracks.length) % tracks.length);
}

function toggle() {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    playBtn.textContent = "▶️";
  }
}

/* чтобы кнопки работали из HTML */
window.load = load;
window.next = next;
window.prev = prev;
window.toggle = toggle;

</script>