/* requirement */
let express = require("express"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require('./models/user'),
    mongoose = require("mongoose"),
    Ground = require('./models/ground'),
    Comment = require('./models/comment'),
    Seed = require('./seed');

/* express app */
let app = express();

app.set("view engine", "ejs");                                  // set ejs as default file
app.use(require("express-session")({
    secret: 'Test Secret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + "/public"));            // mark public folder to use css files inside it
app.use(bodyParser.urlencoded({extended: true}));       // expand body structure
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* database connection */
mongoose.connect("mongodb://localhost:27017/web_app", {useNewUrlParser: true});

/* Database init */
Seed();       // add some test data into database

// root
app.get('/', function (req, res) {
    res.render('landing')
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res) {

});

app.get('/login', function (req, res) {
    res.render('login');
});

// middleware
app.post('/login', passport.authenticate("local", {
    successRedirect: '/secret',
    failureRedirect: '/login'
}), function (req, res) {
    res.render('login');
});

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/list/new', function (req, res) {
    res.render('new')
});

app.get('/list', function (req, res) {
    let response = res;
    Ground.find({}, function (err, findRes) {
        if (err) {
            console.log(err);
        } else {
            response.render('list', {component: findRes})
        }
    });
});

app.post('/list', function (req, res) {

    res.redirect('/list');
});

/* display more info about :id picture */
app.get("/list/:id", function (req, res) {

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

/* GET and POST new comment */
app.get("/list/:id/comment/new", function (req, res) {
    Ground.findById(req.params.id, function (err, found) {
        if (err) {
            console.log(err);

        } else {
            res.render("comment/new", {component: found})
        }
    })
});

app.post("/list/:id/comment", function (req, res) {
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


/* finally, if a request is not recorded in router, return a 404 page */
app.get('*', function (req, res) {
    // console.log("Request invalid page.");
    res.send("404!");
});

/* listen port */
let port = process.env.PORT || 25600;
let ip = process.env.IP || 'localhost';

/* Listen on certain port */
app.listen(port, process.env.IP, function () {
    console.log("Server online at " + port + " " + ip)
});
