/*
    启动聊天的服务端程序

*/
//官网拷贝下来的eg
// const express = require("express");
// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });

// io.on("connection", (socket) => {
//   // ...
// });

// httpServer.listen(3000);
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
let users =[]


//一旦有用户连接，触发回调函数
io.on('connection',  socket => {
  console.log('新用户连接了')
//   //监听到客户端的事件login，接收到对象data
  socket.on('login', data => {

    console.log(data)
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
  
    //用户断开连接功能
    //监听用户断开连接
    socket.on('disconnect',() => {
      //把当前用户信息从user中删除
      let idx = users.findIndex(item => item.username === socket.username)
      //删除掉断开连接的人
      users.splice(idx, 1)
      // 1.告诉所有人，有人离开了聊天室
      io.emit('deleteUser',{
          username:socket.username,
          avatar: socket.avatar
      })
      // 2.告诉所有人，userList发生更新
      io.emit('userList',users)
  })
  
  //监听聊天的消息
  socket.on('sendMessage', data => {
      //广播给所有用户
      io.emit('receiveMessage', data)
  })

  //接受图片的信息
  socket.on('sendImage', data => {
      //广播给所有用户
      io.emit('receiveImage', data)
  })

}
  )
