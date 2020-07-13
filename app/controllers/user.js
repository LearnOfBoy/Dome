const User = require('../model/user')
const jsonwebtoken = require('jsonwebtoken')
const {
    secret
} = require('../config');
const { use } = require('../routes/user');
class UserCrl {
    async find(ctx) {
        const {par_page=10}= ctx.query
        const page =Math.max(ctx.query.page*1)-1;
        const perPage = Math.max(par_page*1,1)
        ctx.body = await User.find({name:new RegExp(ctx.query.q)}).limit(perPage).skip(page*perPage)
    }
    async findById(ctx) {
        const {fields=''} =ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=>" +" +f).join('')
        const populateStr = fields.split(';').filter(f=>f).map(f=>{
            if(f==='employments'){
                return 'employments.company employments.job'
            }
            if(f==='educations'){
                return 'educations.school education.major'
            }
            return f
        }).join(' ')
        const user = await User.findById(ctx.params.id).select(selectFields).populate(populateStr)
        if (!user) {
            ctx.throw(404, '用户不存在')
        }
        ctx.body = user
    }
    async create(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            age: {
                type: 'number',
                required: false
            },
            password: {
                type: 'string',
                required: true
            }
        })
        const {
            name
        } = ctx.request.body;
        const repeatUser = await User.findOne({
            name
        })
        if (repeatUser) {
            ctx.throw(409, "已经存在用户，另寻其他名称")
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user
    }
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, "你没有权限这么做")
        }
        await next()
    }
    async updata(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: false
            },
            age: {
                type: 'number',
                required: false
            },
            password: {
                type: 'string',
                required: false
            },
            avatar_url: {
                type: "string",
                required: false
            },
            gender: {
                type: 'string',
                required: false
            },
            headline: {
                type: 'string',
                required: false
            },
            locations: {
                type: 'array',
                itemType: 'string',
                required: false
            },
            business: {
                type: 'string',
                required: false
            },
            employments: {
                type: 'array',
                itemType: "object",
                required: false
            },
            educations: {
                type: 'array',
                itemType: "object",
                required: false
            },

        })
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body)
        if (!user) {
            ctx.throw(404, "未找到用户啊")
        }
        ctx.body = user
    }

    async delete(ctx) {
        const user = await User.findOneAndRemove(ctx.params.id)
        if (!user) {
            throw (404, "未找到用户")
        }
        ctx.status = 204
    }
    async login(ctx) {
        ctx.verifyParams({
            name: {
                type: 'string',
                required: true
            },
            password: {
                type: 'string',
                required: true
            }
        })
        const user = await User.findOne(ctx.request.body);
        if (!user) {
            ctx.throw(401, '用户名或者密码不正确')
        }
        const {
            _id,
            name
        } = user
        const token = jsonwebtoken.sign({
            _id,
            name
        }, secret, {
            expiresIn: '1d'
        })
        ctx.body = {
            token
        }

    }
    async listFolloing(ctx){
        const user = await User.findById(ctx.params.id).select('+following').populate('following')
        if(!user){
            ctx.throw(404,"用户未找到")
        }
        ctx.body =user.following
    }
  
    async checkUserExist(ctx,next){
        const user = await User.findById(ctx.params.id)
        if(!user){
            ctx.throw(404,"用户不存在")
        }
        await next()
    }
    async follow(ctx){
        const me = await User.findById(ctx.state.user).select("+following")
        if(!me.following.map(id=>id.toString()).includes(ctx.params.id)){
            me.following.push(ctx.params.id)
            me.save()
        }
        ctx.status= 204;
    }
    async unfollow(ctx){
        const me = await User.findById(ctx.state.user).select("+following")
        const index = me.following.map(id=>id.toString()).indexOf(ctx.params.id)
        if(index >-1){
            me.following.splice(index,1)
            me.save()
        }
        ctx.status= 204;
    }
    async listFollower(ctx){
        const users = await User.find({following:ctx.params.id})
        ctx.body= users
    }
    async followTopic(ctx){
        const me = await User.findById(ctx.state.user).select("+followingTopic")
        if(!me.followingTopic.map(id=>id.toString()).includes(ctx.params.id)){
            me.followingTopic.push(ctx.params.id)
            me.save()
        }
        ctx.status= 204;
    }
    async unfollowTopic(ctx){
        const me = await User.findById(ctx.state.user).select("+followingTopic")
        const index = me.followingTopic.map(id=>id.toString()).indexOf(ctx.params.id)
        if(index >-1){
            me.followingTopic.splice(index,1)
            me.save()
        }
        ctx.status= 204;
    }
    //获取用户关注的话题
    async listFollowingTopic(ctx){
        const user = await User.findById(ctx.params.id).select('+followingTopic').populate('followingTopic')
        if(!user){ctx.throw(404,'用户不存在');}
        ctx.body = user.followingTopic
    }
}


module.exports = new UserCrl();