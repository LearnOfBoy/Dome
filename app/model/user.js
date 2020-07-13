const mongoose =require('mongoose')
const { Schema,model} = mongoose

const userSchema = new Schema({
    __v: {type: Number, select: false},
    name: {type: String, required: true },
    password:{type: String,required: true, select: false},
    age: {type: Number,default:0},
    avatar_url:{type:String},
    gender:{type:String,enum:['男','女'],default:'男',required:true},
    headline:{type:String},
    locations:{type:[{type:Schema.Types.ObjectId, ref:'Topic'}],select:false},
    business:{type: Schema.Types.ObjectId, ref: 'Topic', select:false},
    employments:{
        type:[{
            company:{type:Schema.Types.ObjectId, ref: 'Topic'},
            job:{type:Schema.Types.ObjectId, ref: 'Topic'}
        }],
        select:false
    },
    educations:{
        type:[{
            school:{type:Schema.Types.ObjectId, ref: 'Topic'},
            major:{type:Schema.Types.ObjectId, ref: 'Topic'},
            diploma:{type:Number,enum:[1,2,3,4,5]},
            enterance_year:{type:Number},
            graducation_year:{type:Number}
        }],
        select:false
    },
    following:{
        type:[{type:Schema.Types.ObjectId,ref:'User'}],
        select:false
    },
    followingTopic:{
        type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
        select:false
    }
})

module.exports = model('User',userSchema)