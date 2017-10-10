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
    console.log(resChannels)
})
