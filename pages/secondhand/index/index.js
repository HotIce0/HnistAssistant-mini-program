var utils = require('../../../utils/util.js');

const app = getApp();

Component({
  properties: {
    goodsType: {
      type: Object, //类型
      value: 'default value' //默认值
    }
  },
  data: {
    sort_type: 0,
    goods_type_id: -100,
    index: 0,
    pageSize: 10,
    scrollLeft: 0,
    isBottom: false,
    sort: ['最新', '最热'],
    goodsInfoList: [],
    refresh: function(that) {
      console.log('刷新二手首页数据')
      let self = that
      self.loadModal()
      // 请求服务器获取商品类型
      app.globalData.client.request({
        url: app.globalData.config.service.goodsListUrl,
        method: "POST",
        data: {
          sort_type: self.data.sort_type,
          goods_type_id: self.data.goods_type_id,
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
  },
  lifetimes: {
    attached() {
      this.ready
    },
    moved() {
      console.log(2)
    },
    detached() {
      console.log(3)
    },
  },
  ready() {
    this.data.refresh(this)
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
    toGoods(e) {
      console.log(e)
      wx.navigateTo({
        url: '../goods/index?id=' + e.currentTarget.id + '&goodsType=' + JSON.stringify(this.properties.goodsType),
      })
    },
    NavChange(e) {
      this.setData({
        PageCur: e.currentTarget.dataset.cur
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
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
    tabSelect(e) {
      console.log(e);
      this.setData({
        goods_type_id: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
        index: 0
      })
      this.data.refresh(this)
    },
    tabSelect1(e) {
      console.log(e);
      this.setData({
        sort_type: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
        index: 0
      })
      this.data.refresh(this)
    }
  },
  options: {
    addGlobalClass: true,
  }
})