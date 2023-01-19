const express=require('express')
const mongoose = require('mongoose')
const app=express()
const path=require('path')
const campground = require('./models/campground')
const methodoverride=require('method-override')
const ejsMate=require('ejs-mate')

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
app.get('/camps',async(req,res,next)=>{
    try{
        const camp=await campground.find({});
        res.render('campgrounds/index',{camp})
    }catch(e){
        next(e)
    }
    
})
app.get('/camps/new',(req,res)=>{
    res.render('campgrounds/new')
})
app.post('/camps',async(req,res,next)=>{
    try{
        const c=new campground(req.body.campground)
        await c.save()
        res.redirect(`camps/${c._id}`)
    }catch(err){
        next(err)
    }

})
app.get('/camps/:id',async(req,res,next)=>{
  try{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/detail',{camp})
}catch(e){
    next(e)
}
})

app.get('/camps/:id/edit',async(req,res,next)=>{
    try{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp})
}catch(e){
    next(e)
}
})
app.put('/camps/:id',async(req,res,next)=>{
    try{
    const {id}=req.params
    const c=await campground.findByIdAndUpdate(id,{...req.body.campground})//spread opr used for object to be expanded in places where zero or more key-value pairs (for object literals) are expected.
    res.redirect(`/camps/${c._id}`)
}catch(e){
    next(e)
}

})
app.delete('/camps/:id',async(req,res,next)=>{
    try{
    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/camps')
}catch(e){
    next(e)
}
})



app.get('/',async (req,res)=>{
    res.send('Home Page')
})
app.use((err,req,res,next)=>{
    res.send('something went wrong!')
})

app.listen('3000',(req,res)=>{
    console.log('hosted on port 3000')
})