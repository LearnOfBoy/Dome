const Router = require('koa-router')
const router = new Router({prefix:'/question/:questionId/answer'})
const jwt = require('koa-jwt')
const {secret} = require('../config')
const auth = jwt({secret})
const {find,findById,delete:del,update,checkAnswerExist,checkAnswerOwer,create}  =require('../controllers/answer')



router.get('/',find)
router.post('/' ,auth,create)
router.get('/:id',checkAnswerExist,findById)
router.patch('/:id',auth,checkAnswerExist,checkAnswerOwer,update)
router.delete('/:id',auth,checkAnswerExist,checkAnswerOwer,del)






module.exports =router