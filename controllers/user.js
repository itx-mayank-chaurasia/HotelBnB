import User from '../models/user.js';

// render signup form
export const signupForm = (req, res) => {
    res.render("./users/signup.ejs");
}

// signup user
export const signupUser = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registerdUser = await User.register(newUser, password);
        req.login(registerdUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Wellcome To Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

// render login form
export const loginForm = (req, res) => {
    res.render("./users/login.ejs");
}

// login user
export const loginUser =  (req, res) => {
    req.flash("success", "Wellcome Back To Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout user
export const logoutUser =  (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}