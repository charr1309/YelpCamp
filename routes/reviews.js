const express = require('express');
const router = express.Router({mergeParams: true});//express router likes to keep params seperate so mergeParams: true is required to access reviews for each campground since the reviews routes are in a different file in the routes folder
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');
const Campground = require('../models/campground');
const Review = require ('../models/review');
const reviews = require ('../controllers/reviews');



const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');//need 2 dots since this file is nested in the routes folder
const { createReview } = require('../controllers/reviews');




router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;