const Router = require('koa-router')
const router = new Router({prefix:'/question/:questionId/answer/:answerId/comments'})
const {secret} =require('../config')
const jwt =require('koa-jwt')
const auth = jwt({secret})
const {find,findById,update,delete:del,checkCommentator,checkcomment,create} =require('../controllers/comment')
const { route } = require('./answer')


router.get('/',find)
router.post('/',auth,create)
router.get('/:id',checkcomment,findById)
router.patch('/:id',auth,checkcomment,checkCommentator,update)
router.delete('/:id',auth,checkcomment,checkCommentator,del)





module.exports =router