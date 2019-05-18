/* requirement */
let express = require("express"),
    bodyParser = require("body-parser"),
    Ground = require('./models/ground'),
    mongoose = require("mongoose"),
    Seed = require('./seed');

/* express app */
let app = express();

app.use(express.static("public"));                         // mark public folder to use css files inside it
app.use(bodyParser.urlencoded({extended: true}));       // expand body structure
app.set("view engine", "ejs");                                  // set ejs as default file

/* database connection */
mongoose.connect("mongodb://localhost:27017/web_app", {useNewUrlParser: true});

/* Database init */
Seed();       // add some test data into database

/* listen port */
const port = 25600;

// root
app.get('/', function (req, res) {
    res.render('landing')
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
    Ground.findById(req.params.id).populate("imageRelatedComment").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);

            // render single image template with that campground
            res.render("singleImage", {component: foundCampground});
        }
    });
});

/* finally, if a request is not recorded in router, return a 404 page */
app.get('*', function (req, res) {
    // console.log("Request invalid page.");
    res.send("404!");
});

/* Listen on certain port */
app.listen(port, function () {
    console.log("Server online.")
});
