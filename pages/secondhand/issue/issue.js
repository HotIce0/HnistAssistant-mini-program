const app = getApp();
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: '',
    PageCur: 'sell',
    ReadCur: 'false',
    isNew: false,
    index: 0,
    loading: [],
    goodsType: [],
    picture: [],
    uploadIndex: 0
    // number: 1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let goodsType = wx.getStorageSync('goodsType')
    // 从缓存中获取商品类型
    this.setData({
      goodsType: goodsType
    })
  },
  formSubmit: function(e) {
    console.log(e)
    if (e.detail.value.title.length == 0 || e.detail.value.description.length == 0) {
      wx.showToast({
        title: '标题或描述不能为空!',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else
    if (e.detail.value.purchase_price.length == 0) {
      wx.showToast({
        title: '价钱不能为空!',
        icon: 'none',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
    } else if (e.detail.value.contact_me.length == 0) {
      wx.showToast({
        title: '联系方式不能为空!',
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
        url: app.globalData.config.service.publishUrl,
        method: "POST",
        data: {
          title: e.detail.value.title,
          is_new: self.data.isNew ? 1 : 0,
          is_free: self.data.PageCur == 'sell' ? 0 : 1,
          price: e.detail.value.price.length == 0 ? 0 : e.detail.value.price,
          purchase_price: e.detail.value.purchase_price,
          description: e.detail.value.description,
          free_require: e.detail.value.free_require,
          contact_me: e.detail.value.contact_me,
          goods_type_id: self.data.index + 1,
          picture: JSON.stringify(self.data.picture)
        },
        success: function(res) {
          self.closeModal() //验证结束关闭
          if (res.status != 'success') {
            wx.showToast({
              title: res.data.errMsg,
              icon: 'none',
              duration: 1000
            })

          } else {

            wx.reLaunch({
              url: '../index/tabbar',
            })
            wx.showToast({
              title: res.data, //这里打印出登录成功
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    }
  },
  changeNumber: function(e) {
    console.log(e)
    if (e.target.dataset.change == "0" && this.data.number > 1) {
      this.setData({
        number: --this.data.number
      })
    }
    if (e.target.dataset.change == "1" && this.data.number < 100) {
      this.setData({
        number: ++this.data.number
      })
    }
  },
  checkboxChange: function(e) {
    console.log(e)
    if (e.detail.value[0] == 'false') {
      this.setData({
        isNew: true
      })
    } else {
      this.setData({
        isNew: false
      })
    }
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
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  ReadChange(e) {
    this.setData({
      ReadCur: e.currentTarget.dataset.cur
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 1, //每次一张
      sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], //从相册选择
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        let self = this
        let skey = app.globalData.client.getSession()
        console.log(skey)
        let uploadTask = wx.uploadFile({
          url: app.globalData.config.service.uploadUrl,
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: {
            // "Content-Type": "multipart/form-data",
            "x-auth-sessionid": skey
          },
          success: function(res) {
            console.log(res)
            let data = JSON.parse(res.data)
            if (data.data.filename != null) {
              let picture = self.data.picture
              picture.push(data.data.filename)
              self.setData({
                picture: picture
              })
              console.log(self.data.picture)
            } else {
              console.log(data)
            }
            setTimeout(function() {
              self.setData({
                loading: true
              })
            }, 500)
            wx.hideToast();
          },
          fail: function(res) {
            console.log(res)
          }
        })
        uploadTask.onProgressUpdate((res) => {
          console.log('上传进度', res.progress)
          console.log('已经上传的数据长度', res.totalBytesSent)
          console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
        })
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '亲',
      content: '确定要删除这张照片吗？',
      cancelText: '取消',
      confirmText: '确定',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.data.picture.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
          console.log(this.data.picture)
        }
      }
    })
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  }
})