const mongoose =require("mongoose")

const {Schema,model} = mongoose

const questionSchma=new Schema({
    __v : {type:Number,select:false},
    title:{type:String,select:true,required:true},
    decription:{type:String},
    questioner:{type:Schema.Types.ObjectId,ref:'User',select:true,required:true},
    topics:{
        type:[{type:Schema.Types.ObjectId,ref:'Topic'}],
        select:false
    }
})
module.exports =model('Question',questionSchma)