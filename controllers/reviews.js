import Review from '../models/review.js';
import Listing from '../models/listing.js';

// create review 
export const createReview = async (req, res) => {
    let listings = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.auther = req.user._id;
    listings.reviews.push(newReview);

    await newReview.save();
    await listings.save();
    req.flash("success", "Review added successfully");
    res.redirect(`/listings/${listings.id}`,);
}

// delete review
export const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: {reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted successfully");
    res.redirect(`/listings/${id}`);
}