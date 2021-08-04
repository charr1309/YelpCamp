const mongoose = require('mongoose');
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
        //    image: 'https://source.unsplash.com/collection/483251',
           description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere inventore est dolore corrupti accusantium odio voluptates excepturi enim perferendis! Aliquid magni magnam fuga, asperiores quasi voluptatibus sequi optio ea maxime?',
           price,
           geometry: { //set geometry to always be these coordinates so that if none are entered it will not break the code
             type: 'Point', 
             coordinates: [//change hard coded coordinates to the random values for cities from above--lecture 549--reseed database to include coordinate data 
              cities[random1000].longitude,
              cities[random1000].latitude,
            ]
           },
           images: [
            {              
              url: 'https://res.cloudinary.com/dnqgv4qi0/image/upload/v1627870079/YelpCamp/fvcrqxmlw7ulfghyarzh.jpg',
              filename: 'YelpCamp/fvcrqxmlw7ulfghyarzh'
            },
            {              
              url: 'https://res.cloudinary.com/dnqgv4qi0/image/upload/v1627870080/YelpCamp/cojgmxzx1mhbtplxoell.jpg',
              filename: 'YelpCamp/cojgmxzx1mhbtplxoell'
            }
          ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});