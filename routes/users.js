const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');//require to catch any mongoose errors
const User = require('../models/user');

router.get('/register', (req, res) => {//this route will just render a form/template to create a new user
    res.render('users/register');
})
// router.post('/register', async (req, res) => {//this is the route that we submit the new user too and that is a post route to slash register from the form in register.ejs
//     res.send(req.body)
// });

//now that the form is created, use the form data to create a new user

router.post('/register', catchAsync(async (req, res) => {//wrap function in catchAsync to catch any errors from mongoose
    try {//added try catch to handle error on the same page as the form so you dont go to an error page when the catchAsync finds the error
    const { email, username, password } = req.body;//destructure what is needed from req.body
    const user = new User({email, username});//make a user model instance(models/user.js) where the username and email is passed in an object but not the password then call user.register
    const registeredUser = await User.register(user, password);//User.register takes in the new user just created above and takes the password and hash it and add salt and adds it to the new user--saves that in registerdUser
    console.log(registeredUser);
    req.flash('success','Welcome to Yelp Camp');
    res.redirect('/campgrounds');
    } catch(e){
        req.flash('error', e.message);
        res.redirect('register');
    }
    
}));

//2 login routes, one will serve a form and the other will be a post for /login as well which will do the actual logging in when it makes sure your credentials are valid

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {//passport.authenticate, using the local strategy, with failureFlash a message if there is an error and failureRedirect back to the login page if there are any errors, options

//next if the user makes it into the area below that means the user has been authenticated and is entering correctly

    req.flash('success', 'Welcome Back');
    res.redirect('/campgrounds');
    

})

module.exports = router;