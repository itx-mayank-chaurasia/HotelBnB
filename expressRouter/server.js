// import packages
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';
import { fileURLToPath } from "url";
import path from 'path';
import users from './routes/user.js';
import posts from './routes/post.js';

// use packages
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// all middlewares
app.use(cookieParser("secretecode"));
let sessionOptions = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errMsg = req.flash("error");
    next();
})


// all routes
app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    if (name !== "anonymous") {
        req.flash("success", "user registerd successfully");
    } else {
        req.flash("error", "user not registerd");
    }
    res.redirect("/greet");
});
app.get("/greet", (req, res) => {

    res.render("page.ejs", { name: req.session.name, msg: req.flash("success") });
})












// app.get("/", (req, res) => {
//     res.send("this is rout!...");
// });
// users and posts routes
// app.use("/users", users);
// app.use("/posts", posts);


// unsigned cockies routes
// app.get("/getcockies", (req, res) => {
//     res.cookie("madeIn", "India");
//     res.cookie("hii", "sir/medam!...");
//     res.send("sent some cockies to you");
//     console.log(req.cookies);   
// });

// app.get("/greet", (req, res) => {
//     let {name = "anonymous"} = req.cookies;
//     res.send(`hii... ${name}`)
// });
// // signed cookies
// app.get("/getSignedCookies", (req, res) => {
//     res.cookie("madeIn", "India", {signed: true});
//     res.send("signed cookies sent");
// });
// app.get("/verify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("verified");
// })

app.listen(8000, () => {
    console.log("server listen on 8000");
})