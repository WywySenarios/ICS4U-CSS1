const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const seekBar = document.getElementById('seek-bar');
const visualizerCanvas = document.getElementById ('visualizer');
const canvasContext = visualizerCanvas.getContext('2d');
const 青春コンプレックスbtn = document.getElementById('青春コンプレックス');

let audioContext, analyser, dataArray, bufferLength;

playPauseBtn.addEventListener('click', ()=>{
    if (audioPlayer.paused){
        audioPlayer.play();
        playPauseBtn.innerHTML =  '<i class = "fa fa-pause" </i>';
        //initializeVisualizer()
        
    }else{
        audioPlayer.pause();
        playPauseBtn.innerHTML = '<i class = "fa fa-play" </i>';
    }
})


audioPlayer.addEventListener( 'loadedmetadata', ()=>{
    console.log('meta data loaded', audioPlayer.duration)
    const durationMinutes = Math.floor(audioPlayer.duration/60)
    const durationSeconds = Math.floor(audioPlayer.duration%60)
    durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? 'o' : ''}${durationSeconds}`
})


//current time

audioPlayer.addEventListener( 'timeupdate', ()=>{
    console.log('meta data loaded', audioPlayer.currentTime)
    const currentMinutes = Math.floor(audioPlayer.currentTime/60)
    const currentSeconds = Math.floor(audioPlayer.currentTime%60)
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`

    //seek-bar
    seekBar.value = (audioPlayer.currentTime / audioPlayer.duration)*100;
})

seekBar.addEventListener( 'input', ()=>{
    audioPlayer.currentTime = (seekBar.value/100)*audioPlayer.duration;
})

//draw the visualiser

function initializeVisualizer(){
    if (!audioContext){
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        bufferLenngth = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        const source = audioContext.createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(audioContext.destination)
    }
    drawVisualizer();
}


//draw visualiser functions

function drawVisualizer(){
    requestAnimationFrame(drawVisualizer);
    analyser.getByteFrequencyData(dataArray);

    canvasContext.clearRect(0, 0, visualizerCanvas.width, visualizerCanvas.height);
    const barWidth = (visualizerCanvas.width / bufferLength) *2; //reduce frequency of bars
    let barHeight;
    let x = 0;
    const centerY = visualizerCanvas.height / 2; //center y  pos

    for (let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i] / 2;
        canvasContext.fillStyle = `rgb(0,0,0)`; //black bars
    

        //draw bar with rounded ends
        canvasContext.beginPath();
        canvasContext.moveTo(x, centerY);
        canvasContext.lineTo(x, centerY - barHeight/2);
        canvasContext.lineTo(x + barWidth, centerY - barHeight/2);
        canvasContext.arcTo(x + barWidth, centerY - barHeight/2, x + barWidth, centerY + barHeight/2, barWidth/2);
        canvasContext.lineTo(x + barWidth, centerY + barHeight/2);
        canvasContext.lineTo(x, centerY + barHeight/2);
        canvasContext.arcTo(x, centerY + barHeight/2, x,centerY - barHeight/2, barWidth/2);
        canvasContext.closePath();
        canvasContext.fill();

        x += barWidth + 1;
    }
}

青春コンプレックスbtn.addEventListener('click', ()=>{
    console.log("test");
})