const musicCount = document.querySelector(".audioCount");
const musicImg = document.querySelector(".image img");
const musicName = document.querySelector(".name");
const musicArtist = document.querySelector(".artist");
const musicAudio = document.querySelector("#mainAudio");
const playPauseBtn = document.querySelector(".playPause");
const playPauseIcon = document.querySelector(".playPause span");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progressBar");
const repeatBtn = document.querySelector("#repeatPlist");
const volumeSlider = document.querySelector(".volumeSlider");
const volumeProgressBar = document.querySelector(".volumeProgressBar");
const volumeValue = document.querySelector(".volumeValue");

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  volumeSlider.oninput = function () {
    volumeProgressBar.value = volumeSlider.value;
    $(volumeValue).text(volumeSlider.value);
    musicAudio.volume = volumeSlider.value / 100;
  };
});

function loadMusic(indexNumber) {
  $(musicCount).text(
    ` 현재 재생목록 (${allMusic[indexNumber - 1].id}/${allMusic.length})`
  );
  $(musicName).text(`${allMusic[indexNumber - 1].name}`);
  $(musicArtist).text(`${allMusic[indexNumber - 1].artist}`);
  $(musicImg).attr("src", `imgs/${allMusic[indexNumber - 1].img}.jpg`);
  $(musicAudio).attr("src", `songs/${allMusic[indexNumber - 1].src}.mp3`);
}

function playMusic() {
  $(playPauseBtn).addClass("paused");
  $(playPauseIcon).text("paused");
  musicAudio.play();
}

function pauseMusic() {
  $(playPauseBtn).removeClass("paused");
  $(playPauseIcon).text("play_arrow");
  musicAudio.pause();
}

function prevMusic() {
  musicIndex--;
  musicIndex < 1 ? (musicIndex = allMusic.length) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

function nextMusic() {
  musicIndex++;
  musicIndex > allMusic.length ? (musicIndex = 1) : (musicIndex = musicIndex);
  loadMusic(musicIndex);
  playMusic();
}

$(playPauseBtn).click(() => {
  const isMusicPaused = playPauseBtn.classList.contains("paused");
  isMusicPaused ? pauseMusic() : playMusic();
});

$(prevBtn).on("click", () => {
  prevMusic();
});

$(nextBtn).on("click", () => {
  nextMusic();
});

$(musicAudio).on("timeupdate", (e) => {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  $(progressBar).css("width", `${progressWidth}%`);

  let musicCurrentTime = document.querySelector(".currentTime");
  let musicDuration = document.querySelector(".maxDuration");

  $(musicAudio).on("loadeddata", () => {
    let audioDuration = musicAudio.duration;
    let totalMin = Math.floor(audioDuration / 60);
    let totalSec = Math.floor(audioDuration % 60);

    if (totalSec < 10) {
      totalSec = `0${totalSec}`;
    }
    $(musicDuration).text(`${totalMin}:${totalSec}`);
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);

  if (currentSec < 10) {
    currentSec = `0${currentSec}`;
  }

  $(musicCurrentTime).text(`${currentMin}:${currentSec}`);
});

$(progress).click((e) => {
  let progressWidthval = progress.clientWidth;
  let clickedOffSetX = e.offsetX;
  let songDuration = musicAudio.duration;

  musicAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
  playMusic();
});

$(repeatBtn).click(() => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case "repeat":
      $(repeatBtn).text("repeat_one");
      $(repeatBtn).attr("title", "song looped");
      break;
    case "repeat_one":
      $(repeatBtn).text("repeat");
      $(repeatBtn).attr("title", "Playlist looped");
      break;
  }
});

$(musicAudio).on("ended", () => {
  let getText = repeatBtn.innerText;

  switch (getText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      musicAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
  }
});
