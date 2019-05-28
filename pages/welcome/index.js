// pages/welcome/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  restart: function(e) {
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = JSON.parse(e.detail.rawData)
      wx.reLaunch({
        url: '../index/index',
      })
      app.globalData.client.login({
        loginUrl: app.globalData.config.service.loginUrl,
        success: res => {
          console.log('登录成功')
        },
        fail: error => {
          console.log(error)
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '请同意授权~',
        duration: 1000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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