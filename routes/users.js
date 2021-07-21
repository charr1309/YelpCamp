const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/register', (req, res) => {//this route will just render a form/template to create a new user
    res.render('users/register');
})
router.post('/register', async (req, res) => {//this is the route that we submit the new user too and that is a post route to slash register from the form in register.ejs
    res.send(req.body)
})
module.exports = router;