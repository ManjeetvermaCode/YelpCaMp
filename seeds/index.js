const campground=require('../models/campground')
const mongoose = require('mongoose')
const cities=require('./cities')
const {places,descriptors}=require('./seed-helper')

mongoose.connect('mongodb://localhost:27017/yelpCampDb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN ON SEED INDEX.JS!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })

const sample=(array)=>array[Math.floor(Math.random()*array.length)]

    const seed=async()=>{
        await campground.deleteMany({});
        for(let i=0;i<50;i++){
            const randnum1000=Math.floor(Math.random() * 1000 + 1);

        let a=new campground({
            location:`${cities[randnum1000].city}, ${cities[randnum1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        })
        await a.save();

        }
      
    }
    seed();