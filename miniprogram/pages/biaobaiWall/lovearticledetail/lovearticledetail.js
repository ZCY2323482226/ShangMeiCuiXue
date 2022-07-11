// pages/biaobaiWall/lovearticledetail/lovearticledetail.js
Page({
/**
     * 页面的初始数据
     */
    data: {
        active:0,
        data:{
            articleId:'',
            avatar:'../../assets/icon/start_avatar.jpg',
            nickname:'',
            title:'我是标题',
            content:'',
            views:123,
            time:'',
            likecount:0,
        },
        comment_data:[],
        like_data:[]
    },
    back(){
        wx.redirectTo({
          url: '/pages/biaobaiWall/biaobai/biaobai',
        })
    },
    comment(e){
        wx.navigateTo({
          url: '/pages/biaobaiWall/saylovecomment/saylovecomment',
        }).then(res=>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.biaobaiitem})
        })
    },
    // 评论点赞 nav 切换
    onChange(event) {
        // wx.showToast({
        //   title: `切换到标签 ${event.detail.name}`,
        //   icon: 'none',
        // });
      },

    // 接受路由传进来的参数
    getoptions(){
        let that = this
        wx.showLoading({
            title: '加载中',
          })
        setTimeout(function () {
        wx.hideLoading()
        }, 2000)
        // 接受参数
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('data', function(data){
            let Data = data.data
            that.setData({
                Data:Data
            })
            that.setData({
                ['data.articleId']:Data.lovewall._id,
                ['data.avatar']:Data.author.avatarUrl,
                ['data.nickname']:Data.author.nickname,
                ['data.title']:Data.lovewall.title,
                ['data.content']:Data.lovewall.content,
                ['data.mobile']:Data.lovewall.mobile,
                ['data.views']:Data.lovewall.views,
                ['data.myloveimage']:Data.lovewall.myLoveImg,
                ['data.time']:Data.lovewall.time,
            })
        });
        const articalId = that.data.Data.lovewall._id
        const openid = that.data.Data.lovewall._openid
        wx.cloud.callFunction({
            name:'getarticaldetail',
            data:{
                articalId:articalId,
                openid:openid,
            }
        }).then(res=>{
            let comments_likes = res.result;
            let like = []
            let likeList = []
            let comment = []
            let commentList = [] 
            like = comments_likes[0].likelist
            for(let value of like){
                likeList.push({
                    ...value
                })
            }
            commentList = comments_likes[0].commentList
            for(let value of comment){
                commentList.push({
                    ...value
                })
            }
            that.setData({
                commentList:commentList,
                likeList:likeList
            })

        })
    },
    // 评论
    // comment(e){
    //    wx.navigateTo({
    //      url: '/pages/comment/comment',
    //    }).then(res=>{
    //         res.eventChannel.emit('data', { data: e.currentTarget.dataset.articleitem})

    //    })
    // },
    likebind(e){
        let that = this
        let articleId = e.currentTarget.dataset.articleid
        let openid = wx.getStorageSync('openid')
        if(openid == ''){
            wx.showToast({
              title: '请登录后点赞',
              icon:'error'
            })
            return
        }
        let Data = this.data.Data
        let lovewall = this.data.Data.lovewall
        // 点赞该文章的信息
        let likeinfo = {
            articleId:articleId,
            likeAuthor_openId:openid,
            time:new Date().getTime()
        }
        // 复制一份likelist 
        let lovewallLikes = Data.likelist
        // 点赞变红功能，如果以点赞了该文章 按钮变红
        let likecolorinfo = lovewall.likeorNot
        console.log(likecolorinfo);
        if (likecolorinfo){
            // 删除like中的点赞信息
            lovewallLikes.pop()
            // 若如果原先就是红色的，再点一次变灰
            that.setData({
                [`Data.lovewall.likeorNot`]:false
            })
            // 在数据库中删除点赞信息
            wx.cloud.callFunction({
                name:"addlovewallLikeinfo",
                data:{
                    sign:"reduce",
                    likeinfo:likeinfo
                }
            }).then(res=>{
                console.log(res);
            })
        }else{
            // 添加该点赞信息到lovewallLikes中
            lovewallLikes.push(likeinfo);

            that.setData({
                [`Data.lovewall.likeorNot`]:true
            })

            // 在数据库中增加点赞信息
            wx.cloud.callFunction({
                name:"addlovewallLikeinfo",
                data:{
                    sign:"add",
                    likeinfo:likeinfo
                }
            }).then(res=>{
                console.log(res);
            })
        }
        // 同步到data中
        this.setData({
            [`Data.likelist`]:lovewallLikes
        })
        this.onPullDownRefresh()
    },
    // 文章浏览量加一
    viewAddone(){
        let articleid = this.data.data.articleId
        let views = this.data.data.views + 1
        wx.cloud.callFunction({
            name:"update",
            data:{
                collection:'article',
                where:{
                    '_id':articleid
                },
                data:{
                    views:views
                }
            }
        }).then(res=>{
            console.log(res);
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getoptions()
        // 浏览器+1
        this.viewAddone()
        
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
        this.getoptions()
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