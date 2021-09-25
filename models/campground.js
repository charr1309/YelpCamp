const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

//you can only add a virtual property to a schema--lecture 539

const ImageSchema = new Schema({//moved properties of images in the CampgroundSchema to new ImageSchema to add virtual property to images only
    
    url: String,
    filename: String
    
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200')//replace part of url that has /upload to /upload/w_200 so all images will have that width
})

//Lecture 542
//geo JSON has a particular format where there is always a type field--in this case it will always be point and that is coming from mapbox--geo JSON is bigger than just mapbox like JSON is bigger than just one API, its a standard which is quite common--Mongo accepts alot of geoJSON functionalites see: docs.mongodb.com/manual/crud/--the geoJSON pattern must be followed to allow other functionalites to be added later  ie. location: {type: 'Point', coordinates: [-73.9375, 40.8303] }--the coordinates are presented as longitude then latitude so the numbers may need to be reversed depending on the map service specs on order

//By default, Mongoose does not include virtuals when you convert a document to JSON. To include virtuals you need to set the toJSON schema option to {virtuals: true}--lecture 553--then include opts in the schema object after initializing the schema pattern

const opts = { toJSON: {virtuals: true} };

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    //image: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],//enum is where you provide specific options--in this case enum has to be the string point--is the only option
            required: true 
        },
        coordinates: {//is an array of 2 numbers and it has to be required
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {//add Id to the schema so that the author of a post can be used for authentication--will be a reference to the user
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},  opts);//include opts in the schema





CampgroundSchema.virtual('properties.popUpMarkup').get(function() {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

//test code below to see if DELETED is printed out when a campground is deleted--first step to delete reviews when a campground is deleted

// CampgroundSchema.post('findOneAndDelete', async function () {
//     console.log("DELETED!!!!")
//  })

//since this is working, pass the doc to the function and check if there is a review on the campground and if so delete the reviews

CampgroundSchema.post('findOneAndDelete', async function (doc) {//this is query middleware--it behaves differently than document middleware
    await review.deleteMany({
        _id: {
            $in: doc.reviews//the $in operator selects the documents where the value of a field equals any value in the specified array
        }
    })
})

module.exports = mongoose.model('Campground', CampgroundSchema);