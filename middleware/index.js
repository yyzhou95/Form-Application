/**
 * @file This is the index of middleware.
 *
 * It provides the function of checking user authentication.
 */

let Ground = require('../models/ground'),
    Comment = require('../models/comment');
let middlewareObject = {};

/**
 * Middleware to check if current user is the request comment's owner.
 * If it is the owner, then give it the authority to edit, remove corresponding resource.
 * Otherwise, add event to notify user that they do not have the access to do it.
 * @param req
 * @param res
 * @param next
 */
middlewareObject.checkCommentOwner = function (req, res, next) {
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
};

/**
 * Check if current user is the request resource's owner.
 * If it is the owner, then give it the authority to edit, remove corresponding resource.
 * Otherwise, add event to notify user that they do not have the access to do it.
 * @param req
 * @param res
 * @param next
 */
middlewareObject.checkPostOwner = function (req, res, next) {
    if (req.isAuthenticated()) {
        Ground.findById(req.params.id, function (err, foundPost) {
            if (err) {
                console.log(err);
            } else {
                if (foundPost.uploadUser.id.equals(req.user.id)) {
                    return next();
                } else {
                    res.redirect('back');
                }
            }
        })      // TODO: add function as notification
    } else {
        res.redirect("back");
    }
};

/**
 * Middleware function add to requests require authentication.
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
middlewareObject.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {        // is user login?
        return next();      // if login, then continue to do following things
    }
    req.flash("require-log-in", "Please log in first...");
    res.redirect('/login');
};

module.exports = middlewareObject;