/* requirement */
let express = require("express"),
    passport = require("passport"),
    User = require('../models/user');

let router = express.Router({mergeParams: true});

// path: "/"

/* root */
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
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function () {
                // console.log(res);
                res.redirect("/login")
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
    failureRedirect: '/login'
}), function (req, res) {
    // empty callback
});

/* logout */
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;