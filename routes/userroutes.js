const express=require('express')
const passport = require('passport')
const router=express.Router()
const wrapAsync = require('../utiliti/wrapAsync')
const user=require('../controller/user')

router.get('/register',user.renderRegisterForm)

router.post('/register',wrapAsync(user.CreateNewUser))

router.get('/login',user.renderLoginForm)

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),user.login)//passport.authenticate is an middleware, it will authenticate automatically and will handler if error occur else it will move 'next';

router.get("/logout", user.logout);
  

module.exports=router