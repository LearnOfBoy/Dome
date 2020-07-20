const Questions = require('../model/questions')

class QuestionCtr{
    //查找所有问题，模糊查询，及分页查询
    async find(ctx){
        const {per_page = 10} = ctx.query;
        const page = Math.max(ctx.query.page*1,1)-1
        const parPage = Math.max(per_page*1-1)
        const q =new RegExp(ctx.query.q)
        ctx.body = await Questions.find({$or:[{title:q},{decription:q}]}).limit(parPage).skip(page*parPage)
    }
    //检查问题是否存在
    async checkQuestionExist (ctx,next){
        const question = await Questions.findById(ctx.params.id)
        if(!question){
            ctx.throw(404,"问题不存在")
        }
        ctx.state.question = question
        await next()
    }
    //查找特定的问题
    async findById (ctx){
        const {fileds =''} =ctx.query
        const selectFields =fileds.split(';').filter(f=>f).map(f=>' ++f').join('')
        const question = await Questions.findById(ctx.params.id).select(selectFields).populate('questioner topics')
        ctx.body =question
    }
    //创建一个问题
    async create (ctx){
        ctx.verifyParams({
            title: {type:'string', required:true},
            decription: {type:'string' ,required:false}
        })
        const question = await new Questions({...ctx.request.body, questioner:ctx.state.user._id}).save()
        ctx.body = question
    }
    //更新问题
    async update(ctx){
        ctx.verifyParams({
            title:{type:'string',required:false},
            decription:{type:'string',required:false}
        })
       await ctx.state.question.updateOne(ctx.request.body)
       ctx.body = ctx.state.question
    }
    //删除问题
    async delete(ctx){
        await Questions.findOneAndRemove(ctx.params.id)
        
        ctx.status =204 
    }
    // 问题操作权限
    async checkQuestioner(ctx,next){
        const {question} =ctx.state
        if(question.questioner.toString()!==ctx.state.user._id){ctx.throw(404,'没有权限')}
        await next()

    }

}
module.exports = new QuestionCtr()