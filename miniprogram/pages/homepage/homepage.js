// pages/homepage/homepage.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:'',
        avatarUrl:'../../assets/icon/start_avatar.jpg',
        nickname:'',
        grade:'--',
        age:'--',
        gender:'--',
        hobby:'--',
        canvases:'--',
        birthday:'--',
        userinfo:{},
        // 生日的时间戳，用来传递
        birthdayTimeStamp:0,
        ifnotcheck:false
    },
    fix_route(){
        let that = this
        wx.navigateTo({
          url: '/pages/fixinformation/fixinformation',
          success:res=>{
            res.eventChannel.emit('user', { data:  this.data})
              console.log('跳转成功');
          },
          fail:res=>{
              console.log(res);
          }
        })
    },
    // 查询历史聊天信息
    getHistorymesage(){
        return new Promise((resolve, reject)=>{
            let Authoropenid = this.data.openid
            let Myopenid = wx.getStorageSync('openid')
            const db = wx.cloud.database()
            const _ = db.command
            const res = db.collection('private_letter')
            .orderBy('time','desc')
            .where(_.or([
                {
                    recipientOpenid:Myopenid,
                    sendOpenid:Authoropenid
                },
                {
                    recipientOpenid:Authoropenid,
                    sendOpenid:Myopenid
                }
            ])).get().then(res=>{
                resolve(res.data)
            })
        })
    },
    // 跳转到聊天页面
    pushlish_message(){
        let that = this
        let Authoropenid = this.data.openid
        let Myopenid = wx.getStorageSync('openid')
        if (Myopenid === ''){
            wx.showToast({
                title: '请先登录',
                icon:"error"
              })
            return
        }
        if (Myopenid === Authoropenid){
            wx.showToast({
              title: '对象不能是自己',
              icon:"error"
            })
            return
        }
        this.getHistorymesage().then(data=>{
            console.log(data);
            const newdata = {
                allmessage:data,
                userinfo:{
                    nickname:that.data.nickname,
                    avatarUrl:that.data.avatarUrl
                }
            }
            wx.navigateTo({
            url: '/pages/chat/chat',
            }).then(res=>{
                res.eventChannel.emit('data', { data: Authoropenid})
                res.eventChannel.emit('item', { data: newdata})
            })
        })
    },
    // 根据时间戳，算出具体年月日
    filterAge(dat){
        let date = new Date(dat)
        let y = date.getFullYear()
        let m = date.getMonth()+1
        let d = date.getDay()
        let current = `${y}年${m}月${d}日`
        return current
    },
    
    getdata(){
        let that = this
        let openid = wx.getStorageSync('openid')
        wx.cloud.callFunction({
            name:'get',
            data:{
                collection:'user',
                where:{
                    openid:openid
                }
            }
        })
        .then(res=>{
            console.log('获取信息成功');
            let data = res.result[0]
            let birthday = that.filterAge(data.birthday)
            that.setData({
                ...data,
                birthday:birthday,
                birthdayTimeStamp:data.birthday
            })
        })
    },
    // 查看发布者信息
    checkpushlisherinfo(){
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('data', function(data) {
            let pushlisherinfo = data.data
            console.log(pushlisherinfo);
            let birthday = that.filterAge(pushlisherinfo.birthday)
            that.setData({
                ifnotcheck:true,
                openid:pushlisherinfo.openid,
                nickname:pushlisherinfo.nickname,
                avatarUrl:pushlisherinfo.avatarUrl,
                grade:pushlisherinfo.grade,
                birthday:birthday,
                gender:pushlisherinfo.gender,
                hobby:pushlisherinfo.hobby,
                canvases:pushlisherinfo.canvases
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
        })
        this.checkpushlisherinfo()
        if(!this.data.ifnotcheck){
            this.getdata()
        }
        // let user = wx.getStorageSync('user')
        // if (user){
        //     this.setData({
        //         avatar:user.userInfo.avatarUrl,
        //         nickname:user.userInfo.nickName
        //     })
        // }
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