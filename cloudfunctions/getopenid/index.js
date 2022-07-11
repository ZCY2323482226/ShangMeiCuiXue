// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
      // 这里获取到的 openId、 appId 和 unionId 是可信的，注意 unionId 仅在满足 unionId 获取条件时返回
    let { OPENID, APPID, UNIONID } = cloud.getWXContext()
    let res = await db.collection('user').where({
        openid:OPENID
    })
    .get()
    return {
        openid:OPENID,
        dbOpenid:res.data
    }
}