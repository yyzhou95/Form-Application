/* requirement */
let express = require("express"),
    Ground = require('../models/ground');

let router = express.Router();

// path: "/list"

/* add image */
router.get('/new', function (req, res) {
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
router.post('/', function (req, res) {
    res.redirect('/');
});

/* display more info about :id picture */
router.get("/:id", function (req, res) {

    // find the campground with provided ID
    Ground.findById(req.params.id).populate("imageRelatedComment").exec(function (err, found) {
        if (err) {
            console.log(err);
        } else {
            // console.log(found);

            // render single image template with that campground
            res.render("singleImage", {component: found});
        }
    });
});

module.exports = router;