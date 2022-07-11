// pages/recommend/recommend.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 标记下拉动作
        // downbottom:false,
        // 加载是否完成
        tabTitle:['最新榜','浏览榜','点赞榜'],
        loading:false,
        // 文章列表作者列表
        article_author_list:[],
        searchContent:'',
        // 抓取数据库文章的初始位置
        skip:0,
        // 限制多少条
        limit:6,
        // 备份,与上面同时修改
        copy_limit:6,
        // 判断数据库的文章全部抓取下来了
        isnotAllarticle:false,
        // 目前出于什么榜单
        currentList:0
    },

    // 查看用户信息
    checkpushlisherinfo(e){
        let pushlisherinfo = e.currentTarget.dataset.pushlisherinfo
        wx.navigateTo({
          url: '/pages/homepage/homepage',
        }).then(res=>{
            res.eventChannel.emit('data', { data: pushlisherinfo})
        })
    },
    // 详情页跳转
    detail_route(e){
        wx.navigateTo({
          url: '/pages/articledetail/articledetail',
        }).then(res=>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.articleitem})
            console.log('详情页跳转');
        })
    },
    // tab 监听
    onClick(e){
        let index = e.detail.index
        this.setData({
            skip:0,
            article_author_list:[],
            isnotAllarticle:false
        })
        console.log(index);
        if(index === 0) {
            this.setData({
                currentList:0
            })
            this.getArticle('time')
        }
        else if(index === 1) {
            this.setData({
                currentList:1
            })
            this.getArticle('views')
        }
        else if(index === 2) {
            this.setData({
                currentList:2
            })
            this.getArticle('likes')
        }
    },
    // 评论跳转
    comment(e){
        wx.navigateTo({
          url: '/pages/comment/comment',
        }).then(res=>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.articleitem})
        })
    },
    // 点赞
    likebind(e){
        let articleindex = e.currentTarget.dataset.articleindex
        let articleId = e.currentTarget.dataset.articleid
        let openid = wx.getStorageSync('openid')
        let article_author_list = this.data.article_author_list
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
        // 复制一份likelist 
        let likes = this.data.article_author_list[articleindex].likelist

        // 点赞变红功能，如果以点赞了该文章 按钮变红
        console.log(this.data);
        let likecolorinfo = this.data.article_author_list[articleindex].article.likeorNot
        if (likecolorinfo){
            // 删除like中的点赞信息
            likes.pop()
            // 若如果原先就是红色的，再点一次变灰
            this.setData({
                [`article_author_list[${articleindex}].article.likeorNot`]:false
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
        }else{
            // 添加该点赞信息到likes中
            likes.push(likeinfo);
            this.setData({
                [`article_author_list[${articleindex}].article.likeorNot`]:true
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
        }
        // 同步到data中
        this.setData({
            [`article_author_list[${articleindex}].likelist`]:likes
        })

    },
    // 搜素确认
    onSearch(e){
        wx.showLoading({
          title: '搜索中',
        })
        let that = this
        let searchContent = e.detail
        let openid = wx.getStorageSync('openid')
        wx.cloud.callFunction({
            name:"searchArticle",
            data:{
                searchContent:{title:searchContent},
                openid:openid
            }
        }).then(res=>{
            wx.hideLoading()
            let search_list = res.result
            this.setData({
                article_author_list:search_list
            })
        })
    },
    // 搜素取消
    onCancel(e){
        let limit = this.data.copy_limit
        wx.showLoading({
            title: '请稍等',
        })
        // 清空文章展示列表article_author_list
        this.setData({
            article_author_list:[],
            // 全部变为初始状态
            skip:0,
            limit:limit,
            isnotAllarticle:false
        })
        this.getArticle()
        // wx.cloud.callFunction({
        //     name:"searchArticle",
        //     data:{
        //         searchContent:{title:""},
        //         openid:openid
        //     }
        // }).then(res=>{
        //     wx.hideLoading()
        //     let search_list = res.result
        //     this.setData({
        //         article_author_list:search_list
        //     })
        //     wx.hideLoading()
        // })
    },
    // 发帖
    publish(){
        wx.navigateTo({
          url: '/pages/pushlish/pushlish',
        }).then(res=>{
            console.log('进入发帖');
        })
    },
    // 请求接口获取文章和作者 和文章点赞信息 和用户点赞信息
    getArticle(Browse){
        let that =this
        // wx.showLoading({
        //     title: '加载中',
        // })
        const openid = wx.getStorageSync('openid')
        wx.cloud.callFunction({
            name:"getarticle",
            data:{
                openid:openid,
                skip:that.data.skip,
                limit:that.data.limit,
                Browse:Browse
            }
        }).then(res=>{
            let article_author_some_list = res.result
            console.log(article_author_some_list);
            // 数据库中没有数据了就 设置 isnotarticle 为true
            if (article_author_some_list.length === 0){
                that.setData({
                    isnotAllarticle:true
                })
            }
            let article_author_list = that.data.article_author_list
            article_author_list.push(...article_author_some_list)
            let skip = (that.data.skip)+(that.data.limit)
            this.setData({
                article_author_list:article_author_list,
                loading:true,
                skip:skip
            })
            // wx.hideLoading()
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getArticle('time')
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
        let limit = this.data.copy_limit
        this.setData({
            article_author_list:[],
            // 全部变为初始状态
            skip:0,
            limit:limit,
            isnotAllarticle:false
        })
        if (this.data.currentList === 0) this.getArticle('time')
        if (this.data.currentList === 1) this.getArticle('views')
        if (this.data.currentList === 2) this.getArticle('likes')
        wx.stopPullDownRefresh();
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        let isnotAllarticle = this.data.isnotAllarticle
        // 数据库中还有数据才加载，没有数据了不再加载
        if (!isnotAllarticle){
            if (this.data.currentList === 0) this.getArticle('time')
            if (this.data.currentList === 1) this.getArticle('views')
            if (this.data.currentList === 2) this.getArticle('likes')
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})