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
            const price=Math.floor(Math.random()*20+10)
        let a=new campground({
            location:`${cities[randnum1000].city}, ${cities[randnum1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:'https://picsum.photos/200',
            author:'640de313403114a636f14ee9',
            description:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum aliquam ratione maiores fuga architecto facere ducimus corrupti odit accusamus mollitia labore veritatis necessitatibus deserunt quidem modi, enim facilis molestiae vel.Exercitationem eligendi nesciunt eveniet porro voluptatum recusandae deleniti doloribus nulla possimus, perspiciatis saepe illum delectus quibusdam animi atque? Necessitatibus accusamus vero cupiditate praesentium ipsam veritatis magnam cum natus illum. Amet?',
            price:price


        })
        await a.save();

        }
      
    }
    seed();