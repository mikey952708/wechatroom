### WeChatDemo

#### Socket.io  

Socket.io是对websocket的封装，全双工通信，易用。

eg：在nodejs中引用

~~~js
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)

server.listen(3000,()=>{
    console.log('服务器已启动，3000端口监听中')
})
app.use(require('express').static('public'))
app.get('/', function (req, res) {
  res.redirect('/index.html')
});
let users =[]  //新建用户列表集合
~~~

使用socket.io

~~~js
io.on('connection',  socket => {
  console.log('新用户连接了')
//   //监听到客户端的事件login，接收到对象data
  socket.on('login', data => {
    let user = users.find(item => item.username === data.username)
    if (user) {
      //如果user存在
      socket.emit('loginError', { msg: '用户已登录，登录失败' })
      console.log('登录失败');
    }
    else {
      //将数据存在data
      users.push(data)
      console.log(users)
      // 向客户端发送事件
      socket.emit('loginSuccess', data)

      //所有连接到服务器的用户进行广播
      io.emit('addUser', data)
      io.emit('userList', users)

      //为下面的断开连接做准备
      socket.username = data.username
      socket.avatar = data.avatar
    }
  })
~~~

客户端index.js

~~~js
 1.连接socket io服务
*/
let socket = io('http://127.0.0.1:3000')
let username,avatar
/*
    2.登录功能
*/
// 获取头像
$('#login_avatar li').on('click',function(){
  $(this).addClass('now').siblings().removeClass('now')
})

//点击按钮登录
$('#loginBtn').on('click',function() {
    // 获取用户名
    username = $("#username").val().trim()
    if(!username) {
        alert('请输入用户名')
        return
    }
    // // 获取选择头像
    // //这里的.now很精妙 既加了边框，醒目 又可以通过它来找到所选的头像
    // //attr 获取属性
    avatar = $('#login_avatar li.now img').attr('src')
    // // console.log(username,avatar)

    console.log(username,avatar)
    //需要告诉服务器用户名，让其验证
    socket.emit('login',{
      username : username,
      avatar : avatar
    })

})
~~~

socket.io 基本就是on(事件触发)、emit(事件发送)，io是全局广播，socket是个人通信

其它代码，主要是html和css，这里不再赘述