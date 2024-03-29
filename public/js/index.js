/*
    聊天室的主要功能
*/ 
/*
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

// //接受返回查询结果
// socket.on('checkoutAnswer',data => {
//   console.log(data.msg)
//   if(data.msg === '用户名不存在') {  
//      //用户名不存在
//     alert('此用户不存在')
//   }else if(data.msg === '用户密码正确'){
//      //跳转到聊天室
//      $('.login_box').fadeOut()
//      $('.container').fadeIn()
//      // 需要告诉socket io服务，登录
//      //这里的头像需要查询数据库获取
//         socket.emit('login',{
//         username: username,
//         avatar: 'images/avatar01.jpg'
//     }) 
//   } else if(data.msg === '用户密码错误'){
//     //密码错误
//     alert('密码输入错误，请重新输入')
//     return
//   }
// })


// //监听登陆失败的请求
socket.on('loginError', data => {
    alert('登陆失败了')
})

// //监听登陆成功的请求
socket.on('loginSuccess', data => {
    // 需要显示聊天窗口 淡入效果
    // 需要隐藏登陆窗口 淡出效果
    $('.login_box').fadeOut()
    $('.container').fadeIn()
    //设置个人信息 显示在界面上
    $('.avatar_url').attr('src', data.avatar)
    $('.user-list .username').text(data.username)

    username = data.username
    avatar = data.avatar

})


// //监听添加用户的消息
socket.on('addUser',data => {
    //添加一条系统消息
    $('.box-bd').append(`
    <div class="system">
        <p class="message_system">
            <span class="content">"${data.username}"加入了群聊</span>
        </p>
    </div>
    `)
    scrollIntoView()      
})

// // 监听用户列表消息
socket.on('userList',data => {
    //打印出来
    // console.log(data)
    //更新列表之前先清空
    $('.user-list ul').html('')
    data.forEach( item => {
        $('.user-list ul').append(`
          <li class="user">
            <div class="avatar"><img src="${item.avatar}" alt="" /></div>
            <div class="name">${item.username}</div>
          </li> 
        `)
    })

    //更新用户数
    $('#userCount').text(data.length)
})

//监听用户离开的消息
socket.on('deleteUser',data => {
    //添加一条系统消息
    $('.box-bd').append(`
    <div class="system">
        <p class="message_system">
            <span class="content">"${data.username}"离开了群聊</span>
        </p>
    </div>
    `)
    scrollIntoView()
})   

$('#btn-send').on('click',function() {
    //获取到聊天的内容
    //html()可加入到表情元素
    var content = $('#content').html()
    // console.log(content)
    //清空输入框
    $('#content').html('')
    if(!content) return alert('请输入内容')

    //发送给服务器
    socket.emit('sendMessage',{
        msg: content,
        username: username,
        avatar: avatar
    })
})

//监听聊天的消息
socket.on('receiveMessage', data => {
    //把接收到的消息显示到聊天窗口中
    if(data.username === username) {
        //自己的消息
        $('.box-bd').append(`
      <div class="message-box">
        <div class="my message">
          <img class="avatar" src="${data.avatar}" alt="" />
          <div class="content">
            <div class="bubble">
              <div class="bubble_cont">${data.msg}</div>
            </div>
          </div>
        </div>
      </div>
        `)
    } else {
        //别人的消息
        $('.box-bd').append(`
         <div class="message-box">
            <div class="other message">
              <img class="avatar" src="${data.avatar}" alt="" />
              <div class="content">
                <div class="nickname">${data.username}</div>
                <div class="bubble">
                  <div class="bubble_cont">${data.msg}</div>
                </div>
              </div>
            </div>
          </div>
        `)
    }

    scrollIntoView()
})

function scrollIntoView() {
  //当前元素（最近一条消息）底部滚动到可视区
    //找到.box-bd最后一个子元素
    $('.box-bd').children(':last').get(0).scrollIntoView(false)
}

// 发送图片功能
//onchange() 表示文件被选择 换文件
$('#file').on('change', function() {
  var file = this.files[0]

  //需要把这个文件发送到服务器，借助于H5新增的fileReader
  var fr = new FileReader()
  fr.readAsDataURL(file)
  fr.onload = function() {
    socket.emit('sendImage',{
      username:username,
      avatar:avatar,
      img: fr.result
    })
  }
})

// 监听图片的聊天信息
socket.on('receiveImage', data => {
  //把接收到的消息显示到聊天窗口中
  if(data.username === username) {
      //自己的消息
      $('.box-bd').append(`
    <div class="message-box">
      <div class="my message">
        <img class="avatar" src="${data.avatar}" alt="" />
        <div class="content">
          <div class="bubble">
            <div class="bubble_cont">
              <img src="${data.img}"/>
            </div>
          </div>
        </div>
      </div>
    </div>
      `)
  } else {
      //别人的消息
      $('.box-bd').append(`
       <div class="message-box">
          <div class="other message">
            <img class="avatar" src="${data.avatar}" alt="" />
            <div class="content">
              <div class="nickname">${data.username}</div>
              <div class="bubble">
                <div class="bubble_cont">
                  <img src="${data.img}"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      `)
  }

  //等待图片加载完成
  $('.box-bd img :last').on('load',function() {
      scrollIntoView()
  })

})

//显示表情
$('.face').on('click',function() {
  $('#content').emoji({
    button:'.face',
    showTab:true,
    animation: 'slide',
    position: 'topRight',
    icons: [{
      name: "贴吧表情",
      path: "lib/jquery-emoji/img/tieba/",
      maxNum: 50,
      file: ".jpg",
      placeholder: ":{alias}:",
      alias: {
          1: "hehe",
          2: "haha",
          3: "tushe",
          4: "a",
          5: "ku",
          6: "lu",
          7: "kaixin",
          8: "han",
          9: "lei",
          10: "heixian",
          11: "bishi",
          12: "bugaoxing",
          13: "zhenbang",
          14: "qian",
          15: "yiwen",
          16: "yinxian",
          17: "tu",
          18: "yi",
          19: "weiqu",
          20: "huaxin",
          21: "hu",
          22: "xiaonian",
          23: "neng",
          24: "taikaixin",
          25: "huaji",
          26: "mianqiang",
          27: "kuanghan",
          28: "guai",
          29: "shuijiao",
          30: "jinku",
          31: "shengqi",
          32: "jinya",
          33: "pen",
          34: "aixin",
          35: "xinsui",
          36: "meigui",
          37: "liwu",
          38: "caihong",
          39: "xxyl",
          40: "taiyang",
          41: "qianbi",
          42: "dnegpao",
          43: "chabei",
          44: "dangao",
          45: "yinyue",
          46: "haha2",
          47: "shenli",
          48: "damuzhi",
          49: "ruo",
          50: "OK"
      },
      title: {
          1: "呵呵",
          2: "哈哈",
          3: "吐舌",
          4: "啊",
          5: "酷",
          6: "怒",
          7: "开心",
          8: "汗",
          9: "泪",
          10: "黑线",
          11: "鄙视",
          12: "不高兴",
          13: "真棒",
          14: "钱",
          15: "疑问",
          16: "阴脸",
          17: "吐",
          18: "咦",
          19: "委屈",
          20: "花心",
          21: "呼~",
          22: "笑脸",
          23: "冷",
          24: "太开心",
          25: "滑稽",
          26: "勉强",
          27: "狂汗",
          28: "乖",
          29: "睡觉",
          30: "惊哭",
          31: "生气",
          32: "惊讶",
          33: "喷",
          34: "爱心",
          35: "心碎",
          36: "玫瑰",
          37: "礼物",
          38: "彩虹",
          39: "星星月亮",
          40: "太阳",
          41: "钱币",
          42: "灯泡",
          43: "茶杯",
          44: "蛋糕",
          45: "音乐",
          46: "haha",
          47: "胜利",
          48: "大拇指",
          49: "弱",
          50: "OK"
      }
  }, {
      name: "QQ高清",
      path: "lib/jquery-emoji/img/qq/",
      maxNum: 91,
      excludeNums: [41, 45, 54],
      file: ".gif",
      placeholder: "#qq_{alias}#"
  }, {
      name: "emoji高清",
      path: "lib/jquery-emoji/img/emoji/",
      maxNum: 84,
      file: ".png",
      placeholder: "#emoji_{alias}#"
  }]

  })
})

// //截图功能
// $('.screen-cut').on('click',function() {
//   let url = 'localhost:3000' 
//   socket.emit('webshot',url)
// })
