const express=require('express')
const mongoose = require('mongoose')
const app=express()
const path=require('path')
const campground = require('./models/campground')
const review = require('./models/review')
const methodoverride=require('method-override')
const ejsMate=require('ejs-mate')
const wrapAsync=require('./utiliti/wrapAsync')
const expressError = require('./utiliti/expressError')
const {campgroundschema, reviewschema}=require('./validationschema')



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
const validatereview=(req,res,next)=>{//defining express error middleware for review.
    const {error}=reviewschema.validate(req.body)
    if(error){
        
        const msg=error.details.map(e=>e.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
}

app.use(methodoverride('_method'))
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))
app.engine('ejs',ejsMate)

mongoose.connect('mongodb://localhost:27017/yelpCampDb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })
app.get('/camps',wrapAsync(async(req,res)=>{
        const camp=await campground.find({});
        res.render('campgrounds/index',{camp})
   
    
}))
app.get('/camps/new',(req,res)=>{
    res.render('campgrounds/new')
})
app.post('/camps',validatecampground,wrapAsync(async(req,res)=>{
    //if(!req.body.campground) throw new expressError('invalid camp data',400)
    
        const c=new campground(req.body.campground)
        await c.save()
        res.redirect(`camps/${c._id}`)



}))

app.get('/camps/:id',wrapAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id).populate('review');
    
    res.render('campgrounds/detail',{camp})

}))

app.get('/camps/:id/edit',wrapAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp})

}))
app.put('/camps/:id',validatecampground,wrapAsync(async(req,res)=>{
    const {id}=req.params
    const c=await campground.findByIdAndUpdate(id,{...req.body.campground})//spread opr used for object to be expanded in places where zero or more key-value pairs (for object literals) are expected.
    res.redirect(`/camps/${c._id}`)


}))
app.delete('/camps/:id',wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/camps')

}))

app.post('/camps/:id/reviews',validatereview,wrapAsync(async(req,res)=>{
    const {id}=req.params
    const cg=await campground.findById(id)
    const r=new review(req.body.review)
    cg.review.push(r)
   await cg.save()
   await r.save()
   res.redirect(`/camps/${id}`)
}))

app.delete('/camps/:id/reviews/:reviewid',wrapAsync(async(req,res)=>{
    const {id,reviewid}=req.params
    
    await review.findByIdAndDelete(reviewid);//1.here we are only deleting review individually,
    await campground.findByIdAndUpdate(id,{$pull:{review:reviewid}})
    res.redirect(`/camps/${id}`)

}))



app.get('/',async (req,res)=>{
    res.send('Home Page')
})

app.all('*',(req,res,next)=>{
    next(new expressError('invalid route',404))//will get call if not route matches, allows us to customize error msg and status code.
})

app.use((err,req,res,next)=>{
    const {statuscode=500}=err
    if(!err.message) err.message='someting went wrong'
    res.status(statuscode).render('error',{err})
})

app.listen('3000',(req,res)=>{
    console.log('hosted on port 3000')
})