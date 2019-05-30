//app.js
var client = require('/vendor/miniprogram-spring-sdk/index.js');
var config = require('/api/config.js');



App({
  globalData: {
    userInfo: null,
    client: client,
    config: config,
    basicConfig: null,
  },
  updateConfig: function(){
    let self = this;
    // 从服务器获取最新配置信息
    self.globalData.client.request({
      url: self.globalData.config.service.getAppConfig,
      method: "POST",
      data: {
        app_names: JSON.stringify([
          "basic"
        ])
      },
      success: function (res) {
        console.log(res)
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          // 存储配置信息
          wx.setStorageSync("basicConfigs", res.data)
        }
      }
    })
  },
  onLaunch: function () {
    var self = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用登录，不会弹框
          console.log('已授权')
          // 登录
          client.setLoginUrl(config.service.loginUrl)
          if (client.getSession()) {
            self.updateConfig();
            console.log('使用缓存中是skey')
          } else {
            client.login({
              success: res => {
                console.log('登录成功')
                self.updateConfig();
            },
              fail: error => {
                console.log(error)
              }
            })
  }
} else {
    console.log('未授权')
          wx.reLaunch({
      url: '/pages/welcome/index',
    })
  }
      }
    })
wx.getUserInfo({
  success: res => {
    // 可以将 res 发送给后台解码出 unionId
    this.globalData.userInfo = res.userInfo

    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
  }
})
// 获取系统状态栏信息
wx.getSystemInfo({
  success: e => {
    this.globalData.StatusBar = e.statusBarHeight;
    let custom = wx.getMenuButtonBoundingClientRect(); //真机调试导致闪退问题
    this.globalData.Custom = custom;
    this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
  }
})
  }
})