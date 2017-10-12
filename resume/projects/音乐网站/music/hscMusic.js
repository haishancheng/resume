function $(val){
    return document.querySelector(val)
}
function $$(val){
    return document.querySelectorAll(val)
}
var channelsList
var currentChannelObj
var currentSongObj
var audioObject = new Audio()
audioObject.autoplay = true;

function getChannels(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('get', 'https://jirenguapi.applinzi.com/fm/getChannels.php', true)
    xhr.onload = function(){
        if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304){
            // console.log(xhr.responseText)
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
    var currentSongObj = resSong[0]
    console.log("当前歌曲的obj：", currentSongObj)
    $('main .song-pic img').src = resSong[0].picture
    $('main .song-show-right .song-name').innerText = resSong[0].title
    $('main .song-show-right .author').innerText = resSong[0].artist
    $('main .song-show-right .album .album-name').innerText = currentChannelObj.name
}
//先获取频道
getChannels(function(resChannels){
    for(var i = 0; i < 6; i++){
        $$('footer figure p')[i].innerText = resChannels[i].name
    }
    channelsList = resChannels
    console.log('所有频道的obj:', channelsList)
    currentChannelObj = channelsList[0]
    console.log('当前频道id:', currentChannelObj.channel_id)
    //获取频道完了加载歌曲
    getSong(currentChannelObj.channel_id, function(resSong){
        loadSong(resSong)
    })
})

//最下面的频道导航栏中左右两个按钮的划入，划出效果
$('footer').onmouseenter = function(){
    $('footer .pre-bar-in').classList.remove('pre-bar-out')
    $('footer .next-bar-in').classList.remove('next-bar-out')
}
$('footer').onmouseleave = function(){
    $('footer .pre-bar-in').classList.add('pre-bar-out')
    $('footer .next-bar-in').classList.add('next-bar-out')
}
