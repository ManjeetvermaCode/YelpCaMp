const express=require('express')
const passport = require('passport')
const router=express.Router()
const user=require('../models//user')
const Wrapasync=require('../utiliti/wrapAsync')

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',Wrapasync(async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const registeruser=new user({username,email})//creating new user model
       const result= await user.register(registeruser,password)//register method will create salt and hash the password for us.`
        console.log(result)
        req.flash('success','Welcome to YelpCamp!')
        res.redirect('/camps')
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{//passport.authenticate is an middleware, it will authenticate automatically and will handler if error occur else it will move 'next';
    req.flash('success',"You are Welcome")
    res.redirect('/camps')
})

module.exports=router