const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
// const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');//allows us to alter the method for our form--still need method="POST" after _method
// const catchAsync = require('./utils/catchAsync');
// const { campgroundSchema, reviewSchema } = require('./schemas.js');
// const Review = require ('./models/review');

const passport = require('passport');//allows us to plugin multiple strategies for authentication
const LocalStrategy = require('passport-local')//has nothing to do with the passport-local-mongoose which is just in the user model--
const User = require('./models/user');//the user model is passed into the LocalStrategy so it must be required

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');//
const reviewRoutes = require('./routes/reviews');//require contents of the reviews file in the folder routes which is the route


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

const sessionConfig = {//configure session which will be an object
    secret: 'thisshouldbeabettersecret',
    resave: false,//resave and saveUninitialized are required or will produce deprecation warnings in node window
    saveUninitialized: true,
    cookie: {
        httpOnly: true,//enabled by default--when included in the HTTP reaponse header, the cooke cannot be accessed through client side script (if browser supports this flag)--browser will not reveal the cookie to a third party
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//1000ms in second, 60sec in a minute, 60min in an hour, 24hr in a day, 7days in a week--this calculates the number of miliseconds seconds in a week--date.now() is in miliseconds--this cookie expires in a week--if no expiration is supplied, a user could stay logged in forever and usually that is not what is wanted
        maxAge: 1000 * 60 * 60 * 24 * 7//--in this case max age is set to a week also
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());//In a Connect or Express-based application, passport.initialize() middleware is required to initialize Passport. If your application uses persistent login sessions, passport.session() middleware must also be used.--the alternative would be to have to log in on every single request if its not persistent--app.use(session(sessionConfig)) above must be used before app.use(passport.session())
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));//tells passport to use the LocalStrategy required from above and on the User model, there will be an authentication method called authenticate--authenticate() is a static method automatically added to passport--it generates a function that is used in Passports LocalStategy--there is no authenticate property on the user model created by me, it is already there by default--can have more LocalStrategies going a once 

passport.serializeUser(User.serializeUser());//serializeUser() generates a function that is used by Passport to serialize users into the session--also comes with passport by default like authenticate()--tells passport how you get a user into the session or store it

passport.deserializeUser(User.deserializeUser());//conversly, deserializeUser() tells passport how to get a user out of a session or unstore it

//below is the middleware defined before the routes--res.locals.success we will have access to in the template and will be accessible to every route and will be equal to whatever is in req.flash of ('success')--most of the time there will be nothing there(if we just flash something and redirect it there should be a message in there) but if there is, it will have access to it under the key success--they are globals so there is access to them in every template
app.use((req,res,next) => {
    res.locals.currentUser = req.user;//(lecture# 512) this line makes all templates have access to req.user which passport automatically filled in with the deserialized value from the session--the session stores the serialized user and passport deserializes it and fills in req.user with that data which is userId, username and email--it doesnt show the hash, salt password data
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');//another flash message if there is anything the req.flash of (error), when that flash is created in campgrounds.js
    next();
})

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

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);//tells express that any route that starts with /campgrounds, to use the campgrounds routes in campgrounds.js--since this will start all of the routes with /campgrounds here, the /campgrounds will be removed from the routes in campgrounds.js file
app.use('/campgrounds/:id/reviews', reviewRoutes);//to have access to the :id part of this route, merge params must be in the parenthesis of the router statement at the top of the reviews.js file like so:   const router = express.Router({mergeParams: true});


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

