import Listing from "./models/listing.js";
import Review from "./models/review.js";
import { listingSchema } from "./schema.js";
import ExpressError from "./utils/ExpressError.js";
import { reviewSchema } from './schema.js';

export const isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be loggedin");
        return res.redirect("/login");
    }
    next();
}

export const saveRedirectUrl = (req, res, next) => {
    // console.log(req.session.redirectUrl);
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

export const isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!res.locals.currUser._id.equals(listing.owner._id)) {
        req.flash("error", "you don't have permition!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

// joi schema validate function for listings
export const validateListing = ((req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
});

// joi schema validate function for reviews
export const validateReview = ((req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
});

export const isReviewAuther = async(req, res, next) => {
    let {id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
    if (!res.locals.currUser._id.equals(review.auther._id)) {
        req.flash("error", "you are not the auther of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}