// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const sign = event.sign
    const likeinfo = event.likeinfo
    let resarticlelike = await (await db.collection('article').doc(likeinfo.articleId).get()).data.likes
    if(sign === 'add'){
        let res = await db.collection('like').add({
            data:likeinfo
        })
        let ress = await db.collection('article').doc(likeinfo.articleId).update({
            data:{
                likes:resarticlelike+1
            }
        })
        return {
            code:200,
            res:ress,
            msg:'添加点赞信息成功'
        }
    }else{
        let res = await db.collection('like').where({
            articleId:likeinfo.articleId,
            likeAuthor_openId:likeinfo.likeAuthor_openId
        }).remove()
        let ress = await db.collection('article').doc(likeinfo.articleId).update({
            data:{
                likes:resarticlelike-1
            }
        })
        return {
            code:200,
            res:res,
            msg:'删除点赞信息成功'
        }
    }
}