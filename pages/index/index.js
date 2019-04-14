const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    imageList: [
      'http://img5.imgtn.bdimg.com/it/u=2875728092,437216961&fm=26&gp=0.jpg',
      'http://img5.imgtn.bdimg.com/it/u=3568485696,1734540693&fm=26&gp=0.jpg',
      'http://img1.imgtn.bdimg.com/it/u=1465412283,2234620258&fm=26&gp=0.jpg',
      'http://img4.imgtn.bdimg.com/it/u=3694785599,3321528837&fm=26&gp=0.jpg'
    ],
    iconList: [{
      icon: 'shop',
      color: 'red',
      badge: 12,
      url: 'secondhand/index/tabbar',
      name: '二手交易'
    }, {
      icon: 'write',
      color: 'orange',
      badge: 1,
      url: 'secondhand',
      name: '考勤'
    }, {
      icon: 'calendar',
      color: 'yellow',
      badge: 0,
      url: 'secondhand',
      name: '课表'
    }, {
      icon: 'discoverfill',
      color: 'purple',
      badge: 0,
      url: 'secondhand',
      name: '发现'
    }, {
      icon: 'questionfill',
      color: 'mauve',
      badge: 0,
      url: 'secondhand',
      name: '帮助'
    }, {
      icon: 'commandfill',
      color: 'purple',
      badge: 0,
      url: 'secondhand',
      name: '问答'
    }, {
      icon: 'brandfill',
      color: 'mauve',
      badge: 0,
      url: 'secondhand',
      name: '版权'
    }],
    gridCol: 3,
    skin: false
  },
  isLoading(e) {
    this.setData({
      isLoad: e.detail.value
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
  gridchange: function(e) {
    this.setData({
      gridCol: e.detail.value
    });
  },
  gridswitch: function(e) {
    this.setData({
      gridBorder: e.detail.value
    });
  },
  menuBorder: function(e) {
    this.setData({
      menuBorder: e.detail.value
    });
  },
  menuArrow: function(e) {
    this.setData({
      menuArrow: e.detail.value
    });
  },
  menuCard: function(e) {
    this.setData({
      menuCard: e.detail.value
    });
  },
  switchSex: function(e) {
    this.setData({
      skin: e.detail.value
    });
  },

  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
})