const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');//need 2 dots since this file is nested in the routes folder
const campgrounds = require('../controllers/campgrounds');
const Campground = require('../models/campground');

const { isLoggedIn, isAuthor, validateCampground, validateReview } = require('../middleware');
const multer = require ('multer');
const { storage } = require('../cloudinary');//changes the upload storage location to cloudinary that was just set up in the cloudinary folder--lecture 530, instead--node automatically looks for an index file in a folder so '../cloudinary/index is not needed in the require

//const upload = multer({ dest: 'uploads/' });--was the set up code when multer was installed to initialize or execute multer by passing in a configuration object {dest: 'uploads/} which is telling to store uploads locally in the uploads folder

const upload = multer({ storage });//refactor multer to use storage instead of dest: 'uploads/'

//moved campground routes to this campgrounds.js file in the routes folder so /campgrounds is removed now that they are connected in the index.js file via app.use('campgrounds', campgrounds)

router.route('/')
    .get(catchAsync(campgrounds.index))
    //.post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground))
    .post(upload.array('image'), (req, res) =>{//this is uploading from multer with upload.single or upload.array for example, and told multer to store things in a different destination above,--lecture 527  
        console.log(req.body, req.files);//use req.file for single upload and upload.array uses req.files
        res.send('IT WORKED?!')
    })

    //this route below has to come before the :id route. If it doesnt the brower will match the :id route and since there is no new, id, you will get a time out error, so order does matter

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))




//req.body had to be parsed above. We add router.use(express.urlencode)...
//code below sets up the endpoint from the form in campgrounds/new as a post request

//adding isLoggedIn to this post route protects the route from a user using something like postman to access the route--the user would not see this route if they are not logged in to the site itself but the route is not protected from outside requests by other programs unless isLoggedIn is included on the route

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;
