const app = getApp();
var utils = require('../../utils/util.js');
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
    notice_msg: "",
    iconList: [
     {
      icon: 'write',
      color: 'orange',
      badge: 0,
      url: 'secondhand',
      name: '课堂考勤'
    }, {
      icon: 'calendar',
      color: 'yellow',
      badge: 0,
      url: 'secondhand',
      name: '学期课表'
    }, 
    {
      icon: 'rank',
      color: 'cyan',
      badge: 0,
      url: 'secondhand',
      name: '查询成绩'
    }, {
      icon: 'deliver',
      color: 'blue',
      badge: 0,
      url: 'secondhand',
      name: '快递代拿'
    }, 
    ],
    gridCol: 4,
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
  hideModal(e) {
    this.setData({
      modalName: null
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
  setDataFromConfig: function (data) {
    this.setData({
      iconList: JSON.parse(utils.getConfigValueFromConfigs(data, "basic", "app_list")),
      imageList: JSON.parse(utils.getConfigValueFromConfigs(data, "basic", "index_notice_images")),
      notice_msg: JSON.parse(utils.getConfigValueFromConfigs(data, "basic", "notice"))
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var self = this;

    wx.getStorage({
      key: 'basicConfigs',
      success: function(res) {
        let data = res.data;
        console.log(res)
        // 从配置中读取出数据
        self.setDataFromConfig(data)
      },
      fail:function(err){
        self.loadModal()
        // 从服务器获取配置信息
        app.globalData.client.request({
          url: app.globalData.config.service.getAppConfig,
          method: "POST",
          data: {
            app_names: JSON.stringify([
              "basic"
            ])
          },
          success: function (res) {
            console.log(res)
            if (res.status != 'success') {
              wx.showToast({
                title: res.data.errMsg,
                icon: 'none',
                duration: 1000
              })
            } else {
              // 存储配置信息
              wx.setStorage({
                key: 'basicConfigs',
                data: res.data,
              })
              // 从配置中读取出数据
              self.setDataFromConfig(res.data)
            }
          },
          complete: function () {
            self.closeModal();
          }
        })
      }
    })
  }
})