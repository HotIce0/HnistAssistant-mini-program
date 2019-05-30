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
    this.data.refresh(this)
  },
  data: {
    refresh: function(that) {
      let favorList = wx.getStorageSync('favorInfo')
      console.log('刷新收藏数据')
      let self = that
      favorList = JSON.stringify(favorList)
      if (favorList && favorList != '[]') {
        // 请求服务器获取商品类型
        self.loadModal()
        app.globalData.client.request({
          url: app.globalData.config.service.favorListUrl,
          method: "POST",
          data: {
            goods_ids: favorList
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
                infoList[i].picture = JSON.parse(infoList[i].picture);
                infoList[i].created_at = utils.timeago(Number(infoList[i].created_at));
              }

              self.setData({
                favorInfoList: infoList
              })
              self.closeModal()
            }
          },
          fail: function(res) {
            console.log(res)
          }
        })
      }
    }
  },
  methods: {
    goGoods(e) {
      console.log(e)
      wx.navigateTo({
        url: '../goods/index?id=' + e.currentTarget.id + '&goodsType=' + JSON.stringify(this.properties.goodsType),
      })
    },
    refresh() {
      this.setData({
        favorInfoList: []
      })
      this.data.refresh(this)
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