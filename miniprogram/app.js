// app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      });
    }
    this.globalData = {
        statsuBarHeight:0,
        sysWidth:0,
        sysHeight:0,
    };
    const res = wx.getSystemInfoSync()
    var statusbarH = res.statusBarHeight
    this.globalData.statsuBarHeight=statusbarH;
    this.globalData.sysWidth = res.screenWidth;
    this.globalData.sysHeight = res.screenHeight;
  },
    // 获取当前时间
    getnowtime: function() {
        var date = new Date
        var year = date.getFullYear().toString()
        var month = date.getMonth() + 1
        var day = date.getDate()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()

        if (hour.toString().length === 1) {
            hour = '0' + hour.toString()
        } else if (minute.toString().length === 1) {
            minute = '0' + minute.toString()
        } else if (second.toString().length === 1) {
            second = '0' + second.toString()
        }

        var nowtime = year + '/' + month.toString() + '/' + day.toString() + ' ' + hour + ":" + minute + ":" + second
        return nowtime
    },
});
