/* requirement */
let express = require("express"),
    Middleware = require('../middleware/index'),
    Post = require('../models/post');

let router = express.Router();

// path: "/list"

/* iter all photos */
router.get('/', function (req, res) {
    let response = res;
    Post.find({}, function (err, findRes) {
        if (err) {
            console.log(err);
        } else {

            if (!findRes) {
                req.flash("error", "No item found.");
                return res.redirect("back");
            }
            response.render('post/post-list', {component: findRes})
        }
    });
});

/* Add new images */
router.post('/', function (req, res) {
    let name = req.body.name;
    let image = req.body.image;
    let content = req.body.content;
    let uploader = {
        id: req.user._id,
        username: req.user.username
    };
    let newPost = {name: name, link: image, postContent: content, uploadUser: uploader};

    /* Create a new campground and save to DB */
    Post.create(newPost, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            if (!newlyCreated) {
                req.flash("error", "No item created.");
                return res.redirect("back");
            }
            res.redirect('/list');
        }
    });
});

/* Add a new post */
router.get('/new', Middleware.isLoggedIn, function (req, res) {
    res.render('post/new-post')
});

/* Edit existing post */
router.get('/:id/edit', Middleware.checkPostOwner, function (req, res) {
    Post.findById(req.params.id, function (err, foundPost) {
        if (err) {
            console.log(err);
        } else {
            if (!foundPost) {
                req.flash("error", "No item found.");
                return res.redirect("back");
            }
            res.render("post/edit-post", {element: foundPost});
        }
    });
});

/* Update existing post */
router.put('/:id', Middleware.checkPostOwner, function (req, res) {
    let updateContent = {
        name: req.body.name,
        link: req.body.image,
        postContent: req.body.content
    };
    Post.findOneAndUpdate(req.params.id, updateContent, {new: true}, function (err, updateData) {
        if (err) {
            console.log(err);
        } else {
            if (!updateData) {
                req.flash("error", "No item found.");
                return res.redirect("back");
            }
            // console.log(updateData);
            req.flash("success", "Update succeed!");
            res.redirect('/list/' + req.params.id);
        }
    })
});

/* Delete */
router.delete('/:id', Middleware.checkPostOwner, function (req, res) {
    Post.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            console.log(err);
        } else {

            // TODO: add confirmation before delete
            res.redirect('/list')
        }
    })
});


/* display more info about :id picture */
router.get("/:id", function (req, res) {

    // find the campground with provided ID
    Post.findById(req.params.id).populate("imageRelatedComment").exec(function (err, found) {
        if (err) {
            console.log(err);
        } else {
            // render single image template with that campground
            res.render("post/show-post", {component: found});
        }
    });
});

module.exports = router;