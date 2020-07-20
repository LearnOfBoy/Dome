const Answer = require('../model/answer')
class AnswerCtr{
    async find(ctx){
        const {per_page = 10}=ctx.query
        const page = Math.max(ctx.query.page*1,1)-1
        const perPage = Math.max(per_page*1,1)
        ctx.body = await Answer.find({content:new RegExp(ctx.query.q),questionId:ctx.params.questionId})
        .limit(perPage)
        .skip(page*perPage)
    }
  
    async checkAnswerExist(ctx,next){
        const answer = await Answer.findById(ctx.params.id).select("+answerer")
        if(!answer){
            ctx.throw(404,"该回答不存在")
        }
        if(ctx.params.questionId && answer.questionId!==ctx.params.questionId){
            ctx.throw(404,'该回答不存在此答案')
        }
        ctx.state.answer = answer
        await next()
    }

    async findById(ctx){
        const {fields = ''} = ctx.query
        const selectFields =fields.split(';').filter(f=>f).map(f=>" +"+f).join("")
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer')
        ctx.body = answer
    }

    async create (ctx){
        ctx.verifyParams({
            content:{type:'string',required:true},
        })
        const answerer = ctx.state.user._id
        const {questionId} = ctx.params
        const answer = await new Answer({...ctx.request.body,answerer,questionId}).save()
        ctx.body = answer
    }

    async checkAnswerOwer(ctx,next){
        const {answer} = ctx.state
        if(answer.answerer.toString()!==ctx.state.user._id){
            ctx.throw('401','你没有权限')
        }
        await next()
    }

    async update(ctx){
        ctx.verifyParams({
            conntent:{type:"string",required:false}
        })
         await ctx.state.answer.updateOne(ctx.request.body)
        ctx.body = ctx.state.answer
    }

    async delete(ctx){
        await Answer.findByIdAndRemove(ctx.params.id)
        ctx.status = 204
    }
}
module.exports = new AnswerCtr()