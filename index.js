const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');//allows us to alter the method for our form
const catchAsync = require('./utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Review = require ('./models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);//template engine to use static template files to design HTML easier
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))//must tell express to parse the body so use this or nothing will come back when you use req.body for anything
app.use(methodOverride('_method'));//tell express to use methodOverride

const validateCampground = (req,res,next) => {    
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    
}

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});//finds all campgrounds
    res.render('campgrounds/index.ejs', { campgrounds })//pass campgrounds to template
})

//this route below has to come before the :id route. If it doesnt the brower will match the :id route and since there is no new, id, you will get a time out error, so order does matter

app.get('/campgrounds/new', (req,res) =>{//dont need async function here since its a form and wont be getting or posting until form is submitted
    res.render('campgrounds/new');
})

//req.body had to be parsed above. We add app.use(express.urlencode)...
//code below sets up the endpoint from the form in campgrounds/new as a post request

app.post('/campgrounds', validateCampground, catchAsync(async(req,res,next) => {
    //if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);-- this line just checks to see if the req.body has campground--adding Joi for validation will allow much more detail validation for all values--campground is the key and all the values are under campground (ex. campground[price] or campground[description] etc.)--moved the joi schema from below to a function about so it can just be called on the other routes

    
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async (req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    console.log(campground);
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;

    //using the spread operator ...req.body.campground spreads that object into the object found from the id searched for in Campground.findByIdAndUpdate 

    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', catchAsync(async (req ,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);//in the form show page each input was givin a name where data was stored under review ie. name="review[rating]" so its all under the key of review once its been parsed
    campground.reviews.push(review);//in campground model the property on the CampgroundSchema was set to reviews plural which is an array of id's that correspond to a review and the review id is pushed there
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);//redirect to the show page
}))

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    //--the $pull operator removes from an existing array all instances of a value or values that match a specified condition--reviews is just an array of id's
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})//removes reference from the array
    await Review.findByIdAndDelete(req.params.reviewId);//delete entire review
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*', (req,res,next) => {//order is important..this will only run if nothing is matched first and there was no response from any of them
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500 } = err; 
        // message = 'Something went wrong'} = err;--this will no longer work to update the error object in the curly braces in the res.status line with the new res statement--we need to  extract a variable from error and give that variable a default --so we will change this in the line below this comment--
        if (!err.message) err.message = 'On No, Something Went Wrong!'
        res.status(statusCode).render('error', { err });//{err} passes the actual error to the template
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000')
})

