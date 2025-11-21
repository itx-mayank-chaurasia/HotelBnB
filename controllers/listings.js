import Listing from '../models/listing.js';
import { geocodeLocation } from '../utils/forwordGeocode.js';
import { cloudinary } from '../cloudConfig.js';

// index rout
export const index = async (req, res) => {
    const { category } = req.query;
    let listings;
    if (category) {
        listings = await Listing.find({ category: category.toLowerCase() });
        res.render("listings/index.ejs", { listings });
    } else {
        listings = await Listing.find({});
        res.render("listings/index.ejs", { listings });
    }
}
// new rout
export const newRout = async (req, res) => {
    res.render("listings/new.ejs");

}

// new listing create rout
export const createRout = async (req, res) => {
    // cloudinary image info
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    let data = await geocodeLocation(newlisting.location);

    // listing info for mongoDB
    if (data) {
        newlisting.owner = req.user._id;
        newlisting.geometry = {
            type: "Point",
            coordinates: [data.lon, data.lat] // longitude first!
        }
        newlisting.image = { url, filename };
        await newlisting.save();
        req.flash("success", "new listing created successfully");
        res.redirect("/listings");
    } else {
        req.flash("error", "⚠️ No result found for:", newlisting.location);
        res.redirect("/listings/new");
    }

}

// search rout 
export const searchRout = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        req.flash("error", "Please enter something to search");
        return res.redirect("/listings");
    }

    const listings = await Listing.find({
        $or: [
            { location: { $regex: query, $options: "i" } },
            { country: { $regex: query, $options: "i" } },
            { title: { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } }
        ]
    });
    if (listings.length === 0) {
        req.flash("error", `No results found for "${query}"`);
        return res.redirect("/listings");
    }
        res.render("listings/index.ejs", { listings });
    
}

// edit rout
export const editRout = async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    let orignalImageUrl = listings.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
    await Listing.findById(id);
    if (!listings) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/edit.ejs", { listings, orignalImageUrl });
    }

}

// update rout
export const updateRout = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let data = await geocodeLocation(req.body.listing.location);

    if (data) {
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if (typeof req.file !== "undefined") {
            // delete old image from cloudinary
            if (listing.image && listing.image.filename) {
                await cloudinary.uploader.destroy(listing.image.filename);
            }
            // add new image
            listing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
            listing.geometry = {
                type: "Point",
                coordinates: [data.lon, data.lat] // longitude first!
            }
            await listing.save();
        }
        req.flash("success", "Listing updated successfully");
        res.redirect(`/listings/${id}`);
    } else {
        req.flash("error", "⚠️ No result found for:");
        res.redirect("/listings/new");
    }



}

// delete rout
export const deleteRout = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    await cloudinary.uploader.destroy(listing.image.filename);
    console.log("Deleted from Cloudinary:", listing.image.filename);
    req.flash("success", "Listing deleted successfully");
    return res.redirect("/listings");
}

//show rout
export const showRout = async (req, res) => {

    // show listing details
    let { id } = req.params;
    let listings = await Listing.findById(id).populate({ path: "reviews", populate: { path: "auther" } }).populate("owner");
    if (!listings) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    } else {

        let data = await geocodeLocation(listings.location);
        if (!data) {
            req.flash("error", "location not found");
            return res.redirect("/listings/show.ejs");
        } else {
            res.locals.data = data;
            // console.log(data); 
            return res.render("listings/show.ejs", { listings });
        }
    }
}
