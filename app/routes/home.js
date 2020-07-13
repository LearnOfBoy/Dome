const Router = require('koa-router')
const router = new Router()
const {index,uploads} = require('../controllers/home')

router.get('/', index)

router.post('/upload',uploads)




module.exports = router;