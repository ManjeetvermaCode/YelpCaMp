const express=require('express')
const router=express.Router()

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

router.get('/',wrapAsync(async(req,res)=>{
    const camp=await campground.find({});
    res.render('campgrounds/index',{camp})


}))
router.get('/new',(req,res)=>{
res.render('campgrounds/new')
})
router.post('/',validatecampground,wrapAsync(async(req,res)=>{
    const c=new campground(req.body.campground)
    await c.save()
    req.flash('success',"Campground has been created successfully!!")
    res.redirect(`camps/${c._id}`)
}))

router.get('/:id',wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id).populate('review');

res.render('campgrounds/detail',{camp})

}))

router.get('/:id/edit',wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id);
res.render('campgrounds/edit',{camp})

}))
router.put('/:id',validatecampground,wrapAsync(async(req,res)=>{
const {id}=req.params
const c=await campground.findByIdAndUpdate(id,{...req.body.campground})
req.flash('upd',"Campground has been updated successfully!!")
res.redirect(`/camps/${c._id}`)


}))
router.delete('/:id',wrapAsync(async(req,res)=>{
const {id}=req.params;
await campground.findByIdAndDelete(id);
req.flash('del','Campground has been deleted successfully!!')
res.redirect('/camps')

}))

module.exports=router