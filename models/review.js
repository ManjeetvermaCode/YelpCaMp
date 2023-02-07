const mongoose=require('mongoose')
const schema =mongoose.Schema

const reviewSchema=new schema({
    rating:Number,
    body:String
    
})

module.exports=mongoose.model('Review',reviewSchema)