const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');//need 2 dots since this file is nested in the routes folder
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');

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

router.get('/new', (req,res) =>{//dont need async function here since its a form and wont be getting or posting until form is submitted
    res.render('campgrounds/new');
})

//req.body had to be parsed above. We add router.use(express.urlencode)...
//code below sets up the endpoint from the form in campgrounds/new as a post request

router.post('/', validateCampground, catchAsync(async(req,res,next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);-- this line just checks to see if the req.body has campground--adding Joi for validation will allow much more detail validation for all values--campground is the key and all the values are under campground (ex. campground[price] or campground[description] etc.)--moved the joi schema from below to a function about so it can just be called on the other routes

    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    //using the spread operator ...req.body.campground spreads that object into the object found from the id searched for in Campground.findByIdAndUpdate 

    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsync(async (req ,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);//findByIdAndDelete() triggers only the delete middleware, findOneAndDelete added to in campgrounds.js--if another delete or remove method is used, it will not trigger
    res.redirect('/campgrounds');
}))

module.exports = router;
