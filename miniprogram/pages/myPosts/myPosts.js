// pages/myPosts/myPosts.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading:false,
        mypostData:[],
        // more里面的信息备份，用于删除修改操作
        moreArticleinfo:{},
        // avatar:'../../assets/icon/start_avatar.jpg',
        // nickname:'未知昵称',
        // content:'test',
        // time:'05-10 20:42',
        // showPopup:false
    },
    // 取消
    cancel1(){
        this.setData({
            showPopup:false
        })
    },
    cancel2(){
        this.setData({
            showPopup:false
        })
    },
    // 更多
    more1(e){
        this.setData({
            moreArticleinfo:e.currentTarget.dataset.articleinfo1,
            showPopup:true
        })
    },
    more2(e){
        this.setData({
            moreArticleinfo:e.currentTarget.dataset.articleinfo2,
            showPopup:true
        })
    },
    // 关闭更多弹窗
    onClose(){
        this.setData({
            showPopup:false
        })
    },
    // 修改文章
    fixArticle1(){
        let articleinfo = this.data.moreArticleinfo
        wx.navigateTo({
          url: '/pages/pushlish/pushlish',
        }).then(res=>{
            res.eventChannel.emit('data', { data:  articleinfo})
        })
        this.setData({
            showPopup:false
        })
    },
    fixArticle2(){
        let articleinfo = this.data.moreArticleinfo
        wx.navigateTo({
          url: '/pages/biaobaiWall/myLove/myLove',
        }).then(res=>{
            res.eventChannel.emit('data', { data:  articleinfo})
        })
        this.setData({
            showPopup:false
        })
    },
    // 进入详情页
    godetail(e){
        let data = e.currentTarget.dataset.articleitem
        wx.navigateTo({
          url: '/pages/articalDetail2/articalDetail2',
        }).then(res=>{
            res.eventChannel.emit('data', { data:  data})
        })
    },
    golovewalldetail(e){
        let data = e.currentTarget.dataset.articleitem
        wx.navigateTo({
          url: '/pages/lovewallDetail2/lovewallDetail2',
        }).then(res=>{
            res.eventChannel.emit('data', { data:  data})
        })
    
    },
    // 删除文章
    remove1(){
        let that = this
        Dialog.confirm({
            title: '提示',
            message: '您确定要删除该文章吗',
          })
            .then(() => {
                wx.showLoading({
                    title: '删除中',
                })
                // let articleid = this.data.moreArticleinfo.article._id
                // console.log(articleid);
                // 删除文章
                wx.cloud.callFunction({
                    name:"removearticle",
                    data:{
                        articleid:that.data.moreArticleinfo.article._id,
                        commentList:that.data.moreArticleinfo.commentList,
                        likelist:that.data.moreArticleinfo.likelist
                    }
                }).then(res=>{
                    console.log(res);
                    wx.hideLoading()
                    Notify({ type: 'success', message: '删除成功' });
                }).catch(res=>{
                    console.log(res);
                    wx.hideLoading()
                    wx.showToast({
                        title:'删除失败',
                        icon:"error"
                    })
                })
                // 删除评论
                
            })
            .catch(() => {
                Notify({ type: 'warning', message: '已取消删除' });
            });
        this.setData({
            showPopup:false
        })
    },
    remove2(){
        let that = this
        Dialog.confirm({
            title: '提示',
            message: '您确定要删除该文章吗',
          })
            .then(() => {
                wx.showLoading({
                    title: '删除中',
                })
                // let articleid = this.data.moreArticleinfo.article._id
                // console.log(articleid);
                // 删除文章
                wx.cloud.callFunction({
                    name:"removelovewall",
                    data:{
                        articleid:that.data.moreArticleinfo.lovewall._id,
                        commentList:that.data.moreArticleinfo.commentList,
                        likelist:that.data.moreArticleinfo.likelist
                    }
                }).then(res=>{
                    wx.hideLoading()
                    Notify({ type: 'success', message: '删除成功' });
                }).catch(res=>{
                    wx.hideLoading()
                    wx.showToast({
                        title:'删除失败',
                        icon:"error"
                    })
                })
                // 删除评论
                
            })
            .catch(() => {
                Notify({ type: 'warning', message: '已取消删除' });
            });
        this.setData({
            showPopup:false
        })
    },
    // 获取我的文章
    getArticle(){
        wx.showLoading({
            title: '加载中',
        })
        let searchContent = {title:false}
        let openid = wx.getStorageSync('openid')
        wx.cloud.callFunction({
            name:"searchArticle",
            data:{
                searchContent:searchContent,
                openid:openid
            }
        }).then(res=>{
            console.log(res);
            this.setData({
                mypostData:res.result,
                loading:true
            })
            wx.hideLoading()
        })
        wx.cloud.callFunction({
            name:"searchLovewall",
            data:{
                searchContent:searchContent,
                openid:openid
            }
        }).then(res=>{
            console.log(res);
            this.setData({
                lovewallData:res.result,
                loading:true
            })
            wx.hideLoading()
        })
        console.log(this.data);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getArticle()
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
        this.getArticle()
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