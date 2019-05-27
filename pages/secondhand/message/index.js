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
    index: 0,
    pageSize: 10,
    isBottom: false,
    followInfoList: [],
    refresh: function(that) {
      console.log('刷新关注人动态')
      let self = that
      self.loadModal()
      // 请求服务器获取商品类型
      app.globalData.client.request({
        url: app.globalData.config.service.followGoodsUrl,
        method: "POST",
        data: {
          index: self.data.index,
          pageSize: self.data.pageSize
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
            if (infoList.length < 10) {
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
                followInfoList: self.data.followInfoList.concat(infoList)
              })
            } else {
              self.setData({
                followInfoList: infoList
              })
            }
            self.closeModal()
          }
        },
        fail: function(res) {
          console.log(res)
        }
      })
    }
  },
  methods: {
    getMoreGoods() {
      if (!this.data.isBottom) {
        this.setData({
          index: this.data.index + this.data.pageSize
        })
        this.data.refresh(this)
      }
    },
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