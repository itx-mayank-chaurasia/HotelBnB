import Joi from "joi";

export const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        discription: Joi.string().required(),
        location: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
        country: Joi.string().required(),
        category: Joi.string().required()
    }).required()
});

// export listingSchema;

export const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
})
// export default {
//     listingSchema, reviewSchema
// }