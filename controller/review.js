const campground = require('../models/campground')
const review = require('../models/review')

module.exports.createReview=async(req,res)=>{
    const {id}=req.params
    const cg=await campground.findById(id)
    const r=new review(req.body.review)
    r.author=req.user._id;
    cg.review.push(r)
   await cg.save()
   await r.save()
   req.flash('success',"New review has been added!!")
   res.redirect(`/camps/${id}`)
}

module.exports.deleteReview=async(req,res)=>{
    const {id,reviewid}=req.params
    await review.findByIdAndDelete(reviewid);//1.here we are only deleting review individually,
    await campground.findByIdAndUpdate(id,{$pull:{review:reviewid}})//but we also want to delete [findByIdAndUpdate] the reference to review in array, which can couse problem in a big production app. 
    req.flash('success',"New review has been deleted!!")
    res.redirect(`/camps/${id}`)

}


