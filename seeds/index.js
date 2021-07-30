const mongoose = require('mongoose');
const { cloudinary } = require('../cloudinary');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];//get random index of array

const seedDB = async () => {
    await Campground.deleteMany({});    
    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60f8058dc1dd64658e90ebae',//--lecture 515--pulled an id from the database and set all campgrounds to have an author with that id--step 2 after adding an author property to the campground schema in models/campground.js--now run node seeds/index.js to re-seed the database and all the campgrounds will have an author with the ID of the ID pulled from the database--right now all campgrounds belong to the same author
           location: `${cities[random1000].city}, ${cities[random1000].state}`,
           title: `${sample(descriptors)} ${sample(places)}`, 
           //image: 'https://source.unsplash.com/collection/483251',--used this line to seed the database--changed to images object below after adding cloudinary
           description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere inventore est dolore corrupti accusantium odio voluptates excepturi enim perferendis! Aliquid magni magnam fuga, asperiores quasi voluptatibus sequi optio ea maxime?',
           price,
           images: [
            
                {
                  url: 'https://res.cloudinary.com/dnqgv4qi0/image/upload/v1627514974/YelpCamp/rfpxerh4z4nlx1dszxf1.jpg',
                  filename: 'YelpCamp/rfpxerh4z4nlx1dszxf1'
                },
                {
                  url: 'https://res.cloudinary.com/dnqgv4qi0/image/upload/v1627514974/YelpCamp/hoir6icsnwvx6rj1vxsv.jpg',
                  filename: 'YelpCamp/hoir6icsnwvx6rj1vxsv'
                }
              
           ] 
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});