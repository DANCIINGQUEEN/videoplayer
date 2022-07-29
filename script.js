const container=document.querySelector('.container'),
mainVideo=container.querySelector("video"),
progressBar=container.querySelector('.progress-bar'),
videoTimeline=container.querySelector('.video-timeline'),
volumeBtn=container.querySelector('.volume i'),
volumeSlider=container.querySelector('.left input'),
currentVidTime=container.querySelector('.current-time'),
videoDuration=container.querySelector('.video-duration'),
skipBackward=container.querySelector('.skip-backward i'),
skipForward=container.querySelector('.skip-forward i'),
playPauseBtn=container.querySelector('.play-pause i'),
spedBtn=container.querySelector('.playback-speed span'),
speedOptions=container.querySelector('.speed-options'),
picInPicBtn=container.querySelector('.pic-in-pic span'),
fullscreenBtn=container.querySelector('.fullscreen i')

let timer

const hideControls=()=>{
    //if video is paused return 
    if(mainVideo.paused) return;
    timer = setTimeout(()=>{
        container.classList.remove("show-controls")
    }, 2500)
}
hideControls()

container.addEventListener("mousemove", ()=>{
    container.classList.add('show-controls')
    clearTimeout(timer) //clear time
    hideControls() //calling hideControls
})

const formatTime=time=>{
    //getting seconds, minutes, hours
    let seconds=Math.floor(time%60),
    minutes=Math.floor(time/60)%60,
    hours=Math.floor(time/3600)

    //adding 0 at the beginning if the particular value is less than 10
    seconds=seconds<10?`0${seconds}`:seconds
    minutes=minutes<10?`0${minutes}`:minutes
    hours=hours<10?`0${hours}`:hours

    //if hours is 0 return minutes & seconds only else return all
    if(hours==0){
        return `${minutes}:${seconds}`
    }
    return `${hours}:${minutes}:${seconds}`

}

mainVideo.addEventListener("timeupdate", (e)=>{
    //getting currentTime & duration of the video
    let {currentTime, duration}=e.target;
    // console.log(currentTime, duration)
    let percent=(currentTime/duration)*100
    progressBar.style.width=`${percent}%`
    currentVidTime.innerText=formatTime(currentTime)
})

mainVideo.addEventListener("loadeddata", (e)=>{
    //passing video duration as videoDuration innerText
    videoDuration.innerText=formatTime(e.target.duration)
})

videoTimeline.addEventListener("click",e=>{
    //getting videoTimeline width
    let timelineWidth=videoTimeline.clientWidth
    //updating video currentTime
    mainVideo.currentTime = (e.offsetX/timelineWidth)*mainVideo.duration
})

const draggableProgressBar=(e)=>{
    let timelineWidth=videoTimeline.clientWidth
    //passing offsetX value as progressbar width
    progressBar.style.width=`${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX/timelineWidth)*mainVideo.duration
    //passing video current time as currentVidTime innerText
    currentVidTime.innerText=formatTime(mainVideo.currentTime)
}

//getting videoTimeline width
videoTimeline.addEventListener("mousedown", ()=> {
    videoTimeline.addEventListener("mousemove", draggableProgressBar)
})

container.addEventListener("mouseup", ()=>{
    //removing mousemove listener on mouseup event
    videoTimeline.removeEventListener("mousemove", draggableProgressBar)
})


videoTimeline.addEventListener("mousemove", e=>{
    const progressTime=videoTimeline.querySelector('span')
    //getting mouseX position`
    let offsetX=e.offsetX
    //passing offsetX value as progressTime left value
    progressTime.style.left=`${offsetX}px`;
    let timelineWidth=videoTimeline.clientWidth
    let percent=(e.offsetX/timelineWidth)*mainVideo.duration
    //passing percent as progresstime innerText
    progressTime.innerText=formatTime(percent)

})

//if volume icon isn't volume high icon
volumeBtn.addEventListener("click",()=>{
    if(!volumeBtn.classList.contains("fa-volume-high")){
        //passind 0.5 value as video volume
        mainVideo.volume=0.5    
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high")
    }else{
        //passind 0.5 value as video volume, so the video mute
        mainVideo.volume=0.0    
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark")
    }
    //update slider value according to the video volume
    volumeSlider.value=mainVideo.volume
})

volumeSlider.addEventListener("input", (e)=>{
    //passing slider value as video volume
    mainVideo.volume=e.target.value
    console.log(e.target.value)
    //if slider value is 0, change icon to mute icon
    if(e.target.value == 0){
        volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
    }else{
        volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
    }
})

spedBtn.addEventListener("click", ()=>{
    speedOptions.classList.toggle("show")
})

speedOptions.querySelectorAll("li").forEach(option=>{
    // console.log(option)
    option.addEventListener("click",()=>{
        mainVideo.playbackRate=option.dataset.speed

        //remove active class
        speedOptions.querySelector('.active').classList.remove("active")
        //adding active class on the selected option
        option.classList.add('active')
    })
})

//hide speed options on document click 
document.addEventListener("click", (e)=>{
    if(e.target.tagName!=="SPAN"||e.target.className!=="material-symbols-rounded"){
        speedOptions.classList.remove('show')
    }
})

picInPicBtn.addEventListener("click",()=>{
    //changing video mode to picture in picture
    mainVideo.requestPictureInPicture()
})

fullscreenBtn.addEventListener("click",()=>{
    container.classList.toggle("fullscreen")
    if(document.fullscreenElement){
        //if video is already in fullscreen mode, remove
        fullscreenBtn.classList.replace("fa-compress", "fa-expand")
        return document.exitFullscreen
    }
    fullscreenBtn.classList.replace("fa-expand", "fa-compress")
    
    //go to fullscreen mode
    container.requestFullscreen()
})

//subtrack 5 seconds form the current video time
skipBackward.addEventListener("click", ()=>{
    mainVideo.currentTime-=5
})

//add 5 seconds form the current video time
skipForward.addEventListener("click", ()=>{
    mainVideo.currentTime+=5
})

//if video is paused, play the video else pause the video
playPauseBtn.addEventListener('click',()=>{
    mainVideo.paused?mainVideo.play():mainVideo.pause()
})

//if video is play, change icon to pause
mainVideo.addEventListener('play',()=>{
    playPauseBtn.classList.replace("fa-play", "fa-pause")
})

//if video is pause, change icon to play
mainVideo.addEventListener('pause',()=>{
    playPauseBtn.classList.replace("fa-pause", "fa-play")
})

