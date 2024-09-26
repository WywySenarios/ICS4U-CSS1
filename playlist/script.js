const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const seekBar = document.getElementById('seek-bar');
const visualizerCanvas = document.getElementById('visualizer');
const canvasContext = visualizerCanvas.getContext('2d');

let audioContext, analyser, dataArray, bufferLength;

playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fa fa-pause"></i>';
        initializeVisualizer();
    } else {
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fa fa-play"></i>';
    }
});

audioPlayer.addEventListener('loadedmetadata', () => {
    console.log('Loaded metadata:', audioPlayer.duration);
    const durationMinutes = Math.floor(audioPlayer.duration / 60);
    const durationSeconds = Math.floor(audioPlayer.duration % 60);
    durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
});

audioPlayer.addEventListener('timeupdate', () => {
    const currentMinutes = Math.floor(audioPlayer.currentTime / 60);
    const currentSeconds = Math.floor(audioPlayer.currentTime % 60);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    seekBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
});

seekBar.addEventListener('input', () => {
    audioPlayer.currentTime = (seekBar.value / 100) * audioPlayer.duration;
});

function initializeVisualizer() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
    }
    drawVisualizer();
}

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    canvasContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    const barWidth = (visualizerCanvas.width / bufferLength) * 2; // Reduced frequency of bars
    let barHeight;
    let x = 0;
    const centerY = visualizerCanvas.height / 2; // Center Y position

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        canvasContext.fillStyle = `rgb(0, 0, 0)`; // Black color for bars

        // Draw the bars with rounded ends
        canvasContext.beginPath();
        canvasContext.moveTo(x, centerY);
        canvasContext.lineTo(x, centerY - barHeight / 2);
        canvasContext.lineTo(x + barWidth, centerY - barHeight / 2);
        canvasContext.arcTo(x + barWidth, centerY - barHeight / 2, x + barWidth, centerY + barHeight / 2, barWidth / 2);
        canvasContext.lineTo(x + barWidth, centerY + barHeight / 2);
        canvasContext.lineTo(x, centerY + barHeight / 2);
        canvasContext.arcTo(x, centerY + barHeight / 2, x, centerY - barHeight / 2, barWidth / 2);
        canvasContext.closePath();
        canvasContext.fill();

        x += barWidth + 1;
    }
}

// Debugging
audioPlayer.addEventListener('error', (e) => {
    console.error('Audio error:', e);
});

console.log('Script loaded.');