const express=require('express')
const router=express.Router()

const wrapAsync=require('../utiliti/wrapAsync')
const expressError = require('../utiliti/expressError')


const campground = require('../models/campground')
const {isLoggedIn,isauthor,validatecampground}=require('../middleware')


router.get('/',wrapAsync(async(req,res)=>{
    const camp=await campground.find({});
    res.render('campgrounds/index',{camp})


}))

router.get('/new',isLoggedIn,(req,res)=>{
res.render('campgrounds/new')
})

router.post('/',validatecampground,isLoggedIn,wrapAsync(async(req,res)=>{
    const c=new campground(req.body.campground)
    c.author=req.user._id//req.user is a object provided by passport that contain obj of user who has logged in.

    await c.save()
    req.flash('success',"Campground has been created successfully!!")
    res.redirect(`camps/${c._id}`)
}))

router.get('/:id',isLoggedIn,wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id).populate('review').populate('author');
if(!camp){
    req.flash('error',"Campground Not Found")
    return res.redirect('/camps')
}
res.render('campgrounds/detail',{camp})

}))

router.get('/:id/edit',isauthor,wrapAsync(async(req,res)=>{
const camp=await campground.findById(req.params.id);
if(!camp){//if campground not found we will flash msg and redirect to respective page.
    req.flash('error',"Campground Not Found")
    return res.redirect('/camps')
}


res.render('campgrounds/edit',{camp})
}))

router.put('/:id',isLoggedIn,isauthor,validatecampground,wrapAsync(async(req,res)=>{
const {id}=req.params
const c=await campground.findByIdAndUpdate(id,{...req.body.campground})
req.flash('success',"Campground has been updated successfully!!")
res.redirect(`/camps/${c._id}`)
}))

router.delete('/:id',isLoggedIn,isauthor,wrapAsync(async(req,res)=>{
const {id}=req.params
await campground.findByIdAndDelete(id);
req.flash('success','Campground has been deleted successfully!!')
res.redirect('/camps')
}))

module.exports=router