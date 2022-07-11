// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let userinfo = event.userinfo
    let openid = event.openid
    let res = await db.collection('user').where({
        openid:openid
    }).update({
        data:userinfo
    })
    if(res.stats.updated === 1) return {
        code:200,
        msg:'更新成功'
    }
    return {
        code:400,
        msg:'更新失败'
    }
}