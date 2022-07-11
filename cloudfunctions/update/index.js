// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let collection = event.collection
    let where = event.where
    let data = event.data
    let res = await db.collection(collection).where(where).update({
        data:data
    })
    if(res.stats.updated === 1) return {
        code:200,
        msg:'更新成功'
    }
    return {
        code:400,
        msg:'更新失败',
        err:res
    }
}