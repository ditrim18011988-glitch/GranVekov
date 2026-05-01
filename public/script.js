const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const progress = document.getElementById("progress");
const playBtn = document.getElementById("playBtn");

let current = 0;

function load(i){
  current = i;
  audio.src = tracks[i].file;
  title.innerText = tracks[i].title;
  cover.src = tracks[i].cover;
  audio.play();
  playBtn.innerText = "⏸";
}

function next(){
  load((current+1)%tracks.length);
}

function prev(){
  load((current-1+tracks.length)%tracks.length);
}

function toggle(){
  if(audio.paused){
    audio.play();
    playBtn.innerText = "⏸";
  } else {
    audio.pause();
    playBtn.innerText = "▶️";
  }
}

audio.ontimeupdate = () => {
  progress.value = (audio.currentTime/audio.duration)*100;
}

progress.oninput = () => {
  audio.currentTime = (progress.value/100)*audio.duration;
}

audio.onended = next;