const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');//require to catch any mongoose errors
const User = require('../models/user');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', users.logout)

// router.post('/register', async (req, res) => {//this is the route that we submit the new user too and that is a post route to slash register from the form in register.ejs
//     res.send(req.body)
// });

//now that the form is created, use the form data to create a new user

//2 login routes, one will serve a form and the other will be a post for /login as well which will do the actual logging in when it makes sure your credentials are valid
module.exports = router;