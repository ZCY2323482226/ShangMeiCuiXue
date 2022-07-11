// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    let recipientOpenid = event.recipientOpenid
    let sendOpenid = event.sendOpenid
    let content = event.content
    let res = await db.collection('private_letter').add({
        data:{
            recipientOpenid:recipientOpenid,
            sendOpenid:sendOpenid,
            isnotread:0,
            time:new Date().getTime(),
            content:content
        }
    })

}