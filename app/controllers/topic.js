const Topic = require('../model/topic')
const User = require('../model/user')


class TopicCtr{
    async find(ctx){
        const {par_page=10}= ctx.query
        const page =Math.max(ctx.query.page*1)-1;
        const perPage = Math.max(par_page*1,1)
        ctx.body = await Topic.find({name: new RegExp(ctx.query.q)}).limit(perPage).skip(page*perPage)

    }
    async findById(ctx){
        const {fields=''} = ctx.query
        const selectFields =fields.split(';').filter(f=>f).map(f=>" +"+f).join('')
        const topic  = await Topic.findById(ctx.params.id).select(selectFields)
        ctx.body =topic
    }
    async create(ctx){
        ctx.verifyParams({
            name:{type:'string',required:true},
            avatar_url:{type:'string',required:false},
            introduction:{type:'string',required:false}
        })
        const topic = await new Topic(ctx.request.body).save()
        ctx.body = topic
    }
    async updata(ctx){
        ctx.verifyParams({
            name:{type:'string',required:false},
            avatar_url:{type:'string',required:false},
            introduction:{type:'string',required:false}
        })
        const topic = await Topic.findByIdAndUpdate(ctx.params.id,ctx.request.body)
        ctx.body = topic
    }
    async checkTopicExist(ctx,next){
        const topic = await Topic.findById(ctx.params.id)
        if(!topic){
            ctx.throw(404,"话题不存在")
        }
        await next()
    }
    async listTopicFllower(ctx){
        const user = await User.find({followingTopic:ctx.params.id})
        ctx.body = user
    }
}
module.exports = new TopicCtr()