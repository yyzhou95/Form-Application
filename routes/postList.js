/* requirement */
let express = require("express"),
    Ground = require('../models/ground');

let router = express.Router();

// path: "/list"

/* add image */
router.get('/new', isLogged, function (req, res) {
    res.render('new')
});

/* iter all photos */
router.get('/', function (req, res) {
    let response = res;
    Ground.find({}, function (err, findRes) {
        if (err) {
            console.log(err);
        } else {
            response.render('list', {component: findRes})
        }
    });
});

/* Add new images */
router.post('/', function (req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let uploader = {
        id: req.user._id,
        username: req.user.username
    };
    let newGround = {name: name, link: image, uploadUser: uploader};
    /* Create a new campground and save to DB */
    Ground.create(newGround, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/list');
        }
    });
});

/* display more info about :id picture */
router.get("/:id", function (req, res) {

    // find the campground with provided ID
    Ground.findById(req.params.id).populate("imageRelatedComment").exec(function (err, found) {
        if (err) {
            console.log(err);
        } else {
            // render single image template with that campground
            res.render("singleImage", {component: found});
        }
    });
});

/**
 * Middleware function add to requests require authentication.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function isLogged(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;