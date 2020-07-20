const Router = require('koa-router')
const router = new Router({prefix:'/question'})
const {secret} =require('../config')
const jwt =require('koa-jwt')
const auth = jwt({secret})
const { find,update,findById,create,delete:del,checkQuestioner,checkQuestionExist} =require('../controllers/questions.js')

router.get('/',find)
router.post('/',auth,create)
router.get('/:id',checkQuestionExist,findById)
router.patch('/:id',auth,checkQuestionExist,checkQuestioner,update)
router.delete('/:id',auth,checkQuestionExist,checkQuestioner,del)





module.exports=router