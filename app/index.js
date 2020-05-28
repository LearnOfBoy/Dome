const Kao =require('koa')
const bodyparser = require('koa-bodyparser')
const app =new Kao();
const routing = require('./routes')

app.use(bodyparser())
routing(app)


app.listen(3000,() => {
    console.log("the project is runing")
})