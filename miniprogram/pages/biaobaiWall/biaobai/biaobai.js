Page({
    data:{
        lovewall_author_list:[],
        // 加载是否完成
        loading:false,
        avatar:'cloud://nsedu-0geuprrl4b1a75d6.6e73-nsedu-0geuprrl4b1a75d6-1311608272/image/boy-icon.png',
        nickname:"匿名",
        // 抓取数据库文章的初始位置
        skip:0,
        // 限制多少条
        limit:2,
        // 备份,与上面同时修改
        copy_limit:2,
        // 判断数据库的文章全部抓取下来了
        isnotAllarticle:false,
        // content:'篮球场上打球的24号小哥哥我喜欢你',
        // time:new Date().getTime(),
        // myLoveImg:['../../../assets/image/myLove.png'],
        // likecountStart:0,
        // likecount:0,
        // myNumber:'QQ:02312123123',
        // // 点赞标记
        // likesign:false,
        // // 评论的昵称
        // comment_nickname:'test_nickname',
        // // 评论的内容
        // comment_content:'test_content'
        
    },
    checkpushlisherinfo(e){
        let pushlisherinfo = e.currentTarget.dataset.pushlisherinfo
        console.log(pushlisherinfo.nickname);
        if(pushlisherinfo.nickname !== '匿名'){
            wx.navigateTo({
                url: '/pages/homepage/homepage',
              }).then(res=>{
                  res.eventChannel.emit('data', { data: pushlisherinfo})
              })
        }
        else{
            wx.showToast({
                title: '该用户已匿名',
                icon:"error"
              })
        }
       
    },
    // 跳转发布表白墙功能页面
    publishMyLove(){
        wx.navigateTo({
            url: '/pages/biaobaiWall/myLove/myLove',
            
          }).then(res=>{
              
          })
    },
    back(){
        wx.redirectTo({
          url: '/pages/shouye/shouye',
        })
    },
    // 预览图片
    previewImage: function (e) {
        console.log(e);
        var current = e.currentTarget.dataset.src;
        console.log(current);
        wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: this.data.myLoveImg, // 需要预览的图片http链接列表
        })
      },
     // 详情页跳转
     detail_route(e){
        wx.navigateTo({
          url: '/pages/biaobaiWall/lovearticledetail/lovearticledetail',
        }).then(res=>{
            console.log(e);
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.lovewallitem})
            console.log('详情页跳转');
            console.log(e.currentTarget.dataset.lovewallitem);
        })
    },
    // 评论跳转
    comment(e){
        wx.navigateTo({
          url: '/pages/biaobaiWall/saylovecomment/saylovecomment',
        }).then(res=>{
            res.eventChannel.emit('data', { data: e.currentTarget.dataset.biaobaiitem})
        })
    },
      // 点赞
      likebind(e){
        let articleindex = e.currentTarget.dataset.articleindex
        let articleId = e.currentTarget.dataset.articleid
        let openid = wx.getStorageSync('openid')
        let lovewall_author_list = this.data.lovewall_author_list
        console.log(this.data);
        // 点赞该文章的信息
        let likeinfo = {
            articleId:articleId,
            likeAuthor_openId:openid,
            time:new Date().getTime()
        }
        // 复制一份likelist 
        let lovewallLikes = lovewall_author_list[articleindex].likelist
        // 点赞变红功能，如果以点赞了该文章 按钮变红
        let likecolorinfo = lovewall_author_list[articleindex].lovewall.likeorNot
        if (likecolorinfo){
            // 删除like中的点赞信息
            lovewallLikes.pop()
            // 若如果原先就是红色的，再点一次变灰
            this.setData({
                [`lovewall_author_list[${articleindex}].lovewall.likeorNot`]:false
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
            this.setData({
                [`lovewall_author_list[${articleindex}].lovewall.likeorNot`]:true
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
            [`lovewall_author_list[${articleindex}].likelist`]:lovewallLikes
        })

    },
    // 请求接口获取文章和作者 和文章信息
    getLovewall(){
        let that = this
       wx.showLoading({
         title: '加载中',

       })
       const openid = wx.getStorageSync('openid')
       wx.cloud.callFunction({
        name:"getlovewall",
        data:{
            openid:openid,
            skip:that.data.skip,
            limit:that.data.limit,
        }
        }).then(res=>{
            let lovewall_author_some_list = res.result
            // 数据库中没有数据了就 设置 isnotarticle 为true
            if (lovewall_author_some_list.length === 0){
                that.setData({
                    isnotAllarticle:true
                })
            }
            for(let item of lovewall_author_some_list){
                if(item.lovewall.privateValue){
                    item.author.nickname = "匿名"
                    if(item.author.gender == "女"){
                        item.author.avatarUrl = 'cloud://nsedu-0geuprrl4b1a75d6.6e73-nsedu-0geuprrl4b1a75d6-1311608272/image/girl-icon.png'
                    }else{
                        item.author.avatarUrl = 'cloud://nsedu-0geuprrl4b1a75d6.6e73-nsedu-0geuprrl4b1a75d6-1311608272/image/boy-icon.png'
                    }
                    
                }
            }
            let lovewall_author_list = that.data.lovewall_author_list
            lovewall_author_list.push(...lovewall_author_some_list)
            // console.log(lovewall_author_list);
            let skip = (that.data.skip)+(that.data.limit)
            this.setData({
                lovewall_author_list:lovewall_author_list,
                loading:true,
                skip:skip
            })
            console.log(lovewall_author_list)
            wx.hideLoading()
        })
        
    },
    
      /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLovewall()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    let limit = this.data.copy_limit
    this.setData({
        lovewall_author_list:[],
        // 全部变为初始状态
        skip:0,
        limit:limit,
        isnotAllarticle:false
    })
    this.getLovewall()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let isnotAllarticle = this.data.isnotAllarticle
    // 数据库中还有数据才加载，没有数据了不再加载
    if (!isnotAllarticle){
        this.getLovewall()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})