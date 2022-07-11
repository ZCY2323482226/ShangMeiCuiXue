// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const openid = event.openid

    // 根据openid 查询我的文章
    let myarticles = (await db.collection('article').where({
        openid:openid
    }).orderBy('time','desc').get()).data

    // 根据文章id查询 点赞信息 和 评论信息
    let ariticle_mylikeinfolist_mycommentlist = []
    // 存放我的点赞信息
    let mylikeinfolist = []
    // 存放我的评论信息
    let mycommentlist = []
    for(let myarticle of myarticles){
        let myarticleid = myarticle._id
        let mylikeinfo = (await db.collection('like').where({
            articleId:myarticleid
        }).orderBy('time','desc').get()).data
        let mycommentinfo = (await db.collection('comment').where({
            articleId:myarticleid
        }).orderBy('time','desc').get()).data


        if (mylikeinfo !== undefined) {
            for (let value of mylikeinfo){
                let likeopenid = value.likeAuthor_openId
                let userinfo = (await db.collection('user').where({
                    openid:likeopenid
                }).get()).data[0]
                mylikeinfolist.push({
                    mylikeinfo:value,
                    userinfo:userinfo,
                    articleinfo:myarticle,
                    allcommentinfo:mycommentinfo,
                    alllikeuserinfo:mylikeinfo
                })
            }
        }
        if (mycommentinfo !== undefined) {
            for (let value of mycommentinfo){
                let commentopenid = value.commentAuthor_openId
                let userinfo = (await db.collection('user').where({
                    openid:commentopenid
                }).get()).data[0]
                mycommentlist.push({
                    alllikeuserinfo:mylikeinfo,
                    allcommentinfo:mycommentinfo,
                    userinfo:userinfo,
                    mycommentinfo:value,
                    articleinfo:myarticle
                })
            }
        }
    }

    return {
        mylikeinfolist:mylikeinfolist,
        mycommentlist:mycommentlist
    }
}