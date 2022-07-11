// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const articleid = event.articleid
    const commentAuthor_openId = event.commentAuthor_openId
    const content = event.content
    const time = event.time
    const data = {
        articleId:articleid,
        commentAuthor_openId:commentAuthor_openId,
        content:content,
        time:time
    }
    let res = await db.collection('comment').add({
        data:data
    })
    return res
}