// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = event.openid
    let mylikeList = (await db.collection('like').where({
        likeAuthor_openId:openid
    }).orderBy('time','desc').get()).data
    let articles = []
    for (let mylike of mylikeList){
        let articleid = mylike.articleId
        let articleinfo = (await db.collection('article').where({
            _id:articleid
        }).orderBy('time','desc').get()).data[0]
        articles.push(articleinfo)
    }
    let article_userinfo = []
    for(let article of articles){
        let openid = article.openid
        let articleId = article._id
        // 根据openid查询个人信息
        let userinfo = (await db.collection('user').where({
            openid:openid
        }).get()).data[0]
        // 获取文章的评论信息
        let commentList = (await db.collection('comment').where({
            articleId:articleId
        }).orderBy('time','desc').get()).data
        // 根据评论的作者id 查询作者 昵称
        let NewcommentList = []
        for (comment of commentList){
            let commentAuthor_openId = comment.commentAuthor_openId
            let comment_authorName = (await db.collection('user').where({
                openid:commentAuthor_openId
            }).get()).data[0].nickname
            let Comment = {
                ...comment,
                comment_authorName:comment_authorName
            }
            NewcommentList.push(Comment)
        }
        // 获取文章点赞信息
        let likelist = (await db.collection('like').where({
            articleId:articleId
        }).orderBy('time','desc').get()).data

        article_userinfo.push({
            article:article,
            author:userinfo,
            commentList:NewcommentList,
            likelist:likelist,
            likesign:true
        })
    }
    return article_userinfo
}