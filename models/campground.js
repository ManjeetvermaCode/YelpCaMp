const mongoose=require('mongoose');
const { campgroundschema } = require('../validationschema');
const review=require('./review');
const user = require('./user');
const Schema=mongoose.Schema;

const campgroundSchema=new Schema({
    title:String,
    image:String,
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:user
    },//adding author field
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:review
        }
    ]
})

campgroundSchema.post('findOneAndDelete',async function(data){
if(data){
    await review.deleteMany({
        _id:{
            $in:data.review
        }
    })
}
})

module.exports=mongoose.model('campground1collections',campgroundSchema);