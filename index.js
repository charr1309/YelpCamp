const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
<<<<<<< HEAD
const session = require('express-session');
=======
>>>>>>> e55ecbf84eca4c12ed3c4890bd2fc6a6a07034d7
// const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');//allows us to alter the method for our form--still need method="POST" after _method
// const catchAsync = require('./utils/catchAsync');
// const { campgroundSchema, reviewSchema } = require('./schemas.js');
// const Review = require ('./models/review');


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');//require contents of the reviews file in the folder routes which is the route


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

const app = express();

app.engine('ejs', ejsMate);//template engine to use static template files to design HTML easier
app.set('view engine', 'ejs');//--ejs(embedded Javascript) is a templating language/engine that lets its user generate HTML with plain javascript
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))//must tell express to parse the body so use this or nothing will come back when you use req.body for anything
app.use(methodOverride('_method'));//tell express to use methodOverride
app.use(express.static(path.join(__dirname, 'public')))//added to tell express, with static assests to use the path to the public directory

const validateCampground = (req,res,next) => {    
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    
}

// const validateReview = (req,res,next) => {
//     const {error} = reviewSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',')
//         throw new ExpressError(msg, 400)
//     } else {
//         next();
//     }
// }

app.use('/campgrounds', campgrounds);//tells express that any route that starts with /campgrounds, to use the campgrounds routes in campgrounds.js--since this will start all of the routes with /campgrounds here, the /campgrounds will be removed from the routes in campgrounds.js file
app.use('/campgrounds/:id/reviews', reviews);//to have access to the :id part of this route, merge params must be in the parenthesis of the router statement at the top of the reviews.js file like so:   const router = express.Router({mergeParams: true});


app.get('/', (req, res) => {
    res.render('home')
})








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

