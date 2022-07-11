// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const articleid = event.articleid
    const commentList = event.commentList
    const likelist = event.likelist
    
    // 删除文章
    let resarticle = await db.collection('lovewall').doc(articleid).remove()
    // 删除点赞
    let reslike
    if(likelist.length !== 0){
        for(let like of likelist){
            reslike = await db.collection('lovewallLikes').doc(like._id).remove()
        }
    }
    
    // 删除评论
    let rescomment
    if(commentList.length !== 0){
        for(let comment of commentList){
            rescomment = await db.collection('comment').doc(comment._id).remove()
        }
    }
    
    return {
        article:resarticle,
        like:reslike,
        comment:rescomment
    }
}