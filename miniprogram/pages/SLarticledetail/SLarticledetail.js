// pages/SLarticledetail/SLarticledetail.js
var WxParse = require('../../util/wxParse/wxParse');
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
          url: '/pages/schoolLearn/schoolLearn',
        })
    },
    comment(e){
        wx.navigateTo({
          url: '/pages/comment/comment',
        }).then(res=>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.articleitem})
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
        // 接受参数
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('data', function(data){
            let Data = data.data
            console.log(Data);
            that.setData({
                Data:Data
            })
            console.log(that.data);
            that.setData({
                ['data.articleId']:Data.article._id,
                ['data.avatar']:Data.author.avatarUrl,
                ['data.nickname']:Data.author.nickname,
                ['data.title']:Data.article.title,
                ['data.content']:Data.article.content,
                ['data.views']:Data.article.views,
            })
        });
        console.log(that.data);
        const articalId = that.data.Data.article._id
        const openid = that.data.Data.article.openid
        wx.cloud.callFunction({
            name:'getRecComment_likes',
            data:{
                articalId:articalId,
                openid:openid,
            }
        }).then(res=>{
            console.log(res);
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
    likebind(e){
        let articleId = this.data.Data.article._id
        let openid = wx.getStorageSync('openid')
        let Data = this.data.Data
        console.log(openid);
        console.log(articleId);
        if(openid == ''){
            wx.showToast({
              title: '请登录后点赞',
              icon:'error'
            })
            return
        }
        // 点赞该文章的信息
        let likeinfo = {
            articleId:articleId,
            likeAuthor_openId:openid,
            time:new Date().getTime()
        }
        console.log(likeinfo);
        console.log(this.data);
        // 复制一份likelist 
        console.log(Data);
        let likes = Data.likelist
        // 点赞变红功能，如果以点赞了该文章 按钮变红
        let likecolorinfo =Data.article.likeorNot
        console.log(likecolorinfo);
        if (likecolorinfo){
            // 删除like中的点赞信息
            likes.pop()
            // 若如果原先就是红色的，再点一次变灰
            console.log(Data.article.likeorNot);
            this.setData({
                [`Data.article.likeorNot`]:false
            })
            console.log(Data.article.likeorNot);
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
        }else{
            // 添加该点赞信息到likes中
            likes.push(likeinfo);
            console.log(Data.article.likeorNot);
            this.setData({
                [`Data.article.likeorNot`]:true
            })
            console.log(Data.article.likeorNot);
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
        }
        console.log(likecolorinfo);
        // 同步到data中
        this.setData({
            [`Data.likelist`]:likes
        })
        this.onPullDownRefresh()
    },
    // 评论
    // comment(e){
    //    wx.navigateTo({
    //      url: '/pages/comment/comment',
    //    }).then(res=>{
    //         res.eventChannel.emit('data', { data: e.currentTarget.dataset.articleitem})

    //    })
    // },
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
        wx.showLoading({
            title: '加载中',
          })
        this.getoptions()
        WxParse.wxParse('article', 'html', this.data.data.content, this,5);
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