function $(val){
  return document.querySelector(val)
}
function $$(val){
  return document.querySelectorAll(val)
}

var currentIndex = 0
var musicList
var clock
var audioObject = new Audio()
audioObject.autoplay = true//****注意autoplay,不是autoPlay写错了万劫不复！！！！！设置为自动播放，下次更换 audioObject.src 后会自动播放音乐

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
  $('.musicpanel .song').innerText = musicObj.title
  $('.musicpanel .author').innerText = musicObj.auther
}

//执行getMuscic,获取到music.json中返回的数据。其实可以直接先发ajax，然后在ajax的成功的逻辑中赋值
getMusic(function(resMusicObj){
  musicList = resMusicObj
  loadMusic(musicList[currentIndex])
  audioObject.pause()//首次加载页面暂停
})

//播放按钮绑定事件
$('.musicpanel .fa-play').onclick = function(){
  if(audioObject.paused){
    audioObject.play()
    this.classList.remove('fa-play')
    this.classList.add('fa-pause')
  }else{
    audioObject.pause()
    this.classList.remove('fa-pause')
    this.classList.add('fa-play')
  }
}
//进度条以及时间的展示,由于ontimeupdate事件触发不均匀，导致时间变化不均匀，因此可以用下面的setInterval来实现均匀的
audioObject.ontimeupdate = function(){
  $('.music-progress .progress-current').style.width = this.currentTime / this.duration * 100 + '%'
  // var min = Math.floor(this.currentTime / 60)
  // var sec = Math.floor(this.currentTime % 60)
  // sec = sec >= 10 ? sec : ('0' + sec)
  // $('.music-progress .time').innerText = min + ':' + sec
}
//音乐播放，通过setInterval，每一秒更新一下时间
  audioObject.onplay = function(){
    setPlayIcon()
    clock = setInterval(function(){
      var min = Math.floor(audioObject.currentTime / 60)
      var sec = Math.floor(audioObject.currentTime % 60) + ''
      sec = sec.length === 2 ? sec : ('0' + sec)
      $('.music-progress .time').innerText = min + ':' + sec
    }, 1000)
  }
  //音乐停止,清除掉setInterval
  audioObject.onpause = function(){
    setPlayIcon()
    clearInterval(clock)
  }
//点击进度条实现音乐定位
$('.music-progress .bar').onclick = function(e){
  console.log(getComputedStyle(this).width)
  var barPercent = e.offsetX / parseInt(getComputedStyle(this).width)
  $('.music-progress .progress-current').style.width = barPercent * 100 + '%'
  audioObject.currentTime = barPercent * audioObject.duration
}

//点击播放下一曲按钮，播放下一曲
$('.musicpanel .fa-step-forward').onclick =function(){
  currentIndex = (++currentIndex) % musicList.length
  loadMusic(musicList[currentIndex]) 
}
//点击播放上一曲按钮，播放上一曲
$('.musicpanel .fa-step-backward').onclick =function(){
  currentIndex = (musicList.length + --currentIndex) % musicList.length
  loadMusic(musicList[currentIndex])
}
//每次play和pause之前设置下图片，放在出错。比如说音乐结束，图片变成play样式
function setPlayIcon(){
  if(audioObject.paused){
    $('.musicpanel i:nth-child(2)').classList.remove('fa-pause')
    $('.musicpanel i:nth-child(2)').classList.add('fa-play')
  }else{
    $('.musicpanel i:nth-child(2)').classList.remove('fa-play')
    $('.musicpanel i:nth-child(2)').classList.add('fa-pause')
  }
}