const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    ReadCur: 'false',
    loadModal: false,
    isIdentify: false,
    StuInfo: {
      name: 'XXX',
      stuid: '',
      idcard: ''
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function() {
    let self = this
    app.globalData.client.request({
      url: app.globalData.config.service.getStuInfoUrl,
      method: "POST",
      success: function(res) {
        if (res.status == 'success') {
          self.setData({
            isIdentify: true,
            StuInfo: {
              name: res.data.real_name,
              stuid: res.data.student_id,
              idcard: res.data.card_id
            }
          })
        } else {
          console.log(res.data)
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  ReadChange(e) {
    this.setData({
      ReadCur: e.currentTarget.dataset.cur
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

  formSubmit: function(e) {
    console.log(e)
    if (e.detail.value.name.length == 0 || e.detail.value.idcard.length == 0) {
      wx.showToast({
        title: '姓名或身份证不为空!',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else if (e.detail.value.studentid.length != 11) {
      wx.showToast({
        title: '请输入11位学号!',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else if (e.detail.value.idcard.length != 18) {
      wx.showToast({
        title: '请输入18位身份证号码!',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else if (this.data.ReadCur != 'true') {
      wx.showToast({
        title: '请阅读条款!',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else {
      let self = this
      this.loadModal() //显示加载验证
      // 请求服务器提交验证信息
      app.globalData.client.request({
        url: app.globalData.config.service.stuAuthUrl,
        method: "POST",
        data: {
          name: e.detail.value.name,
          gender: e.detail.value.sex ? '男' : '女',
          cardID: e.detail.value.idcard,
          studentID: e.detail.value.studentid
        },
        success: function(res) {
          console.log(res)
          self.closeModal() //验证结束关闭
          if (res.status != 'success') {
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 1000
            })
          } else {
            self.onLoad()
            wx.showToast({
              title: res.data, //这里打印出登录成功
              icon: 'success',
              duration: 1000
            })
          }
        }
      })
    }
  }
})