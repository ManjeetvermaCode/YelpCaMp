const express=require('express')
const mongoose = require('mongoose')
const app=express()
const path=require('path')
const campground = require('./models/campground')
const review = require('./models/review')
const methodoverride=require('method-override')
const ejsMate=require('ejs-mate')
const expressError = require('./utiliti/expressError')
const session=require('express-session')
const flash=require('connect-flash')

const camproutes=require('./routes/campgroundroutes')
const reviewroutes=require('./routes/reviewroutes')
const { Cookie } = require('express-session')


app.use(methodoverride('_method'))//becouse of this middleware, we did not imported methodoverride as these middlewares can be used throghout the application.
app.use(express.urlencoded({extended:true}))
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'/views'))
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,'public')))//must declare for serving static files
app.use(flash());

const config={
    secret:'thisisagoddammsecret',
    resave:false,//to make session deprecation warning go away
    saveUninitialized:false,//to make session deprecation warning go away
    Cookie:{
        httpOnly:true,//if this flag is applied cookies cannot be access by client side scripts making it more secure.
        expires:Date.now()+1000*60*60*24*7,
        maxage:1000*60*60*24*7
    }
}
app.use(session(config))

mongoose.connect('mongodb://localhost:27017/yelpCampDb', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
})

app.use((req,res,next)=>{
    res.locals.message=req.flash('success')
    next()
})

app.use('/camps',camproutes)
app.use('/camps/:id/reviews',reviewroutes)




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