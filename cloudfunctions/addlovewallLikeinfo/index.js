// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const sign = event.sign
    const likeinfo = event.likeinfo
    if(sign === 'add'){
        let res = await db.collection('lovewallLikes').add({
            data:likeinfo
        })
        return {
            code:200,
            res:res,
            msg:'添加点赞信息成功'
        }
    }else{
        let res = await db.collection('lovewallLikes').where({
            articleId:likeinfo.articleId,
            likeAuthor_openId:likeinfo.likeAuthor_openId
        }).remove()
        return {
            code:200,
            res:res,
            msg:'删除点赞信息成功'
        }
    }
}