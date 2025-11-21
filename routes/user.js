import express from 'express';
const router = express.Router({ mergeParams: true });
import wrapAsync from '../utils/wrapAsync.js';
import passport from 'passport';
import { saveRedirectUrl } from "../middleware.js";
import { signupForm, signupUser, loginForm, loginUser, logoutUser } from '../controllers/user.js';


// signup form and signup user
router.route("/signup")
.get( signupForm)
.post( wrapAsync(signupUser));

// login form and login user
router.route("/login")
.get(loginForm )
.post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),  loginUser);

// logout user
router.get("/logout", logoutUser);


export default router;
