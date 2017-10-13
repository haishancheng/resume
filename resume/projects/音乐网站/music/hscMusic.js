function $(val){
    return document.querySelector(val)
}
function $$(val){
    return document.querySelectorAll(val)
}
var channelsList
var currentChannelObj
var currentSongObj
var clickFrequency = 0
var audioObject = new Audio()
audioObject.autoplay = true;

//共同函数
function secToMin(second){
    var min = Math.floor(second / 60)
    var sec = Math.floor(second % 60) + ''
    sec = sec.length === 2 ? sec : ('0' + sec)
    return min + ':' + sec
}
function setPlayIcon(){
    if(audioObject.paused){
        $('main .song-show-left .song-ctrl i:nth-child(2)').classList.remove('fa-pause')
        $('main .song-show-left .song-ctrl i:nth-child(2)').classList.add('fa-play')
    }else{
        $('main .song-show-left .song-ctrl i:nth-child(2)').classList.remove('fa-play')
        $('main .song-show-left .song-ctrl i:nth-child(2)').classList.add('fa-pause')
    }
}
function getChannels(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('get', 'https://jirenguapi.applinzi.com/fm/getChannels.php', true)
    xhr.onload = function(){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
            callback(JSON.parse(xhr.responseText).channels)
        }else{
            console.log('获取数据失败')
        }
    }
    xhr.onerror = function(){
        console.log('网络异常')
    }
    xhr.send()
}
function getSong(channelId, callback){
    var xhr = new XMLHttpRequest()
    xhr.open('get', 'https://jirenguapi.applinzi.com/fm/getSong.php?channel=' + channelId, true)
    xhr.onload = function(){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
            callback(JSON.parse(xhr.responseText).song)
        }else{
            console.log('获取数据失败')
        }
    }
    xhr.onerror = function(){
        console.log('网络异常')
    }
    xhr.send()
}
function loadSong(resSong){
    currentSongObj = resSong[0]
    $('main .song-pic img').src = currentSongObj.picture
    $('main .song-show-right .song-name').innerText = currentSongObj.title
    $('main .song-show-right .author').innerText = currentSongObj.artist
    $('main .song-show-right .album .album-name').innerText = currentChannelObj.name
    audioObject.src =  currentSongObj.url
    audioObject.volume = 0.1
    audioObject.addEventListener("canplay", function(){
        $('main .song-show-right .time .total-time').innerText = secToMin(audioObject.duration)
    });//音频准备好才能得到duration，否则得到的是NaN
    console.log("当前歌曲的obj：", currentSongObj)
    console.log('当前频道obj:', currentChannelObj)
}
//先获取频道
getChannels(function(resChannels){
    for(var i = 0; i < $$('footer .album-box p').length; i++){
        $$('footer figure p')[i].innerText = resChannels[i].name
    }
    channelsList = resChannels
    console.log('所有频道的obj:', channelsList)
    currentChannelObj = channelsList[0]
    //获取频道完了加载歌曲
    getSong(currentChannelObj.channel_id, function(resSong){
        loadSong(resSong)
        audioObject.pause()
    })
})
//设置播放的时间以及进度条
audioObject.ontimeupdate = function(){
    $('main .song-show-right .time .current-time').innerText = secToMin(this.currentTime)
    $('main .song-show-right .progress-bar .current-bar').style.width = this.currentTime / this.duration * 100 + '%'
}
//点击进度条
$('main .song-show-right .progress-bar .total-bar').onclick = function(e){
    var barPercent = e.offsetX / parseInt(getComputedStyle(this).width)
    $('main .song-show-right .progress-bar .current-bar').style.width = barPercent * 100 + '%'//不乘以100点击的时候进度条会闪一下
    audioObject.currentTime = barPercent * audioObject.duration
}
//播放按钮事件
$('main .song-show-left .song-ctrl i:nth-child(2)').onclick = function(){
    if(audioObject.paused){
        audioObject.play()
    }else{
        audioObject.pause()
    }
}
//每次播放，按钮变成暂停按钮
audioObject.onplay = function(){
    setPlayIcon()
}
//每次暂停，按钮变成播放按钮
audioObject.onpause = function(){
    setPlayIcon()
}
//下一首按钮事件
$('main .song-show-left .song-ctrl .fa-forward').onclick = function(){
    getSong(currentChannelObj.channel_id, function(resSong){
        loadSong(resSong)
    })
}
//点击收藏按钮变红
$('main .song-show-left .song-ctrl .fa-heart').onclick = function(){
    if(window.getComputedStyle(this).color === 'rgb(255, 255, 255)'){
        this.style.color = '#b95757'
    }else{
        this.style.color = 'rgb(255, 255, 255)'
    }
}

//最下面的频道导航栏中左右两个按钮的划入，划出效果
$('footer').onmouseenter = function(){
    $('footer .pre-bar-in').classList.remove('pre-bar-out')
    $('footer .next-bar-in').classList.remove('next-bar-out')
}
$('footer').onmouseleave = function(){
    $('footer .pre-bar-in').classList.add('pre-bar-out')
    $('footer .next-bar-in').classList.add('next-bar-out')
}
//点击专辑
$('footer').onclick = function(e){
    if(e.target.nodeName === 'IMG'){
        getSong(e.target.getAttribute("channel-id"), function(resSong){
            channelsList.forEach(function(val, index){
                if(e.target.getAttribute("channel-id") === val.channel_id){
                    currentChannelObj = channelsList[index]
                }
            })
            loadSong(resSong)
        })
    }
}
//点击导航栏左右按钮
$('footer .next-bar-in').onclick = function(){
    var pageNum = Math.ceil(channelsList.length/7)
    clickFrequency = (clickFrequency >= pageNum) ? pageNum : ++clickFrequency
    if(clickFrequency < Math.ceil(channelsList.length/7)){
        $('footer .album-box').style.transform = 'translateX(-' + 1920 * clickFrequency + 'px)'
    }
    console.log('clickFrequency', clickFrequency)
}

$('footer .pre-bar-in').onclick = function(){
    var style = $('footer .album-box').getAttribute('style')
    if(style != null && clickFrequency > 1){
        var rightMoveTrans = 1920 - parseInt(style.match(/\d+/g)) 
        $('footer .album-box').style.transform = 'translateX(' + rightMoveTrans + 'px)'
        clickFrequency--
    }
    console.log('clickFrequency', clickFrequency)
}
