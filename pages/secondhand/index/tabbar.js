const app = getApp();

Page({
  data: {
    PageCur: 'index',
    userInfo: {},
    goodsType: null,
    favorInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
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
  onLoad: function() {
    this.loadModal()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    // 获取收藏信息
    let self = this
    app.globalData.client.request({
      url: app.globalData.config.service.favorInfoUrl,
      method: "POST",
      data: {},
      success: function(res) {
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          let infoList = res.data
          let favorList = []
          for (let i = 0; i < infoList.length; i++) {
            favorList.push(infoList[i].goods_id)
          }
          self.setData({
            favorInfo: favorList
          })
          wx.setStorageSync('favorInfo', favorList)
          console.log(self.data.favorInfo)
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })

    //请求getStuInfo
    app.globalData.client.request({
      url: app.globalData.config.service.getStuInfoUrl,
      method: "POST",
      success: function(res) {
        if (res.status != 'success') {
          wx.navigateTo({
            url: '../../identify/index',
          })
          wx.showToast({
            title: '请进行学生认证',
            icon: 'none',
            duration: 2000
          })
        }
      },
    })


    // 获取关注人信息
    app.globalData.client.request({
      url: app.globalData.config.service.followUserUrl,
      method: "POST",
      data: {},
      success: function(res) {
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          let infoList = res.data
          let followUserList = []
          for (let i = 0; i < infoList.length; i++) {
            followUserList.push(infoList[i].user_id)
          }
          self.setData({
            followUserList: followUserList
          })
          wx.setStorageSync('followUserList', followUserList)
          console.log(self.data.followUserList)
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
    // 从缓存获取商品类型
    // let goodsType = wx.getStorageSync('goodsType')
    // this.setData({
    //   goodsType: goodsType
    // })
    // console.log(goodsType)
    // if (this.data.goodsType == null || this.data.goodsType == '') {
    
  },
  onShow: function(){
    if (this.data.goodsType === null){
      console.log("sao")
      this.loadModal();
      this.getGoodsType();
      this.selectComponent("#index").refresh();
    }
  },
  getGoodsType: function() {
    var self = this;
    // 请求服务器获取商品类型
    app.globalData.client.request({
      url: app.globalData.config.service.getAllUrl,
      method: "POST",
      data: {},
      success: function (res) {
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.setStorageSync('goodsType', res.data)
          self.setData({
            goodsType: res.data
          })
          console.log(self.data.goodsType)
        }
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function () {
        self.closeModal()
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.PageCur == 'index') {
      this.selectComponent("#index").refresh()
    } else if (this.data.PageCur == 'message') {
      this.selectComponent("#message").refresh()
    } else if (this.data.PageCur == 'favor') {
      this.selectComponent("#favor").refresh()
    }
    wx.stopPullDownRefresh()
  },
  onReachBottom: function() {
    if (this.data.PageCur == 'index') {
      this.selectComponent("#index").getMoreGoods()
    } else if (this.data.PageCur == 'message') {
      this.selectComponent("#message").getMoreGoods()
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  }
})