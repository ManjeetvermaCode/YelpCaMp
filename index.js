if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express=require('express')
const mongoose = require('mongoose')
const app=express()
const path=require('path')
const methodoverride=require('method-override')
const ejsMate=require('ejs-mate')
const expressError = require('./utiliti/expressError')
const session=require('express-session')
const flash=require('connect-flash')
const passport=require('passport')//allow us to implement multiple stratergy for authenticaiton
const localstratergy=require('passport-local')
const user=require('./models/user')

const camproutes=require('./routes/campgroundroutes')
const reviewroutes=require('./routes/reviewroutes')
const userroutes=require('./routes/userroutes')


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
app.use(passport.initialize())
app.use(passport.session())//using for persistent user login, other wise a user will have to login on every request
passport.use(new localstratergy(user.authenticate()))//authenticate function is provided by passwordlocalmongoose from userSchema. We are using local stratergy

passport.serializeUser(user.serializeUser())//serialization is basically means how do we store a user in the session
passport.deserializeUser(user.deserializeUser())//and vice versa. Both functions are provided by passportlocalmongoose

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

app.use((req,res,next)=>{//declaring global variables, in a middleware remember it will run for all requests.
    res.locals.loggeduser=req.user//(req.user)This object contains information about the authenticated user, such as their username, email, or any other relevant data
   // req.session.returnTo;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    next()
})//this block of code allow us to use the defined properties in any of the ejs files like req.user property which we cannot use in ejs

app.use('/',userroutes)
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