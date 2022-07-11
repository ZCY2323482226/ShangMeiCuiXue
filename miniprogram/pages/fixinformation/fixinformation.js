// pages/fixinformation/fixinformation.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 生日的时间戳
        birthdayTimeStamp:0,
        // 年龄选择
        birthday: '',
        maxDate: new Date().getTime(),
        formatter(type, value) {
          if (type === 'year') {
            return `${value}年`;
          }
          if (type === 'month') {
            return `${value}月`;
          }
          if (type === 'day'){
            return `${value}日`;
          }
          return value;
        },
        // 弹出层
        showage:false,
        // 头像
        avatarUrl:'../../assets/icon/start_avatar.jpg',
        form:{
            nickname:'--',
            grade:'--',
            gender:'--',
            hobby:'--',
            canvases:'--'
        }
    },
    // 日期确认
    onconfirmt(event) {
        let detail = event.detail
        let date = new Date(detail)
        let y = date.getFullYear()
        let m = date.getMonth()+1
        let d = date.getDay()
        let current = `${y}年${m}月${d}日`
        console.log(event.detail);
        this.setData({
            birthday: current,
            birthdayTimeStamp:detail,
            showage:false
        });
    },

    // 日期取消
    oncancel(){
        this.setData({
            showage:false
        })
    },
    // 根据时间戳，算出具体年月日
    filterAge(dat){
        let date = new Date(dat)
        let y = date.getFullYear()
        let m = date.getMonth()+1
        let d = date.getDay()
        let current = `${y}年${m}月${d}日`
        return current
    },
    // 年龄弹出
    showPopupAge(){
        this.setData({
            showage:true
        })
    },
    // 年龄关闭
    onCloseAge(){
        this.setData({
            showage:false
        })
    },
    formSubmit(e){
        this.setData({
            form:{
                ...e.detail.value,
            }
        })
        let data = {
            ...this.data.form,
            birthday:this.data.birthdayTimeStamp,
            avatarUrl:this.data.avatarUrl
        }
        let openid = wx.getStorageSync('openid')
        // 上传到云函数
        wx.cloud.callFunction({
            name:'updateuserinfo',
            data:{
                openid:openid,
                userinfo:data
            }
        }).then(res=>{
            if(res.result.code === 200){
                wx.showToast({
                title: '更新成功',
                icon: 'success',
                })
            }else if(res.result.code === 400){
                wx.showToast({
                    title: '更新失败',
                    icon:'error'
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({
            title: '加载中',
        })
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('user', function(data) {
            let Data = {
                ...data.data
            }
            that.setData({
                birthday:Data.birthday,
                avatarUrl:Data.avatarUrl,
                form:Data,
                birthdayTimeStamp:Data.birthdayTimeStamp,
            })
            console.log(Data)
        })
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