

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){//this method is provided by passport
        req.session.returnTo=req.originalUrl;//will store if unloggedin user try to access secure features.
        req.flash('error','You must signed in!!!')
       return res.redirect('/login')//return is needed other wise we'll get error ( Cannot set headers after they are sent to the client)
    }//if user is not registered next block of code will also get executed.
    next();
}