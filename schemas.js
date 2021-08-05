const BaseJoi = require('joi');//changed from Joi to BaseJoi in lecture 563
const sanitizeHtml = require('sanitize-html');

//code below uses sanitizeHtml to prohibit any html being entered say on the new campground page--hacker could use it to put in a script to steal cookie information for example--lecture 563

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value,helpers) {
                const clean = sanitizeHtml(value, {
                    //specify no tags or attributes are allowed
                    allowedTags:[],
                    allowedAttributes: {}
                });
                //compare clean(sanitized input) to see if it is different or something removed from value(initial input in validate(value,helpers) {}) and if so print error message in messages above under extension
                if (clean !== value) return helpers.error('string.escapeHTML', { value})
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)//set Joi to BaseJoi from the change at the top of the page so module.exports below dont have to be changed--pass in the extension above and add it to Joi which allows the use of escape.HTML on anything that has text

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        //image: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required().escapeHTML()
    }).required()
});
