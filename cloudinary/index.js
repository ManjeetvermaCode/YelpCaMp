const cloudinary=require('cloudinary')
const {CloudinaryStorage}=require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    cloud_key:process.env.CLOUDINARY_APIKEY,
    cloud_secret:process.env.CLOUDINARY_SECRET
})

const storage=new CloudinaryStorage({
    cloudinary,
    folder:'YelpCamp',
    allowedFormats:['jpg','png','jpg']
})


module.exports={
    cloudinary,
    storage
}