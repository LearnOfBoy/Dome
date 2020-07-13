const path =require('path')
class HomeCrl {
    index(ctx){
        ctx.body = "<h1>你好啊</h1>"
    }
    uploads(ctx){
        const file =ctx.request.files.file
       
        const baseName = path.basename(file.path)
     
        ctx.body = {url:`${ctx.origin}/upload/${baseName}`}
    }
}


module.exports = new HomeCrl();