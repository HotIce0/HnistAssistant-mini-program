// pages/secondhand/identification/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ReadCur: 'false'
  },
  ReadChange(e) {
    this.setData({
      ReadCur: e.currentTarget.dataset.cur
    })
  },

  formSubmit: function(e) {
    console.log(e)
    if (e.detail.value.name.length == 0 || e.detail.value.idcard.length == 0) {
      wx.showToast({
        title: '姓名或身份证不为空!',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else if (e.detail.value.idcard.length != 18) {
      wx.showToast({
        title: '请输入18位身份证号码!',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else if (this.data.ReadCur != 'true') {
      wx.showToast({
        title: '请阅读条款!',
        icon: 'loading',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else {

      wx.request({

        url: 'https://',

        header: {

          "Content-Type": "application/x-www-form-urlencoded"

        },

        method: "POST",

        data: {
          name: e.detail.value.name,
          sex: e.detail.value.sex ? 'men' : 'women',
          idcard: e.detail.value.idcard
        },

        success: function(res) {

          if (res.data.status == 0) {

            wx.showToast({

              title: res.data.info,

              icon: 'loading',

              duration: 1500

            })

          } else {

            wx.showToast({

              title: res.data.info, //这里打印出登录成功

              icon: 'success',

              duration: 1000

            })

          }

        }

      })

    }

  }
})