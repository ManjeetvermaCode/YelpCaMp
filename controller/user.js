const user=require('../models//user')
const wrapAsync = require('../utiliti/wrapAsync')


module.exports.renderRegisterForm=(req,res)=>{
    res.render('users/register')
}

module.exports.CreateNewUser=async(req,res,next)=>{
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
}

module.exports.renderLoginForm=(req,res)=>{
    res.render('users/login')
}

module.exports.login=(req,res)=>{
    req.flash('success',"You are Welcome")
    const url=req.session.returnTo || '/camps'
    res.redirect(url)
}

module.exports.logout=(req, res) => {
    req.logout(wrapAsync);
    req.flash("success", "Goodbye!");
    res.redirect("/camps");
}