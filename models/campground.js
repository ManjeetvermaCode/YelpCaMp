const mongoose=require('mongoose');
const review=require('./review')
const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:review
        }
    ]
})

module.exports=mongoose.model('campground1collections',campgroundSchema);