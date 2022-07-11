// pages/shouye/shouye.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        circular:true,
        autoplay:true,
        images:['1.jpg','2.jpg','3.jpg'],
        hideNotice: 'block',
        notice: '公告信息.................',
        marqueePace: 1,//滚动速度
        marqueeDistance: 10,//初始滚动距离
        size: 12,
        interval: 20, // 时间间隔
        countTime: '',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
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

    },
    // 公告信息
    onLoad: function() {
        let data = {},that = this;
        var length = that.data.notice.length * that.data.size; //文字长度
        var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
        that.setData({length,windowWidth});
        that.setData({
        marqueeDistance: windowWidth
        });
        that.run1();
    },
    // 跑马灯效果
    run1: function () {
        var that = this;
        that.data.countTime = setInterval(function () {
          if (-that.data.marqueeDistance < that.data.length) {
            that.setData({
              marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
            });
          } else {
            clearInterval(that.data.countTime);
            that.setData({
              marqueeDistance: that.data.windowWidth
            });
            that.run1();
          }
        }, that.data.interval);
      },
    //   公告关闭功能
    switchNotice:function(){
        var disply = this.data.hideNotice == "block"?"none":"block"
       this.setData({
            hideNotice:disply
       })
    },
    // 跳转表白墙页面
    biaobai(){
        wx.navigateTo({
            url: '/pages/biaobaiWall/biaobai/biaobai',
            
          }).then(res=>{
              
          })
    },
    SchoolLearn(){
        wx.navigateTo({
          url: '/pages/schoolLearn/schoolLearn',
        }).then(res=>{
            console.log("校园学习页面跳转");
        })
    },
    News(){
        wx.navigateTo({
            url: '/pages/news/news',
          }).then(res=>{
              console.log("新闻推荐页面跳转");
          })
    }
    
})
