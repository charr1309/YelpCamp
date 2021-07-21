const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');//need 2 dots since this file is nested in the routes folder
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

const validateCampground = (req,res,next) => {    
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    
}

//moved campground routes to this campgrounds.js file in the routes folder so /campgrounds is removed now that they are connected in the index.js file via app.use('campgrounds', campgrounds)
router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({});//finds all campgrounds
    res.render('campgrounds/index.ejs', { campgrounds })//pass campgrounds to template
})

//this route below has to come before the :id route. If it doesnt the brower will match the :id route and since there is no new, id, you will get a time out error, so order does matter

router.get('/new', isLoggedIn, (req,res) =>{//dont need async function here since its a form and wont be getting or posting until form is submitted    
    res.render('campgrounds/new');
})

//req.body had to be parsed above. We add router.use(express.urlencode)...
//code below sets up the endpoint from the form in campgrounds/new as a post request

//adding isLoggedIn to this post route protects the route from a user using something like postman to access the route--the user would not see this route if they are not logged in to the site itself but the route is not protected from outside requests by other programs unless isLoggedIn is included on the route

router.post('/', isLoggedIn, validateCampground, catchAsync(async(req,res,next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);-- this line just checks to see if the req.body has campground--adding Joi for validation will allow much more detail validation for all values--campground is the key and all the values are under campground (ex. campground[price] or campground[description] etc.)--moved the joi schema from below to a function about so it can just be called on the other routes
        
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');//installing connect-flash allows flash messages to be displayed to the user--want to use after the save in case there are any errors thrown--after the message you want to redirect--after the redirect you want to display that message in the template you redirect to--it could be added to the show routes individually but instead its added to the middleware that will take everything on every request and show the message--middleware will be defined in index.js to make this possible
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    console.log(campground);
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    //using the spread operator ...req.body.campground spreads that object into the object found from the id searched for in Campground.findByIdAndUpdate 

    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req ,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);//findByIdAndDelete() triggers only the delete middleware, findOneAndDelete added to in campgrounds.js--if another delete or remove method is used, it will not trigger
    req.flash('success', 'Successfully deleted campground!')
    res.redirect('/campgrounds');
}))

module.exports = router;
