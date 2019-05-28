/**
 * 小程序配置文件
 */

// 主机域名
var host = 'https://assistant.hnist2.cn';

var config = {
  service: {
    host,
    // 登录地址，用于建立会话
    loginUrl: `${host}/wx/miniapp/user/login`,
    //获取学生认证信息状态，接口地址
    getStuInfoUrl: `${host}/app/hnist2/user/getStuInfo`,
    //提交学生认证信息，接口地址
    stuAuthUrl: `${host}/app/hnist2/user/auth`,
    //发布商品接口地址
    publishUrl: `${host}/app/hnist2/goods/publish`,
    //获取商品类型接口地址
    getAllUrl: `${host}/app/hnist2/goodstype/getAll`,
    //上传图片接口地址
    uploadUrl: `${host}/file/insertPicture`,
    //首页接口地址
    goodsListUrl: `${host}/app/hnist2/goods/list`,
    //商品详情接口地址
    goodsDetailUrl: `${host}/app/hnist2/goods/detail`,
    //收藏列表接口地址
    favorInfoUrl: `${host}/app/hnist2/goods/getMyCollections`,
    //留言接口地址
    leaveMsgUrl: `${host}/app/hnist2/goods/leaveGoodsMsg`,
    //留言列表接口地址
    goodsMsgUrl: `${host}/app/hnist2/goods/getGoodsMsg`,
    //删除留言接口地址
    deleteMsgUrl: `${host}/app/hnist2/goods/deleteGoodsMsg`,
    //通过商品ID数组获取商品详细信息列表接口地址
    favorListUrl: `${host}/app/hnist2/goods/getByGoodsIDs`,
    //收藏接口地址
    collectUrl: `${host}/app/hnist2/goods/collect`,
    //取消收藏接口地址
    cancelCollectUrl: `${host}/app/hnist2/goods/cancelCollect`,
    //关注人列表接口地址
    followUserUrl: `${host}/app/hnist2/user/getFollows`,
    //关注人动态接口地址
    followGoodsUrl: `${host}/app/hnist2/goods/getFollowGoods`,
    //关注接口地址
    followUrl: `${host}/app/hnist2/user/follow`,
    //取消关注接口地址
    cancelFollowUrl: `${host}/app/hnist2/user/cancelFollow`,
    //获取我发布的商品接口地址
    myGoodsUrl: `${host}/app/hnist2/goods/getMy`,
    //删除我发布的商品接口地址
    delGoodsUrl: `${host}/app/hnist2/goods/del`,
    //获取更新商品接口地址
    updateGoodsUrl: `${host}/app/hnist2/goods/update`,
    //搜索商品接口地址
    searchGoodsUrl: `${host}/app/hnist2/goods/search`,
  }
};

module.exports = config;