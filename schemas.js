const Joi = require('joi');

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
<<<<<<< HEAD
    deleteImages: Joi.array()//lecture537--added to allow deletion of images from campgrounds
=======
    deleteImages: Joi.array()
>>>>>>> revert
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
});
