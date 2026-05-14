const audio = document.getElementById('audio');
const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d');

let analyser, dataArray, source, raf;

function initViz() {
  const actx = new (window.AudioContext || window.webkitAudioContext)();

  source = actx.createMediaElementSource(audio);
  analyser = actx.createAnalyser();

  analyser.fftSize = 64;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  source.connect(analyser);
  analyser.connect(actx.destination);
}

function draw() {
  raf = requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const w = (canvas.width / dataArray.length) * 1.7;

  for (let i = 0; i < dataArray.length; i++) {
    const h = (dataArray[i] / 255) * canvas.height;

    ctx.fillStyle = `hsl(${i * 9}, 100%, 62%)`;

    ctx.fillRect(i * w, canvas.height - h, w - 4, h);
  }
}

function togglePlay() {
  if (!analyser) initViz();

  if (audio.paused) {
    audio.play();
    draw();
  } else {
    audio.pause();
    cancelAnimationFrame(raf);
  }
}

document.getElementById('volume').oninput = e => {
  audio.volume = e.target.value;
};

audio.ontimeupdate = () => {
  const perc = audio.duration
    ? (audio.currentTime / audio.duration) * 100
    : 0;

  document.getElementById('progress').value = perc;

  document.getElementById('time').textContent =
    Math.floor(audio.currentTime) + 's';
};
