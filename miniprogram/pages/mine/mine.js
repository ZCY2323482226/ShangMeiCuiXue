// pages/mine/mine.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl:'../../assets/icon/start_avatar.jpg',
        nickname:'点击登录',
        dbinfo:false,
        // 判断storage 中是否有 openid
        openidHava:true,
        noreader_message:'',
    },
    // 我的点赞跳转
    myLike_route(){
        wx.navigateTo({
            url: '/pages/myLike/myLike',
            success:res=>{
                console.log(res);
            }
          })
    },
    // 我的消息跳转
    message_route(){
        wx.navigateTo({
          url: '/pages/message/message',
          success:res=>{
              console.log(res);
          }
        })
    },
    // 我的微贴跳转
    myPosts_route(){
        wx.navigateTo({
            url: '/pages/myPosts/myPosts',
            success:res=>{
                console.log(res);
            }
          })
    },
    // 个人主页路由跳转
    geren_route(){
        wx.navigateTo({
          url: '/pages/homepage/homepage',
          success:res=>{
              console.log(res);
          }
        })
    },
    // 数据库中不存在，上传头像和昵称
    upload(){
        let that = this
        let dbinfo = this.data.dbinfo
        console.log(dbinfo);
        if (!dbinfo){
            wx.getUserProfile({
                desc: '需要获取您的用户信息',
                success:res=>{
                    that.setData({
                        avatarUrl:res.userInfo.avatarUrl,
                        nickname:res.userInfo.nickName,
                        dbinfo:true // 防止多次获取信息
                    })
                    that.setopenid().then(res=>{
                        // 上传到数据库中,增加
                        let openid = wx.getStorageSync('openid')
                        let avatarUrl = this.data.avatarUrl
                        let nickname =this.data.nickname
                        wx.cloud.callFunction({
                            name:'adduserinfo',
                            data:{
                                openid:openid,
                                avatarUrl:avatarUrl,
                                nickname:nickname
                            }
                        })
                        .then(res=>{
                            console.log('ZHHE');
                            console.log(res);
                        })
                    })
                }
            })
        }
    },
    //设置openid
    setopenid(){
        return new Promise((resolve,reject)=>{
            let openid = wx.getStorageSync('openid')
            let that = this
            // 如果 storage 中不存在 openid 就存入 storage 中并存入数据库中
            if (!openid){
                this.setData({
                    openidHava:false
                })
                wx.cloud.callFunction({
                    name:"getopenid"
                })
                .then(res=>{
                    // 存入storage中
                    let openid = res.result.openid;
                    wx.setStorageSync('openid', openid)
                    that.setData({
                        openidHava:true
                    })
                    return res
                })
                .then(res =>{
                    // 数据库中不存在，就存入数据库中
                    if(res.result.dbOpenid.length === 0){
                        wx.cloud.callFunction({
                            name:'addopenid',
                            data:{
                                openid:res.result.openid
                            }
                        }).then(res=>{
                            console.log(res);
                            console.log('openid 插入数据库成功');
                            resolve('openid 插入数据库成功')
                        })
                    }else{
                        resolve('存在于数据库中')
                        console.log('存在于数据库中');
                    }
                })
            }
        })
    },
    // 获取用户信息
    getinfo(){
        let that = this
        let openid = wx.getStorageSync('openid')
        wx.cloud.callFunction({
            name:'getuserinfo',
            data:{
                openid:{openid:openid}
            }
        }).then(res=>{
            let result = res.result
            if (result){
                that.setData({
                    avatarUrl:result.avatarUrl,
                    nickname:result.nickname,
                    dbinfo:true
                })
            }
        })
    },
    // test
    dianji(){
        const db = wx.cloud.database()
        db.collection('private_letter').add({
            data:{
                recipientOpenid:'oOaoT47r1lJ7D3zCLzk1vYZWDQT4',
                sendOpenid:'oOaoT43l_Ykph9Mbuyc0YfYR5x9w',
                content:'好',
                time:new Date().getTime(),
                isnotread:0
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.watchchat()
        // this.get_noreader_message()
        wx.showLoading({
            title: '加载中',
          })
        // this.setopenid()
        if (this.data.openidHava){
            this.getinfo()
        }
        wx.hideLoading()
    },
    //监听聊天信息
    watchchat(){
        let that = this
        let recipientOpenid = wx.getStorageSync('openid')
        console.log('ddd');
        const db = wx.cloud.database()
        const watch = db.collection('private_letter')
        .orderBy('time','desc')
        .limit(10)
        .where({
            recipientOpenid:recipientOpenid,
            isnotread:0
        })
        // 发起监听
        .watch({
            onChange: function(snapshot) {
                let noreader_message = snapshot.docs.length
                // let noreader_message = that.data.noreader_message + 1
                that.setData({
                    noreader_message:noreader_message
                })
            },
            onError: function(err) {
            console.error('the watch closed because of error', err)
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        
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