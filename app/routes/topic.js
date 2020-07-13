const Router = require('koa-router')
const jwt =require('koa-jwt')
const router = new Router()
const {find,findById,updata,create,listTopicFllower,checkTopicExist} = require('../controllers/topic')
const {secret} = require('../config')



const auth =jwt({secret})


router.get('/topic',auth,find)
router.get('/topic/:id',auth,checkTopicExist,findById)
router.post('/topic',auth,create)
router.patch('/topic/:id',auth,checkTopicExist,updata)
router.get('/topic/:id/follower',checkTopicExist,listTopicFllower)


module.exports = router