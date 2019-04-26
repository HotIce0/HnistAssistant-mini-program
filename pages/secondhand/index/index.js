const app = getApp();
Component({
  data: {
    TabCur: 0,
    TabCur1: 0,
    scrollLeft: 0,
    sort: ['最新', '最热'],
    PageCur: 'index'
  },
  methods: {
    toGoods(e) {
      wx.navigateTo({
        url: '../goods/index',
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
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    tabSelect(e) {
      console.log(e);
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    },
    tabSelect1(e) {
      console.log(e);
      this.setData({
        TabCur1: e.currentTarget.dataset.id,
        scrollLeft: (e.currentTarget.dataset.id - 1) * 60
      })
    }
  },
  options: {
    addGlobalClass: true,
  }
})