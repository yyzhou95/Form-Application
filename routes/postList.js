/* requirement */
let express = require("express"),
    Ground = require('../models/ground');

let router = express.Router();

// path: "/list"

/* add image */
router.get('/new', isLogged, function (req, res) {
    res.render('post/newPost')
});

/* iter all photos */
router.get('/', function (req, res) {
    let response = res;
    Ground.find({}, function (err, findRes) {
        if (err) {
            console.log(err);
        } else {
            response.render('post/postList', {component: findRes})
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

/* Edit */
router.get('/:id/edit', checkPostOwner, function (req, res) {
    Ground.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            res.render("post/editPost", {element: foundPost});
        }
    });
});

/* Update */
router.put('/:id', checkPostOwner, function (req, res) {
    Ground.findOneAndUpdate(req.params.id, {name: req.body.name, link: req.body.image}, function (err, updateData) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/list/' + req.params.id);
        }
    })
});

/* Delete */
router.delete('/:id', checkPostOwner, function (req, res) {
    Ground.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/list')
        }
    })
});

// TODO: add confirmation before delete

/* display more info about :id picture */
router.get("/:id", function (req, res) {

    // find the campground with provided ID
    Ground.findById(req.params.id).populate("imageRelatedComment").exec(function (err, found) {
        if (err) {
            console.log(err);
        } else {
            // render single image template with that campground
            res.render("post/singlePost", {component: found});
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

/**
 * Check if current user is the request resource's owner.
 * If it is the owner, then give it the authority to edit, remove corresponding resource.
 * Otherwise, add event to notify user that they do not have the access to do it.
 * @param req
 * @param res
 * @param next
 */
function checkPostOwner(req, res, next) {
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
}

module.exports = router;