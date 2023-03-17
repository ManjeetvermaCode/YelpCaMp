const expressError = require('./utiliti/expressError')
const campground = require('./models/campground')
const review=require('./models/review')
const {campgroundschema,reviewschema}=require('./validationschema')


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){//this method is provided by passport
        req.session.returnTo=req.originalUrl;//will store if unloggedin user try to access secure features.
        req.flash('error','You must signed in!!!')
       return res.redirect('/login')//return is needed other wise we'll get error ( Cannot set headers after they are sent to the client)
    }//if user is not registered next block of code will also get executed.
    next();
}

module.exports.validatecampground=(req,res,next)=>{//defining express error middleware for campground.
    const {error}=campgroundschema.validate(req.body)
    if(error){
        const msg=error.details.map(e=>e.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
}

module.exports.isauthor=async(req,res,next)=>{
    const {id}=req.params
    const c2=await campground.findById(id)
    if(!c2.author.equals(req.user._id)){
        req.flash('error','You do not have permission to edit')
        return res.redirect(`/camps/${id}`)
    }
    next()
}
module.exports.isreviewauthor=async(req,res,next)=>{
    const {id,reviewid}=req.params
    const newreview=await review.findById(reviewid)
    if(!newreview.author.equals(req.user._id)){
        req.flash('error','You do not have permission to edit')
        return res.redirect(`/camps/${id}`)
    }
    next()
}

module.exports.validatereview=(req,res,next)=>{//defining express error middleware for review.
    const {error}=reviewschema.validate(req.body)
    if(error){
        
        const msg=error.details.map(e=>e.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
}