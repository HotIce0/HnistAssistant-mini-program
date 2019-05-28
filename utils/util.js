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

const timeago = function(dateTimeStamp) { //dateTimeStamp是一个时间毫秒，注意时间戳是秒的形式，在这个毫秒的基础上除以1000，就是十位数的时间戳。13位数的都是时间毫秒。
  var minute = 1000 * 60; //把分，时，天，周，半个月，一个月用毫秒表示
  var hour = minute * 60;
  var day = hour * 24;
  var week = day * 7;
  var halfamonth = day * 15;
  var month = day * 30;
  var result = null;
  var now = new Date().getTime(); //获取当前时间毫秒
  var diffValue = now - dateTimeStamp; //时间差
  // console.log("now :"+ now)
  // console.log("time: " + dateTimeStamp);
  // console.log(diffValue)

  if (diffValue < 0) {
    return;
  }
  var minC = diffValue / minute; //计算时间差的分，时，天，周，月
  var hourC = diffValue / hour;
  var dayC = diffValue / day;
  var weekC = diffValue / week;
  var monthC = diffValue / month;
  if (monthC >= 1 && monthC <= 3) {
    result = " " + parseInt(monthC) + "月前"
  } else if (weekC >= 1 && weekC <= 3) {
    result = " " + parseInt(weekC) + "周前"
  } else if (dayC >= 1 && dayC <= 6) {
    result = " " + parseInt(dayC) + "天前"
  } else if (hourC >= 1 && hourC <= 23) {
    result = " " + parseInt(hourC) + "小时前"
  } else if (minC >= 1 && minC <= 59) {
    result = " " + parseInt(minC) + "分钟前"
  } else if (diffValue >= 0 && diffValue <= minute) {
    result = "刚刚"
  } else {
    var datetime = new Date();
    datetime.setTime(dateTimeStamp);
    var Nyear = datetime.getFullYear();
    var Nmonth = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var Ndate = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var Nhour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var Nminute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var Nsecond = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    result = Nyear + "-" + Nmonth + "-" + Ndate
  }
  return result;
};

const contains = function(arr, obj) {
  var i = arr.length;
  while (i--) {
    if (arr[i] === obj) {
      return true;
    }
  }
  return false;
};
/**
 * 返回处理后的留言JSON数组
 * @param {商品的留言JSON数组} goods_msg_arr 
 */
var dealGoodsMsgfunction = function (goods_msg_arr) {
  let msgs = goods_msg_arr;
  // 将有父留言ID的插入到对应父留言ID后
  let finishAmount = 0;
  for (let i = 0; finishAmount < msgs.length;) {
    if (i >= msgs.length)
      i = 0;
    if (msgs[i].finish == null) {
      // 未完成的
      if (msgs[i].msg_id === null) {
        // 如果是父ID为空直接完成
        msgs[i].finish = true;
        finishAmount++;
      } else {
        // 父ID不为空就需要去寻找其父ID
        for (let j = 0, flag = false; j < msgs.length; j++) {
          if (msgs[j].finish && (msgs[j].id == msgs[i].msg_id || msgs[j].msg_id == msgs[i].msg_id)) {
            flag = true;
          } else {
            if (flag) {
              // 需要插入到当前位置
              msgs[i].finish = true;
              msgs.splice(j, 0, msgs[i]);
              if (j > i) {
                msgs.splice(i, 1);
              } else {
                msgs.splice(i + 1, 1);
              }
              finishAmount++;
              break;
            }
          }
        }
      }
    } else {
      i++;
    }
  }
  return msgs;
}


module.exports = {
  formatTime: formatTime,
  toastStringCut: toastStringCut,
  timeago: timeago,
  contains: contains,
  dealGoodsMsgfunction: dealGoodsMsgfunction
}