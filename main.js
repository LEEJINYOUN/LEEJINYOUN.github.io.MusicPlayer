const musicCount = document.querySelector(".audio_count");
const musicImg = document.querySelector(".image img");
const musicName = document.querySelector(".name");
const musicArtist = document.querySelector(".artist");
const musicAudio = document.querySelector("#main-audio");
const playPauseBtn = document.querySelector(".play-pause");
const playPauseIcon = document.querySelector(".play-pause span");
const prevBtn = document.querySelector("#prev");
const nextBtn = document.querySelector("#next");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress_bar");
const repeatBtn = document.querySelector("#repeat-plist");
const volume_slider = document.querySelector(".volume_slider");
const volume_progress_bar = document.querySelector(".volume_progress_bar");
const volume_value = document.querySelector(".volume_value");

let musicIndex = 1;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  volume_slider.oninput = function () {
    volume_progress_bar.value = volume_slider.value;
    $(volume_value).text(volume_slider.value);
    musicAudio.volume = volume_slider.value / 100;
  };
});

function loadMusic(indexNunb) {
  $(musicCount).text(
    ` 현재 재생목록 (${allMusic[indexNunb - 1].id}/${allMusic.length})`
  );
  $(musicName).text(`${allMusic[indexNunb - 1].name}`);
  $(musicArtist).text(`${allMusic[indexNunb - 1].artist}`);
  $(musicImg).attr("src", `imgs/${allMusic[indexNunb - 1].img}.jpg`);
  $(musicAudio).attr("src", `songs/${allMusic[indexNunb - 1].src}.mp3`);
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

  let musicCurrentTime = document.querySelector(".current-time");
  let musicDuration = document.querySelector(".max-duration");

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
