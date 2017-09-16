function $(val){
  return document.querySelector(val)
}
function $$(val){
  return document.querySelectorAll(val)
}

$('header .login').addEventListener('click', function(e){
  e.preventDefault()
  if(window.getComputedStyle($('.modal')).display == "none"){
    $('.modal').style.display = "block"
  }else{
    $('.modal').style.display = "none"
  }
})


$('.login-modal form').addEventListener('submit', function(e){
  e.preventDefault()
  var userNameVal = $('.login-modal input[name=username]').value
  var pwdVal = $('.login-modal input[name=password]').value
  console.log(userNameVal)
  if(!/^\w{3,8}$/.test(userNameVal)){
    $('.login-modal .errmsg').innerText = "用户名需输入3-8个字符，包括字母数字下划线"
    return false;
  }
  if(!/^\w{6,10}$/.test(pwdVal)){
    $('.login-modal .errmsg').innerText = "密码需输入6-10个字符，包括字母数字下划线"
    return false;
  }
  this.submit()
})