const express=require('express')
const mongoose = require('mongoose')
const app=express()
const path=require('path')
const campground = require('./models/campground')
const methodoverride=require('method-override')
const ejsMate=require('ejs-mate')
const wrapAsync=require('./utiliti/wrapAsync')

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
app.post('/camps',wrapAsync(async(req,res)=>{
        const c=new campground(req.body.campground)
        await c.save()
        res.redirect(`camps/${c._id}`)
   

}))
app.get('/camps/:id',wrapAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/detail',{camp})

}))

app.get('/camps/:id/edit',wrapAsync(async(req,res)=>{
    const camp=await campground.findById(req.params.id);
    res.render('campgrounds/edit',{camp})

}))
app.put('/camps/:id',wrapAsync(async(req,res)=>{
    const {id}=req.params
    const c=await campground.findByIdAndUpdate(id,{...req.body.campground})//spread opr used for object to be expanded in places where zero or more key-value pairs (for object literals) are expected.
    res.redirect(`/camps/${c._id}`)


}))
app.delete('/camps/:id',wrapAsync(async(req,res)=>{
    const {id}=req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/camps')

}))



app.get('/',async (req,res)=>{
    res.send('Home Page')
})

app.use((err,req,res,next)=>{
    res.send('ooh my god, something went wrong!')
})

app.listen('3000',(req,res)=>{
    console.log('hosted on port 3000')
})