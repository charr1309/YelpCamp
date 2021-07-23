const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {//reference called author that associates author to the review
        type: Schema.Types.ObjectId,
        ref: 'User'//refers to the user model
    }
});

module.exports = mongoose.model("Review", reviewSchema);