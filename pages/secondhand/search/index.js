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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let searchInfo = JSON.parse(options.search)
    let goodsType = wx.getStorageSync('goodsType')
    this.setData({
      goodsType: goodsType,
      searchInfo: searchInfo
    })
    this.search()
  },
  search() {
    // 请求服务器搜索商品  
    let self = this
    this.loadModal()
    console.log(this.data.searchInfo)
    app.globalData.client.request({
      url: app.globalData.config.service.searchGoodsUrl,
      method: "POST",
      data: {
        keyword: self.data.searchInfo,
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
          console.log(self.data.goodsInfoList)
          self.closeModal()
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  formSubmit: function(e) {
    console.log(e)
    let searchInfo = e.detail.value.search
    searchInfo = searchInfo.trim()
    if (searchInfo.length == 0) {
      wx.showToast({
        title: '搜索不能为空!',
        icon: 'none',
        duration: 2000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 2000)
    } else {
      this.setData({
        searchInfo: searchInfo
      })
      this.search()
    }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (!this.data.isBottom) {
      this.setData({
        index: this.data.index + this.data.pageSize
      })
      this.search()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})