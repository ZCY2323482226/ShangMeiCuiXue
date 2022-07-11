// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const articalId = event.articalId
    const openid = event.openid
    let comments_likes = []
    // 获取文章点赞信息
    let likelist = (await db.collection('like').where({
        articleId:articalId
    }).get()).data
    // 根据点赞用户的id查询用户的昵称，头像
    let NewlikeList = []
    for(like of likelist){
        let likeAuthor_openId = like.likeAuthor_openId
        let likeAuthor_name = (await db.collection('user').where({
            openid : likeAuthor_openId
        }).get()).data[0].nickname
        let likeAuthor_avatarUrl = (await db.collection('user').where({
            openid : likeAuthor_openId
        }).get()).data[0].avatarUrl
        let Likes = {
            ...like,
            likeAuthor_name:likeAuthor_name,
            likeAuthor_avatarUrl:likeAuthor_avatarUrl
        }
        NewlikeList.push(Likes)
    }
    // 获取文章的评论信息
    let commentList = (await db.collection('comment').where({
        articleId:articalId
    }).get()).data
    // 根据评论的作者id 查询作者 昵称头像
    let NewcommentList = []
    for (comment of commentList){
        let commentAuthor_openId = comment.commentAuthor_openId
        let comment_authorName = (await db.collection('user').where({
            openid:commentAuthor_openId
        }).get()).data[0].nickname
        let commentAuthor_avatarUrl = (await db.collection('user').where({
            openid:commentAuthor_openId
        }).get()).data[0].avatarUrl
        let Comment = {
            ...comment,
            comment_authorName:comment_authorName,
            commentAuthor_avatarUrl:commentAuthor_avatarUrl
        }
        NewcommentList.push(Comment)
    }
    console.log(NewcommentList);
    comments_likes.push({
        commentList:NewcommentList,
        likelist:NewlikeList,
    })

    console.log(likelist);
    return comments_likes
}