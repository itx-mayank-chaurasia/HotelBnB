import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        Default: Date.now()
    },
    auther: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;