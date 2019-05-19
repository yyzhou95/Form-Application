/* requirement */
let Ground = require('../models/ground'),
    Comment = require('../models/comment'),
    express = require("express");

let router = express.Router({mergeParams: true});

// path: "/list/:id/comment"

/* GET and POST new comment */
router.get("/new", isLoggedIn, function (req, res) {
    Ground.findById(req.params.id, function (err, found) {
        if (err) {
            console.log(err);

        } else {
            res.render("comment/newComment", {component: found})
        }
    })
});

/* add comment */
router.post("/", isLoggedIn, function (req, res) {
    Ground.findById(req.params.id, function (err, found) {
        if (err) {
            console.log(err);
        } else {
            // console.log(req.body.commentForm);
            Comment.create(req.body.commentForm, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {

                    /* Add username and id to comment */
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();     // save comment to db
                    /* associate comment related to certain image */
                    found.imageRelatedComment.push(comment);
                    found.save();       // save find post to db
                    res.redirect('/list/' + found._id)
                }
            })
        }
    })
});

/* Edit comment */
router.get('/:comment_id/edit', checkCommentOwner, function (req, res) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/editComment", {postID: req.params.id, comment: foundComment})
        }
    });
});
router.put('/:comment_id', checkCommentOwner, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, {text: req.body.editComment}, function (err, updated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/list/' + req.params.id);
        }
    })
});

/* Delete comment */
router.delete('/:comment_id', checkCommentOwner, function (req, res) {
    Comment.findByIdAndDelete(req.params.comment_id, function (err) {
        if (err) {
            console.log(err);
        } else {
            // TODO: add notification and confirmation for delete
            res.redirect('/list/' + req.params.id)
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
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {        // is user login?
        return next();      // if login, then continue to do following things
    }
    res.redirect('/login');
}

/**
 * Middleware to check if current user is the request comment's owner.
 * If it is the owner, then give it the authority to edit, remove corresponding resource.
 * Otherwise, add event to notify user that they do not have the access to do it.
 * @param req
 * @param res
 * @param next
 */
function checkCommentOwner(req, res, next) {
    if (req.isAuthenticated()) {        // is user login?
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                console.log(err);
            } else {
                if (foundComment.author.id.equals(req.user.id)) {      // is current user same as comment poster?
                    return next();      // if same user, then continue actions
                } else {
                    res.redirect('back');
                }
            }
        })      // TODO: add function as notification
    } else {
        res.redirect("back");
    }
}


module.exports = router;