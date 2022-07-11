// 获取用户信息
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let openid = event.openid
    let res = await db.collection('user').where(openid).get()
    if (res.data.length === 0) return false
    else return res.data[0]
}