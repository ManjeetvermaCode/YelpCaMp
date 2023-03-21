const express=require('express')
const router=express.Router({mergeParams:true})//express router cannot read the property of camp_id, becouse it is in index.js file, so we'll use 'mergeParams'
const wrapAsync=require('../utiliti/wrapAsync')
const {validatereview}=require('../middleware')
const {isLoggedIn,isreviewauthor}=require('../middleware')
const reviews=require('../controller/review')

router.post('/',validatereview,wrapAsync(reviews.createReview))

router.delete('/:reviewid',isLoggedIn,isreviewauthor,wrapAsync(reviews.deleteReview))

module.exports=router