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

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
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