### Nodejs-WebSocket

#### nodejs-websocket介绍

websocket是一个双工连接协议，旨在保持客户端与服务端的连接，解决了http协议的需要轮询服务器造成服务器资源的浪费

这个我们使用的是nodejs-websocket，它封装了Websocket，便于在nodejs服务器上使用

nodejs-websocket 的Github地址：https://github.com/sitegui/nodejs-websocket



#### 使用

##### 服务端

准备：vscode 

​			安装了npm

在服务器终端输入下面代码安装nodejs-websocket

~~~js
	 npm i nodejs-websocket
~~~

How to use？

~~~js
	const ws =require('nodejs-websocket')

	const server = new ws.createServer((conn)=>{
        conn.on('text',(result)=>{
            console.log('客户端发来消息：' + result )
            conn.on('sendTest','服务器已连接')
        })
        
    })
    
    server.listen(8000,()=>{
        console.log('服务器已启动，监听端口为8000')
    })
~~~

##### 客户端

因为浏览器的引擎已经集成了websocket的API,我们直接调用即可

~~~js
const socket = new WebSocket(ws://127.0.0.1:8000)
socket.addEventListener('open',()=>{
    console.log('服务器已连接')
})
socket.addEventListener('close',()=>{
    console.log('服务器已断开')
})
socket.addEventListener('message',(msg)=>{
    console.log('收到服务器消息：' + msg.data)
})

socket.send('向服务器发送的内容')


~~~



