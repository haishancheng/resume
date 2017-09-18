function $(val){
  return document.querySelector(val)
}
function $$(val){
  return document.querySelectorAll(val)
}
//点击右上角图片可切除或者关闭modal
$('header .login').addEventListener('click', function(e){
  e.preventDefault()
  e.stopPropagation()//阻止下面的document事件冒泡，导致在display为none从而导致显示不出来
  if(window.getComputedStyle($('.container')).display == "none"){
    $('.container').style.display = "block"
  }else{
    $('.container').style.display = "none"
  }
})

//点击外部空白也能关闭modal
document.addEventListener('click', function(){
  $('.container').style.display = 'none'
})

//登录modal中的submit的效验
$('.login-modal form').addEventListener('submit', function(e){
  e.preventDefault()
  console.log('ggg')
  var userNameVal = $('.login-modal input[name=username]').value
  var pwdVal = $('.login-modal input[name=password]').value
  if(!/^\w{3,8}$/.test(userNameVal)){
    $('.login-modal .errmsg').innerText = "用户名需输入3-8个字符，包括字母数字下划线"
    return false
  }
  if(!/^\w{6,10}$/.test(pwdVal)){
    $('.login-modal .errmsg').innerText = "密码需输入6-10个字符，包括字母数字下划线"
    return false
  }
  this.submit()
})

//注册modal中的submit的效验
$('.register-modal form').addEventListener('submit', function(e){
  e.preventDefault()
  var name = $('.register-modal input[name=username]').value
  var pwd = $('.register-modal input[name=password]').value
  var confirm = $('.register-modal input[name=confrim]').value
  console.log(name)
  console.log(pwd)
  console.log(confirm)
  if(!/^\w{3,8}$/.test(name)){
    $('.register-modal .errmsg').innerText = "用户名需输入3-8个字符，包括字母数字下划线"
    return false
  }
  if(!/^\w{6,10}$/.test(pwd)){
    $('.register-modal .errmsg').innerText = "密码需输入6-10个字符，包括字母数字下划线"
    return false
  }
  if(confirm !== pwd){
    $('.register-modal .errmsg').innerText = "两次输入的密码不一致"
    return false
  }
  this.submit()
})

// 事件代理(其实就是实现了下面注释掉的所有的事件)
// 1.给登录modal框中的注册绑定事件
// 2.给注册modal框中的登录绑定事件
// 3.点击所有的X图标关闭modal
$('.container').addEventListener('click', function(e){
  // e.preventDefault() //不能添加，添加了就会阻止了表单验证事件
  e.stopPropagation();//阻止点击modal框也会导致冒泡执行document中绑定的事件，使得modal框消失
  if(e.target.classList.contains('register')){
    $('.login-modal').classList.add('flip')
    $('.register-modal').classList.add('flip')
  }
  if(e.target.classList.contains('login')){
    $('.login-modal').classList.remove('flip')
    $('.login-modal').style.transition = '1s'
    $('.register-modal').classList.remove('flip')
    $('.register-modal').style.transition = '1s'
  }
  if(e.target.classList.contains('fa-times')){
    $('.container').style.display = "none"
  }
})

// // 给登录modal框中的注册绑定事件
// $('.login-modal .tabs>a:last-child').addEventListener('click', function(e){
//   e.preventDefault()
//   $('.login-modal').classList.add('flip')
//   $('.register-modal').classList.add('flip')
// })

// // 给注册modal框中的登录绑定事件
// $('.register-modal .tabs>a:first-child').addEventListener('click', function(e){
//   e.preventDefault()
//   $('.login-modal').classList.remove('flip')
//   $('.login-modal').style.transition = '1s'
//   $('.register-modal').classList.remove('flip')
//   $('.register-modal').style.transition = '1s'

// })

//利用闭包实现两个点击所有的X都能关闭modal
// for(var i = 0; i < $$('.close').length; i++){
//   (function(val){
//     $$('.close')[val].addEventListener('click', function(e){
//       e.preventDefault()
//       $('.container').style.display = "none"
//     })
//   })(i)
// }