import express from 'express';
const router = express.Router({mergeParams: true});
import wrapAsync from '../utils/wrapAsync.js';
import { isLoggedin, isOwner, validateListing } from "../middleware.js";
import { index, newRout, createRout, editRout, updateRout, deleteRout, showRout, searchRout}from '../controllers/listings.js';
import multer from 'multer';
import {storage} from "../cloudConfig.js";
const upload = multer({storage});

router.route("/")
// index and create rout
.get( wrapAsync(index))
.post( isLoggedin,upload.single("listing[image]"), validateListing, wrapAsync(createRout));


// new rout
router.get("/new",isLoggedin, wrapAsync(newRout));

// search rout
router.route("/search").get(searchRout);

router.route("/:id")
// update, show and delete rout
.put( isLoggedin,isOwner,upload.single("listing[image]"), validateListing, wrapAsync(updateRout))
.get( wrapAsync(showRout))
.delete( isLoggedin,isOwner, wrapAsync(deleteRout));



// edit rout
router.get("/:id/edit", isLoggedin,isOwner, wrapAsync(editRout));

// export listings rout
export default router;