const express=require('express')
const router=express.Router()

const wrapAsync=require('../utiliti/wrapAsync')
const expressError = require('../utiliti/expressError')

const {campgroundschema}=require('../validationschema')

const campground = require('../models/campground')
const {isLoggedIn}=require('../middleware')

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

router.get('/new',isLoggedIn,(req,res)=>{
res.render('campgrounds/new')
})

router.post('/',validatecampground,isLoggedIn,wrapAsync(async(req,res)=>{
    const c=new campground(req.body.campground)
    await c.save()
    req.flash('success',"Campground has been created successfully!!")
    res.redirect(`camps/${c._id}`)
}))

router.get('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id).populate('review');
if(!camp){
    req.flash('error',"Campground Not Found")
    return res.redirect('/camps')
}
res.render('campgrounds/detail',{camp})

}))

router.get('/:id/edit',wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id);
if(!camp){//if campground not found we will flash msg and redirect to respective page.
    req.flash('error',"Campground Not Found")
    return res.redirect('/camps')
}
res.render('campgrounds/edit',{camp})
}))

router.put('/:id',isLoggedIn,validatecampground,wrapAsync(async(req,res)=>{
const {id}=req.params
const c=await campground.findByIdAndUpdate(id,{...req.body.campground})
req.flash('success',"Campground has been updated successfully!!")
res.redirect(`/camps/${c._id}`)}))

router.delete('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
const {id}=req.params;
await campground.findByIdAndDelete(id);
req.flash('success','Campground has been deleted successfully!!')
res.redirect('/camps')
}))

module.exports=router