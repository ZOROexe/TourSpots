const joi = require('joi');

module.exports.destinationSchema = joi.object({
    destination: joi.object({
        title: joi.string().required(),
        price: joi.number().min(0),
        /* image: joi.string().required(), */
        description: joi.string().required(),
        location: joi.string().required()
    }).required(),
    deleteImages: joi.array()
})

module.exports.reviewSchema = joi.object({
    review: joi.object({
        body: joi.string().required(),
        rating: joi.number().required().min(1).max(5)
    })
})