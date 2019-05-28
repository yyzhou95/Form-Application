/* requirement */
let express = require("express"),
    passport = require("passport"),
    Middleware = require("../middleware/index"),
    User = require('../models/user');

let router = express.Router({mergeParams: true});

// path: "/"

/* Root */
router.get('/', function (req, res) {
    res.render('index')
});

/* register */
router.get('/register', function (req, res) {
    res.render('auth/register');
});
router.post('/register', function (req, res) {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, newCreatedUser) {
        if (err) {
            req.flash("error", "User name is invalid");
            res.redirect("back");
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                req.flash("success", "Successfully log in, welcome :)");
                res.redirect("/list")
            })
        }
    })
});

/* login */
router.get('/login', function (req, res) {
    res.render('auth/login');
});
router.post('/login', passport.authenticate("local", {
    successRedirect: '/list',     // middleware
    failureRedirect: '/login',
    failureFlash: 'Invalid username or password.',
    successFlash: 'Welcome!'
}), function (req, res) {
    // empty callback
});

/* logout */
router.get('/logout', function (req, res) {
    req.logout();
    req.flash("success", "Logged out succeed!");
    res.redirect('/');
});

/* User Page */
router.get('/user/:id', Middleware.isLoggedIn, function (req, res) {
    res.render('user/profile', {user: req.user})
});

module.exports = router;