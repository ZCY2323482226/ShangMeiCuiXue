// pages/biaobai/myLove/myLove
const app = getApp();

Page({
  data: {
    imageArray: [],
    myLoveImg: [],
    private: false,
    textContent: '',
    name: '',
    phone: '',
    title:'',
    imgList: [],
    modalName: null,
    icon: {
      width: "100rpx",
      height: "100rpx",
      path: "",
      showImage: true
    },
    canPost: true
  },

  ChooseImage() {
    let that=this;
    wx.chooseImage({//异步方法
      count:4 ,//最多选择图片数量
      sizeType:['original', 'compressed'],//选择的图片尺寸 原图，压缩图
      sourceType:['album','camera'],//相册选图，相机拍照
      success(res){
        //tempFilePaths可以作为图片标签src属性
        const tempFilePaths = res.tempFilePaths
        console.log("选择成功",res)
        console.log(tempFilePaths.length);
        for(let i=0; i < tempFilePaths.length; i++){//多个图片的循环上传
          wx.cloud.uploadFile({//上传至微信云存储
            cloudPath:'myLoveImage/' + new Date().getTime() + "_" +  Math.floor(Math.random()*1000) + ".jpg",//使用时间戳加随机数作为上传至云端的图片名称
            filePath:tempFilePaths[i],// 本地文件路径
            success: res => {
              // 返回文件 ID
              console.log("上传成功",res.fileID.length)
              let fileID = [];
              fileID.push(res.fileID)
              that.setData({
                myLoveImg:fileID//获取上传云端的图片在页面上显示
              })
              wx.showToast({
                title: '上传成功',
              })
            }
          })
        }
      }
    })
  },

  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: 1,
    });
  },

  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
            console.log(this.data.myLoveImg);
            wx.cloud.deleteFile({
                fileList: this.data.myLoveImg,
                success(res){
                console.log(res,'删除文件')
            },
            fail(err){
                console.log(err)
            }
            })
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            myLoveImg: this.data.imgList
          })
          
        }
      }
    })
  },
  /** 提交 */
  post: function(e) {
    var that = this;
    const db = wx.cloud.database();
    let time = new Date().getTime();
	let content = this.data.textContent;
    let myLoveImg = this.data.myLoveImg;
	let privateValue = this.data.private;

    let title = this.data.title
    let views = 0
    let lovewallLikes = 0
	//获取图片
	this.data.imageArray.map(item => {
        myLoveImg.push(item.uploadResult.key)
    })
    const data = {
        content: content,
        time: time,
        myLoveImg: myLoveImg,
        title: title,
        privateValue: privateValue,
        views:views,
        lovewallLikes:lovewallLikes
    }
    console.log(data);
    if (content == '' || myLoveImg == ''){
        wx.showToast({
          title: '内容不能为空',
          icon:"error"
        })
    }else{
        db.collection('lovewall').add({
            data:data
        }).then(res =>{
            console.log(res);
            wx.showToast({
              title: '发布成功',
              icon:'success'
            }).catch(err =>{
                wx.showToast({
                  title: '发布失败',
                  icon:'error'
                })
            })
            
        })
        setTimeout(()=>{
            wx.navigateBack({
                delta:1
            })
        },1000)
    }
},
    // ##################################################################################
    // 执行
    fixarticle(){
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('data', function(data) {
            console.log(data);
            that.setData({
                time:data.data.lovewall.uploadtime,
                content:data.data.lovewall.content,
                lovewallid:data.data.lovewall._id,
                myLoveImg:data.data.lovewall.myLoveImg,
                privateValue:data.data.lovewall.privateValue,
                title:data.data.lovewall.title
            })
        })
    },
  getTitle: function(event) {
    let value = event.detail.value;
    this.setData({
      title: value
    });
  },


  /**
   * 预览图片
   */
  previewImage: function(event) {
    let url = event.target.id;
    wx.previewImage({
      current: '',
      urls: [url]
    })
  },

  /**
   * 设置是否匿
   */
  setPrivate: function(event) {
    this.setData({
      private: event.detail.value
    });
  },

  /**
   * 获取输入内容
   */
  getTextContent: function(event) {
    let value = event.detail.value;
    this.setData({
      textContent: value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.fixarticle()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})