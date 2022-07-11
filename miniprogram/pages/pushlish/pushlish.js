// pages/pushlish/pushlish.js
import Toast from '@vant/weapp/toast/toast'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 选择tag
        tags:['杂谈趣事','帮帮','失物招领', '寻人'],
        tag:'文章类型',
        // 弹出框显示
        show:false,
        title:'',
        content:'',
        content_text:'',
        ifnotfix:false,
        articleid:''
    },
    picker_onConfirm(e){
        console.log(e);
        this.setData({
            tag:e.detail.value,
            show:false
        })
    },
    picker_onChange(e){
        this.setData({
            show:false
        })
    },
    showPopup() {
        this.setData({ show: true });
    },
    
    onClose() {
        this.setData({ show: false });
    },
    onInputtingDesc(e){
        let html = e.detail.html;   //相关的html代码
        let originText = e.detail.text;  //text，不含有任何的html标签
        // console.log(html);
        this.setData({
            content:html,
            content_text:originText
        })
        // console.log(originText);
    },
    // 表单提交
    submit(e){
        let that = this
        let title = e.detail.value.title
        let content = this.data.content
        let content_text = this.data.content_text
        let tag = this.data.tag
        const openid = wx.getStorageSync('openid')
        const time = new Date().getTime()
        const data = {
            title:title,
            content:content,
            tag:tag,
            content_text:content_text,
            openid:openid,
            time:time
        }
        if (title === '' || content === '' || tag === '文章类型'){
            // wx.showToast({
            //   title: '输入的内容不能为空',
            //   icon:"error"
            // })
            Toast.fail('输入的内容不能为空');
        }else{
            if(that.data.ifnotfix){
                wx.cloud.callFunction({
                name:"update",
                data:{
                    collection:'article',
                    where:{
                        _id:this.data.articleid
                    },
                    data:data
                }
            }).then(res=>{
                console.log(res);
            })
            Toast.success('修改成功');
            // wx.showToast({
            //     title: '修改成功',
            //     icon:'success'
            //   })
              setTimeout(()=>{
                  wx.navigateBack({
                      delta:1
                  })
              },1000)
            }else{
                wx.cloud.callFunction({
                    name:'pushlishArticle',
                    data:data
                }).then(res=>{
                    console.log(res);
                })
                Toast.success('发布成功');
                // wx.showToast({
                //   title: '发布成功',
                //   icon:'success'
                // })
                setTimeout(()=>{
                    wx.navigateBack({
                        delta:1
                    })
                },1000)
            }
        }
    },
    // 修改执行
    fixarticle(){
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('data', function(data) {
            console.log(data);
            that.setData({
                title:data.data.article.title,
                content:data.data.article.content,
                articleid:data.data.article._id,
                ifnotfix:true
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.fixarticle()
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

    }
})