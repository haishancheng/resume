function $(val){
    return document.querySelector(val)
}
function $$(val){
    return document.querySelectorAll(val)
}
var channelsList;
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
getChannels(function(resChannels){
    for(var i = 0; i < 6; i++){
        $$('footer figure p')[i].innerText = resChannels[i].name
        // console.log(resChannels[i].name)
    }
    console.log(resChannels)
})
//最下面的频道导航栏中左右两个按钮的划入，划出效果
$('footer').onmouseenter = function(){
    $('footer .pre-bar-in').classList.remove('pre-bar-out')
    // $('footer .next-bar-in').classList.remove('next-bar-out')
}
$('footer').onmouseleave = function(){
    $('footer .pre-bar-in').classList.add('pre-bar-out')
    // $('footer .next-bar-in').classList.add('next-bar-out')
}
