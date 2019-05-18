/* requirement */
let Ground = require('../models/ground'),
    Comment = require('../models/comment'),
    express = require("express");

let router = express.Router({mergeParams: true});

// path: "/list/:id/comment"

/* GET and POST new comment */
router.get("/new", isLogged, function (req, res) {
    Ground.findById(req.params.id, function (err, found) {
        if (err) {
            console.log(err);

        } else {
            res.render("comment/new", {component: found})
        }
    })
});

/* add comment */
router.post("/", isLogged, function (req, res) {
    Ground.findById(req.params.id, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            // console.log(req.body.commentForm);
            Comment.create(req.body.commentForm, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {

                    /* associate comment with image */
                    found.imageRelatedComment.push(comment);
                    found.save();
                    res.redirect('/list/' + found._id)
                }
            })
        }
    })
});

/* middleware to pass user */
router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
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