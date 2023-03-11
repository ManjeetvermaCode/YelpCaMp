const mongoose=require('mongoose')
const Schema=mongoose.Schema
const passportlocalmongoose=require('passportlocalmongoose')


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})

userSchema.plugin('passportlocalmongoose')//passportlocalmongoose will add a username,hash and salt field to the username, the hash password and the salt value. It also provides other methods.

module.exports=mongoose.model('User',userSchema)