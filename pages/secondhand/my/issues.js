// pages/secondhand/my/issues.js
var utils = require('../../../utils/util.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    pageSize: 10,
    isBottom: false,
    modalName: null
  },
  goModify(e) {
    console.log(e)
    wx.navigateTo({
      url: '../issue/modify?goodsInfo=' + JSON.stringify(this.data.goodsInfoList[e.currentTarget.dataset.id]),
    })
  },
  goDeleteMsg(e) {
    let self = this
    console.log(e.currentTarget.dataset.id)
    app.globalData.client.request({
      url: app.globalData.config.service.delGoodsUrl,
      method: "POST",
      data: {
        goods_id: Number(this.data.deleteGoods),
      },
      success: function(res) {
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data,
            icon: 'none',
            duration: 2000
          })
          self.hideModal()
          self.onPullDownRefresh()
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let goodsType = wx.getStorageSync('goodsType')
    this.setData({
      goodsType: goodsType
    })
    // 请求服务器获取商品类型
    let self = this
    this.loadModal()
    app.globalData.client.request({
      url: app.globalData.config.service.myGoodsUrl,
      method: "POST",
      data: {
        index: self.data.index,
        pageSize: self.data.pageSize,
      },
      success: function(res) {
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          let infoList = res.data
          if (infoList.length < self.data.pageSize) {
            self.setData({
              isBottom: true
            })
          }
          for (let i = 0; i < infoList.length; i++) {
            infoList[i].picture = JSON.parse(infoList[i].picture);
            infoList[i].created_at = utils.timeago(Number(infoList[i].created_at));
          }
          if (self.data.index != 0) {
            self.setData({
              goodsInfoList: self.data.goodsInfoList.concat(infoList)
            })
          } else {
            self.setData({
              goodsInfoList: infoList
            })
          }
          self.closeModal()
          }
        },
        fail: function(res) {
          console.log(res)
        }
    })

  },

  loadModal() {
    this.setData({
      loadModal: true
    })
    setTimeout(() => {
      this.setData({
        loadModal: false
      })
    }, 5000)
  },
  closeModal() {
    this.setData({
      loadModal: false
    })
  },
  showModal(e) {
    console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      deleteGoods: e.currentTarget.dataset.id
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  goGoods(e) {
    console.log(e)
    wx.navigateTo({
      url: '../goods/index?id=' + e.currentTarget.dataset.id + '&goodsType=' + JSON.stringify(this.properties.goodsType),
    })
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
    console.log('下拉刷新')
    this.setData({
      index: 0,
      goodsInfoList: [],
      isBottom: false
    })
    this.onLoad()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isBottom) {
      this.setData({
        index: this.data.index + this.data.pageSize
      })
      this.onLoad()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})