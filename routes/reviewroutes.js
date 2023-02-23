const express=require('express')
const router=express.Router({mergeParams:true})//express router cannot read the property of camp_id, becouse it is in index.js file, so we'll use 'mergeParams'

const wrapAsync=require('../utiliti/wrapAsync')
const expressError = require('../utiliti/expressError')

const campground = require('../models/campground')
const review = require('../models/review')

const {reviewschema}=require('../validationschema')


const validatereview=(req,res,next)=>{//defining express error middleware for review.
    const {error}=reviewschema.validate(req.body)
    if(error){
        
        const msg=error.details.map(e=>e.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
}

router.post('/',validatereview,wrapAsync(async(req,res)=>{
    const {id}=req.params
    const cg=await campground.findById(id)
    const r=new review(req.body.review)
    cg.review.push(r)
   await cg.save()
   await r.save()
   res.redirect(`/camps/${id}`)
}))

router.delete('/:reviewid',wrapAsync(async(req,res)=>{
    const {id,reviewid}=req.params
    
    await review.findByIdAndDelete(reviewid);//1.here we are only deleting review individually,
    await campground.findByIdAndUpdate(id,{$pull:{review:reviewid}})//but we also want to delete [findByIdAndUpdate] the reference to review in array, which can couse problem in a big production app. 
    res.redirect(`/camps/${id}`)

}))

module.exports=router