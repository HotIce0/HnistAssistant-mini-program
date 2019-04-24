/**
 * 小程序配置文件
 */

// 主机域名
var host = 'http://assistant.hnist2.cn';

var config = {
  service: {
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/wx/miniapp/user/login`,
    //获取学生认证信息状态，接口地址
    getStuInfoUrl: `${host}/wx/hnist2/user/getStuInfo`,
    //提交学生认证信息，接口地址
    stuAuthUrl: `${host}/wx/hnist2/user/auth`,
  }
};

module.exports = config;