// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let collection = event.collection
    let where = event.where
    let res = db.collection(collection).where(where).get()
    return res
}