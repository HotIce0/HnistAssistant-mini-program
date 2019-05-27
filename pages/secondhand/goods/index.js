// pages/secondhand/goods/index.js
var utils = require('../../../utils/util.js');

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    isFavor: false,
    isFollow: false,
    leaveMsgTo: -100,
    picker: ['广告', '色情', '侵权', '诈骗', '其他'],
    modalName: null
  },

  goLeaveMsg(e) {
    let self = this
    //请求服务器留言
    app.globalData.client.request({
      url: app.globalData.config.service.leaveMsgUrl,
      method: "POST",
      data: {
        goods_id: self.data.goodsInfo.id,
        contant: self.data.textareaAValue,
        msg_id: Number(self.data.leaveMsgTo),
      },
      success: function(res) {
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          self.showMsg(self)
          wx.showToast({
            title: res.data,
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },


  goFollow(e) {
    let self = this
    if (this.data.isFollow) {
      // 请求服务器取消关注
      app.globalData.client.request({
        url: app.globalData.config.service.cancelFollowUrl,
        method: "POST",
        data: {
          hnist2_id: self.data.goodsInfo.owner_id
        },
        success: function(res) {
          if (res.status != 'success') {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none',
              duration: 1000
            })
          } else {
            self.setData({
              isFollow: false
            })
            let followUserList = wx.getStorageSync('followUserList')
            let indexValue = followUserList.indexOf(Number(self.data.goodsInfo.owner_id))
            if (indexValue != -1) {
              followUserList.splice(indexValue, 1)
            }
            wx.setStorageSync('followUserList', followUserList)
            wx.showToast({
              title: res.data,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      // 请求服务器关注
      app.globalData.client.request({
        url: app.globalData.config.service.followUrl,
        method: "POST",
        data: {
          hnist2_id: self.data.goodsInfo.owner_id
        },
        success: function(res) {
          if (res.status != 'success') {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none',
              duration: 1000
            })
          } else {
            self.setData({
              isFollow: true
            })
            let followUserList = wx.getStorageSync('followUserList')
            followUserList.push(Number(self.data.goodsInfo.owner_id))
            wx.setStorageSync('followUserList', followUserList)
            wx.showToast({
              title: res.data,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }
  },




  goFavor(e) {
    let self = this
    if (this.data.isFavor) {
      // 请求服务器取消收藏商品
      app.globalData.client.request({
        url: app.globalData.config.service.cancelCollectUrl,
        method: "POST",
        data: {
          goods_id: self.data.goodsInfo.id
        },
        success: function(res) {
          if (res.status != 'success') {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none',
              duration: 1000
            })
          } else {
            self.setData({
              isFavor: false
            })
            let favorInfo = wx.getStorageSync('favorInfo')
            let indexValue = favorInfo.indexOf(Number(self.data.goodsInfo.id))
            if (indexValue != -1) {
              favorInfo.splice(indexValue, 1)
            }
            wx.setStorageSync('favorInfo', favorInfo)
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      // 请求服务器收藏商品
      app.globalData.client.request({
        url: app.globalData.config.service.collectUrl,
        method: "POST",
        data: {
          goods_id: self.data.goodsInfo.id
        },
        success: function(res) {
          if (res.status != 'success') {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none',
              duration: 1000
            })
          } else {
            self.setData({
              isFavor: true
            })
            //console.log(wx.getStorageSync('favorInfo'))
            let favorInfo = wx.getStorageSync('favorInfo')
            favorInfo.push(Number(self.data.goodsInfo.id))
            wx.setStorageSync('favorInfo', favorInfo)
            //console.log(wx.getStorageSync('favorInfo'))
            wx.showToast({
              title: res.data,
              icon: 'success',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }
  },
  ViewImage(e) {
    console.log(e.currentTarget.dataset.url)
    wx.previewImage({
      urls: this.data.imgList,
      current: this.data.imgList[e.currentTarget.dataset.url]
    });
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  showModal(e) {
    console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target,
      leaveMsgTo: e.currentTarget.dataset.index == null ? -100 : e.currentTarget.dataset.index
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
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  goPersonalPage(e) {
    wx.navigateTo({
      url: '../personalPage/index',
    })
  },
  goPurchase(e) {
    wx.navigateTo({
      url: './purchase',
    })
  },

  /**
   * 对留言进行排序处理
   */
  showMsg(self) {
    // 请求服务器获取留言
    app.globalData.client.request({
      url: app.globalData.config.service.goodsMsgUrl,
      method: "POST",
      data: {
        goods_id: self.data.goodsInfo.id
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
          for (let i = 0; i < infoList.length; i++) {
            infoList[i].created_at = utils.timeago(Number(infoList[i].created_at));
          }
          self.setData({
            msgInfo: infoList
          })
          console.log(self.data.msgInfo)
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
    this.setData({
      goodsType: JSON.parse(options.goodsType)
    })
    let self = this
    self.loadModal()
    // 请求服务器获取商品类型
    app.globalData.client.request({
      url: app.globalData.config.service.goodsDetailUrl,
      method: "POST",
      data: {
        goods_id: options.id
      },
      success: function(res) {
        if (res.status != 'success') {
          wx.showToast({
            title: res.data.errMsg,
            icon: 'none',
            duration: 1000
          })
        } else {
          let info = res.data
          info.picture = JSON.parse(info.picture);
          info.created_at = utils.timeago(Number(info.created_at));
          self.setData({
            goodsInfo: info
          })
          let followUserList = wx.getStorageSync('followUserList')
          let favorInfo = wx.getStorageSync('favorInfo')
          self.setData({
            isFavor: utils.contains(favorInfo, Number(self.data.goodsInfo.id)),
            isFollow: utils.contains(followUserList, Number(self.data.goodsInfo.owner_id))
          })
          console.log(self.data.goodsInfo)
          self.showMsg(self)
          self.closeModal()
        }
      },
      fail: function(res) {
        console.log(res)
      }
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