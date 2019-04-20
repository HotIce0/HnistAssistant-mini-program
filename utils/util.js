const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const toastStringCut = function(msg) {
  var msg1 = "";
  for (let i = 0; i < msg.length; i += 7) {
    msg1 = msg1 + msg.slice(i, i + 5) + '\r\n'
  }
  return msg1;
}

module.exports = {
  formatTime: formatTime,
  toastStringCut: toastStringCut
}