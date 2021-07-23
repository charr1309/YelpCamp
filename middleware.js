
const { campgroundSchema, reviewSchema} = require('./schemas.js');//middleware to authenticate routes--in a seperate file so all this text doesnt have to be added to each route
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {//isAuthenticated() function comes with passport
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');//have to return or you will get Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client message--without return the res.render below still runs
    }
next();
}
module.exports.validateCampground = (req,res,next) => {    
    const {error} = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}   


module.exports.isAuthor = async(req, res, next) => {//middleware to check if user is the author and now can just add the isAuthor to the routes instead of having to paste this code on each route that needs to be protected
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {//if the campground author id on the campground is not equal to the currentUser id flass error message and redirect to campground
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {//middleware to check if user is the author and now can just add the isAuthor to the routes instead of having to paste this code on each route that needs to be protected
    const { id, reviewId } = req.params;//redirect using the id and use the reviewId to check the review to see if the user owns it so need to destructure both id's from req.params
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {//if the campground author id on the campground is not equal to the currentUser id flass error message and redirect to campground
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}