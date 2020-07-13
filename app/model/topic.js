const mongoose = require('mongoose')

const {Schema,model} = mongoose

const topiicSchema = new Schema({
    __v:{type: Number, select: false},
    name:{type:String, required: true},
    avatar_url:{ type: String, required:false},
    introduction:{type:String,select:true,required:false}
})

module.exports = model('Topic',topiicSchema)