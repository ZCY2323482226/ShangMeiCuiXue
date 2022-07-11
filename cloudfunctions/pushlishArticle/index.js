// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const content = event.content
    const title = event.title
    const openid = event.openid
    const time = event.time
    const tag = event.tag
    const content_text = event.content_text
    const views = 0
    const likes = 0
    const data = {
        content:content,
        content_text:content_text,
        title:title,
        openid:openid,
        time:time,
        views:views,
        likes:likes,
        tag:tag
    }
    let res = await db.collection('article').add({
        data:data
    })
    return res
}