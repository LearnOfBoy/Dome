const Kao =require('koa')
const koaBody = require("koa-body")
const error= require("koa-json-error")
const app =new Kao();
const koaStatic =require('koa-static')
const routing = require('./routes')
const parameter  =require('koa-parameter')
const mongoose = require('mongoose')
const path = require('path')
const {connectionStr}=require('./config')
mongoose.connect(connectionStr,{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useFindAndModify:false
},()=>{
    console.log('this.db run in success')
})
mongoose.connection.on('error',console.error);

app.use(error({
    postFormat: (e,{stack, ...rest}) =>process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}))
app.use(koaBody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'public/upload'),
        keepExtensions:true
    }
}))
app.use(koaStatic(path.join(__dirname,'public')))
app.use(parameter(app));
routing(app)


app.listen(3000,() => {
    console.log("the project is runing")
})