// pages/notice/notice.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading:false,
        mylikelist:[],
        mycommentlist:[],
        avatar:"../../assets/icon/start_avatar.jpg",
        nickname:"未知昵称",
        time:"5月2日 22:21",
        content:"tessdfsdfsfsdfsdfs水电费水电费dfsdfsdfsdfssdfsdssdfsdfsdfsdfssdfsddfdsst",
        comment_content:"sdflksjsdjflksdjfsdfsdfsdflkjsdklfjklsjkldjfkljsdl"
    },

    // 点赞跳转
    like_route(e){
        let data = e.currentTarget.dataset.like
        let newdata = {
            commentList:data.allcommentinfo,
            likelist:data.alllikeuserinfo,
            article:data.articleinfo,
            author:data.userinfo
        }
        wx.navigateTo({
          url: '/pages/articledetail/articledetail',
        }).then(res=>{
            res.eventChannel.emit('data', { data: newdata})
            console.log('详情页跳转');
        })
    },
    // 评论跳转
    comment_route(e){
        let data = e.currentTarget.dataset.comment
        let newdata = {
            commentList:data.allcommentinfo,
            likelist:data.alllikeuserinfo,
            article:data.articleinfo,
            author:data.userinfo
        }
        wx.navigateTo({
          url: '/pages/articledetail/articledetail',
        }).then(res=>{
            res.eventChannel.emit('data', { data: newdata})
            console.log('详情页跳转');
        })
    },
    // 获取通知信息
    getNoticeinfo(){
        wx.showLoading({
          title: '加载中',
        })
        const openid = wx.getStorageSync('openid')
        let that = this
        wx.cloud.callFunction({
            name:'getmynotice',
            data:{
                openid:openid
            }
        }).then(res=>{
            let result = res.result
            that.setData({
                mycommentlist:result.mycommentlist,
                mylikelist:result.mylikeinfolist,
                loading:true
            })
            wx.hideLoading()
        }).catch(res=>{
            wx.showToast({
              title: '加载失败',
              icon:"error"
            })
            console.log(res);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getNoticeinfo()
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
        this.getNoticeinfo()
        wx.stopPullDownRefresh();
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