const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const seekBar = document.getElementById('seek-bar');
const visualizerCanvas = document.getElementById ('visualizer');
const visualizerContext = document.getElementById('2d');

let audioContext, analyser, dataArray, bufferLenngth;

playPauseBtn.addEventListener('click', ()=>{
    if (audioPlayer.paused){
        audioPlayer.play();
        playPauseBtn.innerHTML =  '<i class = "fa fa-pause" </i>';
        initializeVisualizer();
    }else{
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class = "fa fa-play" </i>';
    }
})