var constants = require('./constants');
var Session = require('./session');

/***
 * @class
 * 表示登录过程中发生的异常
 */
var LoginError = (function() {
  function LoginError(type, message) {
    Error.call(this, message);
    this.type = type;
    this.message = message;
  }

  LoginError.prototype = new Error();
  LoginError.prototype.constructor = LoginError;

  return LoginError;
})();

/**
 * 微信登录，获取 code, userInfo, rawData, signature, encryptData, iv
 */
var getWxLoginResult = function getLoginCode(callback) {
  wx.login({
    success: function(loginResult) {
      wx.getUserInfo({
        success: function(userResult) {
          callback(null, {
            code: loginResult.code,
            userInfo: userResult.userInfo,
            rawData: userResult.rawData,
            signature: userResult.signature,
            encryptedData: userResult.encryptedData,
            iv: userResult.iv,
          });
        },

        fail: function(userError) {
          var error = new LoginError(constants.ERR_WX_GET_USER_INFO, '获取微信用户信息失败，请检查网络状态');
          error.detail = userError;
          callback(error, null);
        },
      });
    },

    fail: function(loginError) {
      var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '微信登录失败，请检查网络状态');
      error.detail = loginError;
      callback(error, null);
    },
  });
};

var noop = function noop() {};
var defaultOptions = {
  method: 'POST',
  success: noop,
  fail: noop,
  loginUrl: null,
};

/**
 * @method
 * 进行服务器登录，以获得登录会话
 *
 * @param {Object} options 登录配置
 * @param {string} options.loginUrl 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "POST"
 * @param {Function} options.success(userInfo) 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} options.fail(error) 登录失败后的回调函数，参数 error 错误信息
 */
var login = function login(options) {
  //merge the parament(options) with defaultOptions.
  if (options.method) {
    options.method = defaultOptions.method;
  }
  if (!options.loginUrl) {
    options.loginUrl = defaultOptions.loginUrl;
  }

  if (!options.loginUrl) {
    options.fail(new LoginError(constants.ERR_INVALID_PARAMS, '登录错误：缺少登录地址，请通过 setLoginUrl() 方法设置登录地址'));
    return;
  }

  var doLogin = getWxLoginResult(function(wxLoginError, wxLoginResult) {
    if (wxLoginError) {
      options.fail(wxLoginError);
      return;
    }

    var userInfo = wxLoginResult.userInfo;

    //构造请求头部，包含 code、encryptedData 和 iv
    var code = wxLoginResult.code;
    var rawData = wxLoginResult.rawData;
    var signature = wxLoginResult.signature;
    var encryptedData = wxLoginResult.encryptedData;
    var iv = wxLoginResult.iv;
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    };

    // header[constants.WX_HEADER_CODE] = code;
    // header[constants.WX_HEADER_SIGNATURE] = signature;
    // header[constants.WX_HEADER_RAWDATA] = rawData;
    // header[constants.WX_HEADER_ENCRYPTED_DATA] = encreptedData;
    // header[constants.WX_HEADER_IV] = iv;

    var data = {
      code: code,
      signature: signature,
      rawData: rawData,
      encryptedData: encryptedData,
      iv: iv
    }

    //请求服务器登陆地址，获取会话
    wx.request({
      url: options.loginUrl,
      header: header,
      method: 'POST',
      data: data,
      //请求发送成功
      success: function(result) {
        var data = result.data;
        data.data = JSON.parse(data.data)
        console.log(data)
        //登陆成功
        //@remark skey session key
        if (data && data.code === 0 && data.data.skey) {
          var res = data.data;
          
          //设置会话skey
          Session.set(res.skey);
          options.success(res.userinfo);

          //登陆失败（未接收到Session ID）
        } else {
          var noRecvSessionError = new LoginError(constants.ERR_LOGIN_SESSION_NOT_RECEIVED, JSON.stringify(data));
          options.fail(noRecvSessionError);
        }
      },

      //请求发送失败
      fail: function(loginResponseError) {
        var error = new LoginError(constants.ERR_WX_LOGIN_FAILED, '登录失败，可能是网络错误或者服务器发生异常');
        options.fail(error);
      },
    });
  });
};
/**
 * 设置登陆认证服务器地址
 * @param {string} loginUrl 登陆服务器地址
 */
var setLoginUrl = function(loginUrl) {
  defaultOptions.loginUrl = loginUrl;
};

module.exports = {
  loginError: LoginError,
  login: login,
  setLoginUrl: setLoginUrl,
};