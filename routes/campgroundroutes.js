const express=require('express')
const router=express.Router()
const wrapAsync=require('../utiliti/wrapAsync')
const campground2=require('../controller/campground')
const {isLoggedIn,isauthor,validatecampground}=require('../middleware')

const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({ storage })


router.route('/')
    .get(wrapAsync(campground2.index))
    //.post(validatecampground,isLoggedIn,wrapAsync(campground2.CreateNewCamp))
    .post(upload.single('image'),(req,res)=>{
        console.log(req.body,req.file)
   res.send('it worked')
    })

router.get('/new',isLoggedIn,campground2.RenderNewForm)

router.route('/:id')
    .get(wrapAsync(campground2.ShowPage))
    .put(isLoggedIn,isauthor,validatecampground,wrapAsync(campground2.editcamp))
    .delete(isLoggedIn,isauthor,wrapAsync(campground2.deletecamp))

router.get('/:id/edit',isauthor,wrapAsync(campground2.RenderEditPage))

module.exports=router