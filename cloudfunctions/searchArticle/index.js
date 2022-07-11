// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = event.openid
    const searchContent = event.searchContent
    if (searchContent.title === ''){
        var res =  await db.collection('article').orderBy('time','desc').get()
    }else if(searchContent.title === false){
        var res =  await db.collection('article').where({
            openid:openid
        }).orderBy('time','desc').get()
    }
    else{
        let content = searchContent.title
        var res =  await db.collection('article').where({
            title:db.RegExp({
                //content为输入框的值，也是就要查询内容，可以自己定义
                regexp: content,
                //大小写不区分
                options: 'i',
              })
        }).orderBy('time','desc').get()
    }
    let articles = res.data
    let article_userinfo = []

    // 根据openid 获取 文章的点赞信息-- 判断该用户是否点赞
    let openid_like_list = (await db.collection('like').where({
        likeAuthor_openId:openid
    }).get()).data
    // 该数组中存放openid 用户点赞所有文章的id
    let likeAuthor_openId_list = []
    for (let dd of openid_like_list){
        likeAuthor_openId_list.push(dd.articleId)
    }
    
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
        }).get()).data
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
        }).get()).data

        // 如果文章id 存在于 用户的点赞列表中，则在article 数组中点赞标记为ture
        let likeorNot = likeAuthor_openId_list.includes(articleId)

        article_userinfo.push({
            article:{...article,likeorNot:likeorNot},
            author:userinfo,
            commentList:NewcommentList,
            likelist:likelist,
            openid_like_list:openid_like_list
        })
    }
    return article_userinfo
}