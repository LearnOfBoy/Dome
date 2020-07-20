const Router =require('koa-router')
// const jsonwebtoken =require('jsonwebtoken')
const jwt =require('koa-jwt')
const {secret} = require('../config')
const router = new Router()
const { find ,findById,create,updata,delete:del,login,checkOwner,
    listFolloing,follow,unfollow,listFollower,checkUserExist,unfollowTopic
    ,followTopic,listFollowingTopic,listQuestions
    ,listlLikingAnswer,listDisLikingAnswer,likingAnswer,
    unLikingAnswer,disLikingAnswer,unDisLikingAnswer
    ,listCollectingAnswer,collectingAnswer, uncollectingAnswer
} = require('../controllers/user')
const {checkTopicExist} =require('../controllers/topic')
const {checkAnswerExist} = require('../controllers/answer')
//原生jsonwebtoakoken 
// const auth = async (ctx,next)=>{
//     const {authorization='' } = ctx.request.header
//     const token =authorization.replace('Bearer ','')
//     try{
//         const user = jsonwebtoken.verify(token,secret)
//         ctx.state.user = user
//     }catch(err){
//         ctx.throw(401,err.message)
//     }
//     await next()
// }
const auth = jwt({secret})


//用户的一众操作
router.get('/user', find)
router.post('/user', create)
router.get('/user/:id',findById)
router.patch('/user/:id',auth,checkOwner,updata)
router.delete('/user/:id',auth,checkOwner,del)
router.post('/user/login',login)


//关注粉丝接口等
router.get('/user/:id/following',listFolloing)
router.put('/user/following/:id',auth,checkUserExist,follow)
router.delete('/user/following/:id',auth,checkUserExist,unfollow)
router.get('/user/:id/follower',listFollower)

//话题的关注
router.put('/user/followingTopic/:id',auth,checkTopicExist,followTopic)
router.delete('/user/followingTopic/:id',auth,checkTopicExist,unfollowTopic)
router.get('/user/:id/followingTopic',listFollowingTopic)
//用户的问题列表
router.get('/user/:id/question',listQuestions)
//用户答案的喜恶
//点赞
router.get('/user/:id/likingAnswer',listlLikingAnswer)
router.put('/user/likingAnswer/:id',auth,checkAnswerExist,likingAnswer,unDisLikingAnswer)
router.delete('/user/likingAnswer/:id',auth,checkAnswerExist,unLikingAnswer)
//踩
router.get('/user/:id/disLikingAnswer',listDisLikingAnswer)
router.put('/user/disLikingAnswer/:id',auth,checkAnswerExist,disLikingAnswer,unLikingAnswer)
router.delete('/user/disLikingAnswer/:id',auth,checkAnswerExist,unDisLikingAnswer)

//收藏答案
router.get('/user/:id/collectingAnswer',listCollectingAnswer)
router.put('/user/collectingAnswer/:id',auth,checkAnswerExist,collectingAnswer)
router.delete('/user/collectingAnswer/:id',auth,checkAnswerExist,uncollectingAnswer)
module.exports=router