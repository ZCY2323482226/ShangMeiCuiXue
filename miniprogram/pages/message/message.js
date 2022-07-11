// pages/message/message.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickname:'未知用户',
        avatar:'https://6e73-nsedu-0geuprrl4b1a75d6-1311608272.tcb.qcloud.la/image/boy-icon.png?sign=74aa0e126b387809dc9480c3153aac8e&t=1653442527',
        // 借用于存放用户信息
        userinfo:{},
        // 整体聊天信息
        all_message_data:{}
    },
    // 通知跳转
    notice_route(){
        wx.navigateTo({
          url: '/pages/notice/notice',
        }).then(res=>{
            console.log(res);
        })
    },
    // 聊天页面跳转
    chat(e){
        console.log(e.currentTarget.dataset);
        wx.navigateTo({
          url: '/pages/chat/chat',
        }).then(res =>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.message_data})
            res.eventChannel.emit('item', { data: e.currentTarget.dataset.message_item})
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
        })
        // this.watchgetchat()
        this.get_message_data()
        // this.watchpostchat()
    },
    // test
    dianji(){
        const db = wx.cloud.database()
        db.collection('private_letter').add({
            data:{
                recipientOpenid:'oOaoT47r1lJ7D3zCLzk1vYZWDQT4',
                sendOpenid:'oOaoT43l_Ykph9Mbuyc0YfYR5x9w',
                content:'针不戳',
                time:new Date().getTime(),
                isnotread:0
            }
        })
    },
    // 未读变已读
    read(){
        let id = 'f6e08a64628c41d704da30c131426697'
        const db = wx.cloud.database()
        db.collection('private_letter').doc(id).update({
            data:{
                isnotread:1
            }
        }).then(res=>{
            console.log(res);
        })
        
    },
    // 获取聊天信息
    get_message_data(){
        const db = wx.cloud.database()
        let that = this
        let openid = wx.getStorageSync('openid')
        const _ = db.command
        const watch = db.collection('private_letter')
        .orderBy('time','desc')
        .where(_.or([
            {
                recipientOpenid:openid
            },
            {
                sendOpenid:openid
            }
        ]))
        // 发起监听
        .watch({
            onChange: function(snapshot) {
                console.log(snapshot);
                // 对消息进行分类
                if(snapshot.type === 'init'){
                    let message_data = snapshot.docs
                    that.classification(message_data).then(new_message_data=>{
                        console.log(new_message_data);
                        that.setData({
                            all_message_data:new_message_data
                        })
                    })
                }else{
                    let message_data =snapshot.docChanges
                    that.updateClassification(message_data)
                }
            },
            onError: function(err) {
            console.error('the watch closed because of error', err)
            }
        })
    },
    // 查询发送用户信息
    checkuserinfo(recipientOpenid){
        return new Promise((resolve, reject)=>{
            let that = this
            wx.cloud.callFunction({
                name:"getuserinfo",
                data:{
                    openid:{openid:recipientOpenid}
                }
            }).then(res=>{
                resolve(res.result) 
            })
        })
    },
    // 更新分类
    updateClassification(messageData){
        let message_data = this.data.all_message_data
        let openid = wx.getStorageSync('openid')
        for(let value of messageData){
            let doc = value.doc
            let sendopenid = doc.sendOpenid
            let recipientOpenid = doc.recipientOpenid
            let newallmessage
            let newisnotread
            if(sendopenid !== openid){
                newallmessage = message_data[sendopenid].allmessage
                newisnotread = message_data[sendopenid].isnotread
            }else{
                newallmessage = message_data[recipientOpenid].allmessage
                newisnotread = message_data[recipientOpenid].isnotread
            }
            if(value.dataType === 'update' || value.dataType === 'add'){
                if (doc.isnotread === 0 && recipientOpenid === openid) newisnotread.push(doc)
                else newisnotread.splice(newisnotread.indexOf(doc), 1)
            }
            if(value.dataType !== 'add') continue
            newallmessage.push(doc)
        }
        this.setData({
            all_message_data:message_data
        })
    },
    // 初始分类
    classification(message_data){
        let openid = wx.getStorageSync('openid')
        let new_message_data = {}
        let that = this
        for(let value of message_data){
            if(value.sendOpenid === openid){
                if(value.recipientOpenid in new_message_data){
                    new_message_data[value.recipientOpenid].allmessage.unshift(value)
                } 
                else {
                    new_message_data[value.recipientOpenid] = {allmessage:[value],isnotread:[]}
                }
            }else{
                if(value.sendOpenid in new_message_data){
                    new_message_data[value.sendOpenid].allmessage.unshift(value)
                } 
                else {
                    new_message_data[value.sendOpenid] = {allmessage:[value],isnotread:[]}
                }
                if (value.isnotread === 0) new_message_data[value.sendOpenid].isnotread.unshift(value)
            }
        }
        return new Promise((resolve, reject)=>{
            for(let key in new_message_data){
                that.checkuserinfo(key).then(res=>{
                    new_message_data[key]['userinfo'] = res
                    resolve(new_message_data)
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        wx.hideLoading()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

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