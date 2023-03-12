const express=require('express')
const router=express.Router()
const user=require('../models//user')
const Wrapasync=require('../utiliti/wrapAsync')

router.get('/register',(req,res)=>{
    res.render('users/register')
})

router.post('/register',Wrapasync(async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const registeruser=new user({username,email})
       const result= await user.register(registeruser,password)
        console.log(result)
        req.flash('success','Welcome to YelpCamp!')
        res.redirect('/camps')
    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    
    
}))

module.exports=router