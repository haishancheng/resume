function $(val){
  return document.querySelector(val)
}
function $$(val){
  return document.querySelectorAll(val)
}
var backwardBtn = $('.musicpanel .fa-step-backward')
var playBtn = $('.musicpanel .fa-play')
var forwardBtn = $('.musicpanel .fa-step-forward')
var songTitle = $('.musicpanel .song')
var songAuthor = $('.musicpanel .author')
var currentBar = $('.music-progress .progress-current')
var audioObject = new Audio()
var musicIndex = 0
var musicList

//定义一个getMusic函数，用于发送ajax，获取music.json中的数据
function getMusic(callback){
  var xhr = new XMLHttpRequest()
  xhr.open('get', './music.json', true)
  xhr.onload = function(){
    if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
      callback(JSON.parse(xhr.responseText))
    }else{
      console.log('获取数据失败')
    }
  }
  xhr.onerror = function(){
    console.log('网络异常')
  }
  xhr.send()
}

//定义一个loadMusic函数，用于将获取到的音乐数据的相关内容显示在页面上,参数为获取到的JSON对象中的某个对象
function loadMusic(musicObj){
  audioObject.src = musicObj.src
  audioObject.autoPlay = true
  songTitle.innerText = musicObj.title
  songAuthor.innerText = musicObj.auther
}

//执行getMuscic,获取到music.json中返回的数据。其实可以直接先发ajax，然后在ajax的成功的逻辑中赋值
getMusic(function(resMusicObj){
  musicList = resMusicObj
  loadMusic(musicList[musicIndex])
})

//播放按钮绑定事件
playBtn.onclick = function(){
  if(playBtn.classList.contains('fa-play')){
    audioObject.play()
    playBtn.classList.remove('fa-play')
    playBtn.classList.add('fa-pause')
  }else{
    audioObject.pause()
    playBtn.classList.remove('fa-pause')
    playBtn.classList.add('fa-play')
  }
}
audioObject.ontimeupdate = function(){
  currentBar.style.width = this.currentTime / this.duration * 100 + '%'
  // console.log(this.currentTime / this.duration * 100 + '%')
}
