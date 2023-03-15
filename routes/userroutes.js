const express=require('express')
const passport = require('passport')
const router=express.Router()
const user=require('../models//user')
const Wrapasync=require('../utiliti/wrapAsync')

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',Wrapasync(async(req,res,next)=>{
    try{
        const {username,email,password}=req.body
        const registeruser=new user({username,email})//creating new user model
       const result= await user.register(registeruser,password)//register method will create salt and hash the password for us
       req.login(result,(err)=>{//up untill now if a new user registered he'll have to login again to access full features, which is annoying so, we'll use 'req.login' which will log a user in after he registered.
        if(err) return next()
        req.flash('success','Welcome to YelpCamp!')
        res.redirect('/camps')
       })
        
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
    const url=req.session.returnTo || '/camps'
    res.redirect(url)
})

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      req.flash('success', "Goodbye!");
      res.redirect('/camps');
    });
  });

module.exports=router