var constants = require('./constants');
var SESSION_KEY = 'miniprogram_session_' + constants.WX_SESSION_MAGIC_ID;

var Session = {
  get: function() {
    console.log('skey获取' + wx.getStorageSync(SESSION_KEY) || null)
    return wx.getStorageSync(SESSION_KEY) || null;
  },

  set: function(session) {
    wx.setStorageSync(SESSION_KEY, session);
  },

  clear: function() {
    console.log('清除skey')
    wx.removeStorageSync(SESSION_KEY);
  },
};

module.exports = Session;