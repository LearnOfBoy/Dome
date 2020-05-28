const db = [{name:'张豪'}]
class UserCrl {
    find(ctx) {
        ctx.body=db
    }
    findById(ctx) {
        ctx.body = db[ctx.params.id]
    }
    create(ctx) {
        db.push(ctx.request.body)
        ctx.body =ctx.request.body
    }
    updata(ctx) {
        db[ctx.params.id] =ctx.request.body
        ctx.body=ctx.request.body
    }
    delete(ctx) {
        db.splice(ctx.params.id*1,1)
        ctx.status = 204
    }
}


module.exports = new UserCrl();