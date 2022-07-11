// pages/saylovecomment/saylovecomment.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        articleid:'',
        commentContent:'',
        avatar:'../../../assets/icon/start_avatar.jpg',
        nickname:'未知昵称',
        content:'testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest'
    },

    // 监听输入
    bindinput(e){
        this.setData({
            commentContent:e.detail.value
        })
    },
    // 评论跳转
    comment(e){
        wx.navigateTo({
          url: 'pages/biaobaiWall/saylovecomment/saylovecomment',
        }).then(res=>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.articleitem})
        })
    },
    // 提交评论
    comment(){
        console.log(this.data.commentContent);
        let that = this
        let commentContent = this.data.commentContent
        if(commentContent === ''){
            wx.showToast({
                title: '输入内容不能为空',
                icon:'error'
              })
        }else{
            wx.showLoading({
              title: '评论中',
            })
            let openid = wx.getStorageSync('openid')
            const data = {
                articleid:that.data.articleid,
                content:commentContent,
                commentAuthor_openId:openid,
                time: new Date().getTime()
            }
            wx.cloud.callFunction({
                name:"addcomment",
                data:data
            }).then(res=>{
                wx.hideLoading()
                wx.showToast({
                    title: '评论成功',
                    icon:'success'
                  })
                  setTimeout(()=>{
                    wx.navigateBack({
                        delta:1
                    })
                },1000)
            })
        }
        
    },
    // 取消跳转回上一个页面
    cancel(){
        wx.navigateBack({
            delta:1,
        }).then(res=>{
            console.log('取消跳转回上一个页面');
        })
    },
    // 接受上一个路由传过来的数据
    getarticledata(){
        wx.showLoading({
            title: '加载中',
          })
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('data', function(data) {
            let articleitem = data.data
            that.setData({
                avatar:articleitem.author.avatarUrl,
                nickname:articleitem.author.nickname,
                content:articleitem.lovewall.content,
                articleid:articleitem.lovewall._id
            })
            console.log(articleitem);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getarticledata()
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