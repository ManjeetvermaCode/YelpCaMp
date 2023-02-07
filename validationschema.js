const joi=require('joi')
//we are making this file becouse evnetually we'll have many other validation schemas like for review, comment,etc.

module.exports.campgroundschema=joi.object({
    campground:joi.object({
        title:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required()
     }).required()
    })

module.exports.reviewschema=joi.object({
    review:joi.object({
        rating:joi.number().required(),
        body:joi.string().required()
    }).required()
})