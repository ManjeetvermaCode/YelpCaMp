const express=require('express')
const router=express.Router()

const wrapAsync=require('../utiliti/wrapAsync')

const campground2=require('../controller/campground')
const campground = require('../models/campground')



//const campground = require('../models/campground')
const {isLoggedIn,isauthor,validatecampground}=require('../middleware')


router.get('/',wrapAsync(campground2.index))

router.get('/new',isLoggedIn,campground2.RenderNewForm)

router.post('/',validatecampground,isLoggedIn,wrapAsync(campground2.CreateNewCamp))

router.get('/:id',wrapAsync(campground2.ShowPage))

router.get('/:id/edit',isauthor,wrapAsync(campground2.RenderEditPage))

router.put('/:id',isLoggedIn,isauthor,validatecampground,wrapAsync(campground2.editcamp))


router.delete('/:id',isLoggedIn,isauthor,wrapAsync(campground2.deletecamp))

module.exports=router