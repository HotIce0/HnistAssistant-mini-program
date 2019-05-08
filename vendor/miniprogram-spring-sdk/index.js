var Login = require('./lib/login.js');
var Session = require('./lib/session.js');
var Request = require('./lib/request.js');

module.exports = {
  login: Login.login,
  setLoginUrl: Login.setLoginUrl,
  loginError: Login.loginError,
  clearSession: Session.clear,
  request: Request.request,
  requestError: Request.RequestError,
};