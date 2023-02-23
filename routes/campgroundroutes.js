const express=require('express')
const router=express.router()
const wrapAsync=require('../utiliti/wrapAsync')
const expressError = require('../utiliti/expressError')
const {campgroundschema}=require('../validationschema')
const campground = require('../models/campground')

const validatecampground=(req,res,next)=>{//defining express error middleware for campground.
    
    const {error}=campgroundschema.validate(req.body)
    if(error){
        const msg=error.details.map(e=>e.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
}

router.get('/camps',wrapAsync(async(req,res)=>{
    const camp=await campground.find({});
    res.render('campgrounds/index',{camp})


}))
router.get('/camps/new',(req,res)=>{
res.render('campgrounds/new')
})
router.post('/camps',validatecampground,wrapAsync(async(req,res)=>{
    const c=new campground(req.body.campground)
    await c.save()
    res.redirect(`camps/${c._id}`)
}))

router.get('/camps/:id',wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id).populate('review');

res.render('campgrounds/detail',{camp})

}))

router.get('/camps/:id/edit',wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id);
res.render('campgrounds/edit',{camp})

}))
router.put('/camps/:id',validatecampground,wrapAsync(async(req,res)=>{
const {id}=req.params
const c=await campground.findByIdAndUpdate(id,{...req.body.campground})
res.redirect(`/camps/${c._id}`)


}))
router.delete('/camps/:id',wrapAsync(async(req,res)=>{
const {id}=req.params;
await campground.findByIdAndDelete(id);
res.redirect('/camps')

}))

module.exports=router