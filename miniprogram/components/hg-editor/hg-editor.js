// components/hg-editor/hg-editor.js

/**
 * @author 秦玉成
 * 未经允许，请不要擅自改动，如果使用，请在最后说明出处
 */

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    /**是否显示工具栏 */
    showTabBar: {
      type: 'Boolean',
      value: true
    },
    placeholder: {
      type: 'String',
      value: '请输入相关内容'
    },
    name: {
      type: 'String',
      value: ''
    },
    uploadImageURL: {
      type: 'String',
      value: ''
    },
    value:{
        type:'String',
        value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    content:'',
    fileIDArr:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _onEditorReady: function () {
      const that = this;
      that.createSelectorQuery().select('#editor').context(function (res) {
        that.editorCtx = res.context
        that.editorCtx.setContents({
            html:that.properties.value
        });
      }).exec()
    },
    //插入图片
    _addImage: function (event) {
      let _this = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: function (res) {
            wx.showLoading({
                title: '上传中',
                mask: true
            });
            
            let path = res.tempFilePaths[0];
            let str = '';
            for (let i = 0; i < 4; i++) {
            //生成一个0到25的数字
            let ranNum = Math.ceil(Math.random() * 25);
            //大写字母'A'的ASCII是65,A~Z的ASCII码就是65 + 0~25;
            //然后调用String.fromCharCode()传入ASCII值返回相应的字符并push进数组里
            str = str + (String.fromCharCode(65 + ranNum));
            }
            let name = (Math.random() * 1000).toFixed(2);
            let cloudPath = 'articleimg/' + str + name + path.match(/\.[^.]+?$/)[0];
            
          _this._uploadImage(path, cloudPath);
        }
      });
    },
    _uploadImage: function (tempFilePath, uploadImageURL) {
        let that = this;
        wx.cloud.uploadFile({
            cloudPath:uploadImageURL,
            filePath:tempFilePath,
            success:e=>{
                that.editorCtx.insertImage({
                    src:e.fileID,
                    data:{
                        id:'adcd',
                        role:'god'
                    },
                    success:function(){
                        console.log('插入图片成功');
                        wx.hideLoading()
                        wx.showToast({
                            title: '插入图片成功',
                            icon:"success"
                        })
                    }
                })
            }
        })
    },
    //设置斜体
    _addItalic: function () {
      this.editorCtx.format("italic")
    },
    //添加粗体样式
    _addBold: function () {
      this.editorCtx.format("bold")
    },
    //设置标题
    _addHeader: function (e) {
      let headerType = e.currentTarget.dataset.header;
      this.editorCtx.format("header", headerType)
    },
    //设置文字的排列方式
    _addAlign: function (e) {
      let alignType = e.currentTarget.dataset.align;
      this.editorCtx.format("align", alignType);
    },
    //设置列表
    _addList: function (e) {
      let listType = e.currentTarget.dataset.list;
      this.editorCtx.format("list", listType);
    },
    //撤销
    _undo: function () {
      this.editorCtx.undo();
    },
    //监控输入
    _onInputting: function (e) {
      let html = e.detail.html;
      let text = e.detail.text;
    //    作者在编辑器删除图片时，云存储中同时也删除
      const that = this;
      let fileIDArr = this.data.fileIDArr;
      let arr = []
      e.detail.delta.ops.forEach(item=>{
          if(item.insert.image){
              arr.push(item.insert.image)
          }
      })
      if(fileIDArr.length > arr.length){
          fileIDArr.forEach((item,idx)=>{
              let index = arr.findIndex(res=>res==item)
              if(index == -1){
                  wx.cloud.deleteFile({
                      fileList:[item]
                  }).then(res=>{
                    console.log('删除成功');
                  }).catch(error=>{
                    console.log(error);
                  })
              }
          })
      }
      that.setData({
          content:e.detail.html,
          fileIDArr:arr
      })

      
      this.triggerEvent("input", { html: html, text: text }, {});
    }
  }
})
