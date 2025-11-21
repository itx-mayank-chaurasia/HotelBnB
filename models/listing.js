import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Review from './review.js';


// creating schema
let listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    discription: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ["Point"], // GeoJSON only allows 'Point' here
            required: true
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    category: {
        type: String,
        enum: ["trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping", "domes", "arctic", "boats"]
    }
});
// Optional: for faster geospatial queries
listingSchema.index({ geometry: "2dsphere" });

// deletion handling middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } })
    }
})
// creating model
const listing = new mongoose.model("listing", listingSchema);
export default listing;