// pages/chat/chat.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data:{
        // 是否离开该页面
        isnotleave:true,
        // 我的openid
        openid:'',
        // Ta 的openid
        Taopenid:'',
        // 聊天数据
        message_data:{},
        // 我的信息
        Myinfo:{},
        // Ta的信息
        Tainfo:{},
        statsuBarHeight: app.globalData.statsuBarHeight,
        avatar:'cloud://nsedu-0geuprrl4b1a75d6.6e73-nsedu-0geuprrl4b1a75d6-1311608272/image/boy-icon.png',
        heavatar:'cloud://nsedu-0geuprrl4b1a75d6.6e73-nsedu-0geuprrl4b1a75d6-1311608272/image/girl-icon.png',
        hemessage:'hello worldhello worldhello worldhello worldhello world',
        headHeight:40,
        chatListHeight:0,
        keyboardHeight:0,
        messageList:[],
        inutPanelHeight:50,
        toView: "item0",
        scrollTop:0,
        windowHeight: 0,
        curMessage:"",
      },
      back(){
        wx.navigateBack({
            delta: 1
        })
      },
      scroll2Bottom(){
        //page scroll-view 的 id 属性
        let that = this
        const query = wx.createSelectorQuery()
        query.select('#page').scrollOffset()
        query.exec(function(res){
            that.setData({
                scrollTop:res[0].scrollHeight,   
            })
        })
      },
      setChatListHeight() {
        this.setData({
          chatListHeight: app.globalData.sysHeight - app.globalData.statsuBarHeight - this.data.headHeight - this.data.keyboardHeight- this.data.inutPanelHeight
        })
        console.log(this.data.chatListHeight);
      },
      hideKeyboard(){
        wx.hideKeyboard();
        // this.hideMediaPanel();
      },

      getInput(e){
        let value = e.detail.value;
        this.setData({
          curMessage: value
        });
      },
      send() {
        let that =this
        let curMessage = this.data.curMessage;
        if (curMessage.trim() === "") {
          wx.showToast({
            title: '请输入聊天内容',
            duration: 2000,
            icon: "none"
          })
          return;
        }
        let message_data = this.data.message_data;
        let allmessage = message_data.allmessage
        allmessage.push({
            content:curMessage,
            isnotread:0,
            recipientOpenid:that.data.Taopenid,
            sendOpenid:that.data.openid,
            time:new Date().getTime()
        })
        let new_message_data = {
            ...message_data,
            allmessage
        }
        this.setData({
          curMessage:"",
          message_data:new_message_data
        })
        console.log('发送');
        this.sendMessageDB(allmessage[allmessage.length-1])
        this.scroll2Bottom()
      },
    // 发送消息-添加到数据库
    sendMessageDB(new_message_data){
        const db = wx.cloud.database()
        db.collection('private_letter').add({
            data:new_message_data
        })
    },
    //  获取Ta的openid
    getData(){
        // 获取openid
        let openid = wx.getStorageSync('openid')
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('data', function(data) {
            console.log(data);
            that.setData({
                Taopenid:data.data,
                openid:openid
            })
        })
        // 历史信息
        eventChannel.on('item', function(data) {
            console.log(data);
            let allmessage = data.data.allmessage
            let message_data = {
                ...data.data,
                allmessage:allmessage
            }
            for (let value of allmessage){
                if (value.recipientOpenid ===openid &&value.isnotread === 0){
                    let id = value._id
                    console.log(id);
                    wx.cloud.callFunction({
                        name:'update',
                        data:{
                            collection:'private_letter',
                            where:{
                                _id:id
                            },
                            data:{
                                isnotread:1
                            }
                        }
                    }).then(res=>{
                        console.log(res);
                    })
                    // const db = wx.cloud.database()
                    // db.collection('private_letter').doc(id).update({
                    //     data:{
                    //         isnotread:1
                    //     }
                    // }).then(res=>{
                    //     console.log('cehngg');
                    //     console.log(res);
                    // })
                }
            }
            that.setData({
                message_data:message_data,
                Tainfo:data.data.userinfo
            })
        })
    },
    // 监听聊天信息
    watchMessage(){
        const db = wx.cloud.database()
        let that =this
        let Taopenid = this.data.Taopenid
        const watch = db.collection('private_letter')
        .orderBy('time','desc')
        .where({
            sendOpenid:Taopenid,
            recipientOpenid:that.data.openid
        })
        .watch({
            onChange:function(snapshot){
                console.log(snapshot);
                if(snapshot.type !== "init" && snapshot.docChanges[0].queueType === 'enqueue'){
                    let oldmessage = that.data.message_data
                    let allmessage = oldmessage.allmessage
                    for(let value of snapshot.docChanges){
                        allmessage.push(value.doc)
                        if(!that.data.isnotleave){
                            // 未读变已读
                            let id = value.doc._id
                            wx.cloud.callFunction({
                                name:'update',
                                data:{
                                    collection:'private_letter',
                                    where:{
                                        _id:id
                                    },
                                    data:{
                                        isnotread:1
                                    }
                                }
                            }).then(res=>{
                                console.log(res);
                            })
                            }
                        }
                    if(!that.data.isnotleave){
                        console.log('dsdfs');
                        let new_message_data = {
                            ...oldmessage,
                            allmessage
                        }
                        that.setData({
                            message_data:new_message_data
                        })
                        that.scroll2Bottom()
                    }
                }
            },
            onError: function(err) {
                console.error('the watch closed because of error', err)
            }
        })
        // return watch
    },
    // 查询我的信息
    getmyinfo(){
        let that =this
        let openid = this.data.openid
        wx.cloud.callFunction({
            "name":"getuserinfo",
            data:{
                openid:{openid:openid}
            }
        }).then(res=>{
            that.setData({
                Myinfo:res.result
            })
            console.log(res);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getData()
        this.getmyinfo()
        this.setChatListHeight();
        this.scroll2Bottom(); 
        wx.onKeyboardHeightChange(res => { //监听键盘高度变化
          this.setData({
            keyboardHeight: res.height
          });       
          this.setChatListHeight();
          this.scroll2Bottom();        
        });
        this.watchMessage()
    },
      

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        var height = wx.getSystemInfoSync().windowHeight;
        this.setData({
        windowHeight: height
        })
        this.scroll2Bottom();  
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // this.setChatListHeight();
        // this.scroll2Bottom(); 
        // wx.onKeyboardHeightChange(res => { //监听键盘高度变化
        //   this.setData({
        //     keyboardHeight: res.height
        //   });       
        //   this.setChatListHeight();
        //   this.scroll2Bottom();        
        // });
        this.scroll2Bottom();
        this.setChatListHeight()
        this.setData({
            isnotleave:false
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        // const watch =  this.watchMessage()
        // watch.close()
        console.log('页面卸载');
        this.setData({
            isnotleave:true
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})