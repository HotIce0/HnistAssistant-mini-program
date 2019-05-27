var utils = require('../../../utils/util.js');

const app = getApp();
Component({
  properties: {
    goodsType: {
      type: Object, //类型
      value: 'default value' //默认值
    }
  },
  attached() {
    let favorList = wx.getStorageSync('favorInfo')
    console.log('刷新收藏数据')
    let self = this
    self.loadModal()
    // 请求服务器获取商品类型
    app.globalData.client.request({
      url: app.globalData.config.service.favorListUrl,
      method: "POST",
      data: {
        goods_ids: JSON.stringify(favorList)
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
          // if (infoList.length < 10) {
          //   self.setData({
          //     isBottom: true
          //   })
          // }
          for (let i = 0; i < infoList.length; i++) {
            infoList[i].picture = JSON.parse(infoList[i].picture);
            infoList[i].created_at = utils.timeago(Number(infoList[i].created_at));
          }
          // if (self.data.index != 0) {
          //   self.setData({
          //     goodsInfoList: self.data.goodsInfoList.concat(infoList)
          //   })
          // } else {
          self.setData({
            favorInfoList: infoList
          })
          // }
          self.closeModal()
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  data: {

  },
  methods: {
    goGoods(e) {
      console.log(e)
      wx.navigateTo({
        url: '../goods/index?id=' + e.currentTarget.id + '&goodsType=' + JSON.stringify(this.properties.goodsType),
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
  },
  options: {
    addGlobalClass: true,
  }
})