// pages/myLike/myLike.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading:false,
        articlelist:[],
        // 点赞按钮标记,true 表示已点赞，false 表示取消赞
        likesign:true,
        avatar:'../../assets/icon/start_avatar.jpg',
        nickname:'未知昵称',
        content:'test',
        time:'05-10 20:42',
        showPopup:false
    },
    // 点击用户头像获取用户信息
    getuserinfo(e){
        let userinfo = e.currentTarget.dataset.userinfo
        wx.navigateTo({
            url: '/pages/homepage/homepage',
          }).then(res=>{
              res.eventChannel.emit('data', { data: userinfo})
          })
    },
    // 查看文章详情
    getarticledetail(e){
        wx.navigateTo({
            url: '/pages/articalDetail2/articalDetail2',
        }).then(res=>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.articledetail})
            console.log('详情页跳转');
        })
    },
    // 点赞按钮
    bindlike(e){
        let index = e.currentTarget.dataset.like;
        let articlelist = this.data.articlelist
        let openid = wx.getStorageSync('openid')
        // 点赞该文章的信息
        let likeinfo = {
            articleId:articlelist[index].article._id,
            likeAuthor_openId:openid,
            time:new Date().getTime()
        }
        if (articlelist[index].likesign){
            this.setData({
                [`articlelist[${index}].likesign`]:false
            })
            // 在数据库中删除点赞信息
            wx.cloud.callFunction({
                name:"addArticleLikeinfo",
                data:{
                    sign:"reduce",
                    likeinfo:likeinfo
                }
            }).then(res=>{
                console.log(res);
            })
            wx.showToast({
                title:'已取消点赞',
                icon:'none'
            })
        }else{
            this.setData({
                [`articlelist[${index}].likesign`]:true
            })
            // 在数据库中增加点赞信息
            wx.cloud.callFunction({
                name:"addArticleLikeinfo",
                data:{
                    sign:"add",
                    likeinfo:likeinfo
                }
            }).then(res=>{
                console.log(res);
            })
            wx.showToast({
                title:'已点赞',
                icon:'none'
            })
        }
    },
    // 取消
    cancel(){
        this.setData({
            showPopup:false
        })
    },
    // 更多
    more(){
        this.setData({
            showPopup:true
        })
    },
    // 关闭更多弹窗
    onClose(){
        this.setData({
            showPopup:false
        })
    },
    getMylike(){
        let that = this
        wx.showLoading({
            title: '加载中',
        })
        let openid = wx.getStorageSync('openid')
        wx.cloud.callFunction({
            name:"getmylikearticle",
            data:{
                openid:openid
            }
        })
        .then(res=>{
            let result = res.result
            that.setData({
                articlelist:result,
                loading:true
            })
            console.log(result);
            wx.hideLoading()
        }).catch(res=>{
            wx.hideLoading()
            console.log(res);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getMylike()
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
        this.getMylike()
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