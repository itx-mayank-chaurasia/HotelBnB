import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from '../utils/wrapAsync.js';
import { isLoggedin, validateReview, isReviewAuther } from '../middleware.js';
import { createReview, deleteReview } from '../controllers/reviews.js';

// reviews
// creating new reviews
router.post("/",isLoggedin, validateReview, wrapAsync(createReview));
// delete review 
router.delete("/:reviewId",isLoggedin,isReviewAuther, wrapAsync(deleteReview));

// export router
export default router;