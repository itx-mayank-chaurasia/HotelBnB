import dotenv from 'dotenv';
if (process.env.NODE_ENV != "production") {
    dotenv.config();
}

// importing all packages
import mongoose from 'mongoose';
import express from 'express';
import { fileURLToPath } from "url";
import path from 'path';
import methodOverride from 'method-override';
import ejsMate from 'ejs-mate';
import ExpressError from './utils/ExpressError.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from './models/user.js';


// import routes files
import listingRouter from './routes/listings.js';
import reviewRouter from './routes/reviews.js';
import userRouter from './routes/user.js';

// use packages
const app = express();
// app.set("trust proxy", 1);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretecode"));


// databse connection with mongoDB
// const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
main().then((res) => {
    console.log("connection successfull to DB");
}).catch((err) => {
    console.log("ERROR: ", err);

});
async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    ttl: 14 * 24 * 60 * 60, // 14 days
    autoRemove: 'native',
    secret: process.env.SECRET,
    touchAfter: 24 * 3600
});
// featching err if any
store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
});
// session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

// session and flash middlewares
app.use(session(sessionOptions));
app.use(flash());

// passport middleware for authentication and authorizarion 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// declare locals vaariables
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// test flash
// app.get("/test-flash", (req, res) => {
//   req.flash("success", "Flash working now");
//   res.send("Flash set");
// });

// app.get("/see-flash", (req, res) => {
//   res.send(req.flash("success"));
// });


// creating home rout
app.get("/", (req, res) => {
    res.redirect("/listings");
})

// all listings, review, user, search rout routes 
app.use("/listings", listingRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/", userRouter);

// if path is not exist
app.use((req, res, next) => {
    next(new ExpressError(404, "page not found!"));
});


// session check property null
// app.use((req, res, next) => {
//     console.log("SESSION CHECK:", req.session);
//     next();
// });


// err handling middlewares
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    if (res.headersSent) {
        console.log("SESSION CHECK:", req.session, req.sessionID);
        // response already sent → just delegate default express handler
        return next(err);
    }
    // console.log("SESSION CHECK:", req.session);
    return res.status(statusCode).render("listings/error.ejs", { message: String(message) });
});


// listning port
let port = 3000;
app.listen(port, () => {
    console.log("server listning on port", port);
});