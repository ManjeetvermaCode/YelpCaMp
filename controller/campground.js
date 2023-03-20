const campground = require('../models/campground')

module.exports.index=async(req,res)=>{
    const camp=await campground.find({});
    res.render('campgrounds/index',{camp})
}
module.exports.RenderNewForm=(req,res)=>{
    res.render('campgrounds/new')
    }

module.exports.CreateNewCamp=async(req,res)=>{
    const c=new campground(req.body.campground)
    c.author=req.user._id//setting campground author to req.user._id when a new campground is created.req.user is a object provided by passport that contain obj of user who has logged in.

    await c.save()
    req.flash('success',"Campground has been created successfully!!")
    res.redirect(`camps/${c._id}`)
}

module.exports.ShowPage=async(req,res)=>{
    const camp = await campground.findById(req.params.id).populate({ path: 'review', populate: { path: 'author' } }).populate('author');
if(!camp){
    req.flash('error',"Campground Not Found")
    return res.redirect('/camps')
}
res.render('campgrounds/detail',{camp})

}

module.exports.RenderEditPage=async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    if(!camp){//if campground not found we will flash msg and redirect to respective page.
        req.flash('error',"Campground Not Found")
        return res.redirect('/camps')
    }
    res.render('campgrounds/edit',{camp})
}

module.exports.editcamp=async(req,res)=>{
    const {id}=req.params
    const c=await campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success',"Campground has been updated successfully!!")
    res.redirect(`/camps/${c._id}`)
    }

module.exports.deletecamp=async(req,res)=>{
    const {id}=req.params
    await campground.findByIdAndDelete(id);
    req.flash('success','Campground has been deleted successfully!!')
    res.redirect('/camps')
    }