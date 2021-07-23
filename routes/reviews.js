const express = require('express');
const router = express.Router({mergeParams: true});//express router likes to keep params seperate so mergeParams: true is required to access reviews for each campground since the reviews routes are in a different file in the routes folder
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const Campground = require('../models/campground');
const Review = require ('../models/review');



const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');//need 2 dots since this file is nested in the routes folder




router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);//in the form show page each input was givin a name where data was stored under review ie. name="review[rating]" so its all under the key of review once its been parsed
    review.author = req.user._id;//so after we have checked if the user is logged in(isLoggedIn middleware), we can use that users ID to associate the user with the review
    campground.reviews.push(review);//in campground model the property on the CampgroundSchema was set to reviews plural which is an array of id's that correspond to a review and the review id is pushed there
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground.id}`);//redirect to the show page
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    //--the $pull operator removes from an existing array all instances of a value or values that match a specified condition--reviews is just an array of id's
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})//removes reference from the array
    await Review.findByIdAndDelete(req.params.reviewId);//delete entire review--function triggers the middleware, findOneAndDelete()
    req.flash('success', 'Successfully deleted the review')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;