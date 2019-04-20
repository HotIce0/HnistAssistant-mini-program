var Config = require('./config.js')
var Client = require('./../vendor/miniprogram-laravel-sdk/index.js')
var Utils = require('./../vendor/miniprogram-laravel-sdk/lib/utils.js')
var Constants = require('./../vendor/miniprogram-laravel-sdk/lib/constants.js')
var Session = require('./../vendor/miniprogram-laravel-sdk/lib/session.js')


var noop = function noop() { };
var defaultOptions = {
  success: noop,
  fail: noop,
};

/**
 * 获取学生认证状态
 * 返回学生姓名，学号，身份证后4位
 */
var stuState = function (options) {
  options = Utils.extend({}, defaultOptions, options);
  //调用绑定状态查询接口
  Client.request({
    url: Config.service.getStuInfoUrl,
    success: res => {
      var  stustate = res.data.bindstatus;
      options.success(bindstatus);
    },
    fail: function (error) {
      options.fail(error);
    }
  })
};

var formSubmit = function(e) {
  console.log(e)
  app.globalData.client.request({

    url: app.globalData.config.service.StuAuthUrl,

    method: "POST",

    data: {
      name: e.detail.value.name,
      gender: e.detail.value.sex ? '男' : '女',
      cardID: e.detail.value.idcard,
      studentID: e.detail.value.studentid
    },

    success: function(res) {
      console.log(res)
      if (res.code != 0) {

        wx.showToast({

          title: res.msg,

          icon: 'none',

          duration: 1500

        })

      } else {

        wx.showToast({

          title: res.msg, //这里打印出登录成功

          icon: 'success',

          duration: 1000

        })

      }

    }

  })

}
