const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');//need 2 dots since this file is nested in the routes folder
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');

const { isLoggedIn, isAuthor, validateCampground, validateReview } = require('../middleware');

//moved campground routes to this campgrounds.js file in the routes folder so /campgrounds is removed now that they are connected in the index.js file via app.use('campgrounds', campgrounds)

router.get('/', isLoggedIn, catchAsync(campgrounds.index));

//this route below has to come before the :id route. If it doesnt the brower will match the :id route and since there is no new, id, you will get a time out error, so order does matter

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//req.body had to be parsed above. We add router.use(express.urlencode)...
//code below sets up the endpoint from the form in campgrounds/new as a post request

//adding isLoggedIn to this post route protects the route from a user using something like postman to access the route--the user would not see this route if they are not logged in to the site itself but the route is not protected from outside requests by other programs unless isLoggedIn is included on the route

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))

router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router;
