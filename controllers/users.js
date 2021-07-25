const User = require('../models/user');

module.exports.renderRegister = (req, res) => {//this route will just render a form/template to create a new user
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {//wrap function in catchAsync to catch any errors from mongoose--add next to account for the required callback function in the req.login below
    try {//added try catch to handle error on the same page as the form so you dont go to an error page when the catchAsync finds the error
    const { email, username, password } = req.body;//destructure what is needed from req.body
    const user = new User({email, username});//make a user model instance(models/user.js) where the username and email is passed in an object but not the password then call user.register
    const registeredUser = await User.register(user, password);//User.register takes in the new user just created above and takes the password and hash it and add salt and adds it to the new user--saves that in registerdUser
    // console.log(registeredUser);

    //req.login comes automatically with passport like req.logout and allows the new user to be automatically logged in when they register and not have to go to the login page--the req.login function requires a callback so you cannot await it and the callback is an error callback
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success','Welcome to Yelp Camp');
        res.redirect('/campgrounds');
    })
    
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
    
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {//passport.authenticate, using the local strategy, with failureFlash a message if there is an error and failureRedirect back to the login page if there are any errors, options

    //next if the user makes it into the area below that means the user has been authenticated and is entering correctly
    
        req.flash('success', 'Welcome Back');
        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo
        res.redirect(redirectUrl);
    }

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}