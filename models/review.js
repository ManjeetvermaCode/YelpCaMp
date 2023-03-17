const mongoose=require('mongoose')
const schema =mongoose.Schema
const user = require('./user');


const reviewSchema=new schema({
    rating:Number,
    body:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user
    }
})

module.exports=mongoose.model('Review',reviewSchema)