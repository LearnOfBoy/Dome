const Router =require('koa-router')
const router = new Router({prefix:'/user'})
const { find ,findById,create,updata,delete:del} = require('../controllers/user')

router.get('/', find)

router.post('/', create)

router.get('/:id',findById)

router.put(':id',updata)

router.delete('/:id',del)

module.exports=router