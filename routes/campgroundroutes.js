const express=require('express')
const router=express.Router()
const wrapAsync=require('../utiliti/wrapAsync')
const campground2=require('../controller/campground')
const {isLoggedIn,isauthor,validatecampground}=require('../middleware')
const multer=require('multer')
const upload=multer({desc:'uploads/'})

router.route('/')
    .get(wrapAsync(campground2.index))
    //.post(validatecampground,isLoggedIn,wrapAsync(campground2.CreateNewCamp))
    .post(upload.array('image',2),(req,res)=>{
        console.log(req.body,req.files)
    })

router.get('/new',isLoggedIn,campground2.RenderNewForm)

router.route('/:id')
    .get(wrapAsync(campground2.ShowPage))
    .put(isLoggedIn,isauthor,validatecampground,wrapAsync(campground2.editcamp))
    .delete(isLoggedIn,isauthor,wrapAsync(campground2.deletecamp))

router.get('/:id/edit',isauthor,wrapAsync(campground2.RenderEditPage))

module.exports=router