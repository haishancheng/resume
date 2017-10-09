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

//设置musicList的内容
function setMusticListContent(){
  var fragment = document.createDocumentFragment() 
  for(var i = 0; i < musicList.length; i++){
    var musicLi = document.createElement('li')
    musicLi.innerText = musicList[i].title + '-' + musicList[i].auther
    fragment.appendChild(musicLi)
  }
  $('.music-list').appendChild(fragment)
}

//执行getMuscic,获取到music.json中返回的数据,后面的操作都需要这里面的数据。其实可以直接先发ajax，然后在ajax的成功的逻辑中赋值
getMusic(function(resMusicObj){
  musicList = resMusicObj
  loadMusic(musicList[currentIndex])
  audioObject.pause()//首次加载页面暂停
  setMusticListContent() //首次加载获取到所有数据并填充到ul的li中
})

//播放按钮绑定事件
$('.musicpanel .fa-play').onclick = function(){
  if(audioObject.paused){
    audioObject.play()
  }else{
    audioObject.pause()
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
    //每次音乐播放之前先把不是选中的音乐的li的选中背景色删掉
    for(var i = 1; i <= musicList.length; i++) {
      if($(`.music-list li:nth-child(${i})`).classList.contains('music-choose')){
        $(`.music-list li:nth-child(${i})`).classList.remove('music-choose')
      }
    }
    //然后在添加选中背景到相应的li
    $(`.music-list li:nth-child(${currentIndex + 1})`).classList.add('music-choose')
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
$('.musicpanel .fa-step-forward').onclick = function(){
  currentIndex = (++currentIndex) % musicList.length
  loadMusic(musicList[currentIndex]) 
}
//点击播放上一曲按钮，播放上一曲
$('.musicpanel .fa-step-backward').onclick = function(){
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

//点击音乐列表按钮出现音乐列表
$('.fa-bars').onclick = function(){
  if($('.music-list').classList.contains('display-music-list')){
    $('.music-list').style.display = 'none'
    $('.music-list').classList.remove('display-music-list')
  }else{
    $('.music-list').style.display = 'block'
    requestAnimationFrame(function(){
      $('.music-list').classList.add('display-music-list')
    })
  }
}

//点击音乐列表中的对应项，播放相应音乐，事件代理实现
$('.music-list').addEventListener('click', function(e){
  var liList = $$('.music-list > li')
  for(var i = 0; i < liList.length; i++){
    if(e.target === liList[i]){
      currentIndex = i
      loadMusic(musicList[currentIndex])
    }
  }
})

//播放完毕列表循环
audioObject.onended = function(){
  currentIndex = (++currentIndex) % musicList.length
  loadMusic(musicList[currentIndex]) 
}
