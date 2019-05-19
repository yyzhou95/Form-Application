/* requirement */
let express = require("express"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    flash = require('connect-flash'),
    // Seed = require('./seed'),
    User = require('./models/user');

/* express app */
let app = express();

app.set("view engine", "ejs");                                  // set ejs as default file

app.use(express.static(__dirname + "/public"));            // mark public folder to use css files inside it
app.use(bodyParser.urlencoded({extended: true}));       // expand body structure
app.use(methodOverride('_method'));
app.use(flash());

/* passport config */
app.use(require("express-session")({
    secret: 'Test Secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));       // User.authenticate() is in user.js plugin
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Middleware to pass user. Note that this function should be placed ahead of router! */
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.requireLogIn = req.flash('require-log-in');
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

/* Require routers and use them */
let indexRoute = require("./routes/index"),
    listRoute = require("./routes/post-list"),
    commentRoute = require("./routes/comments");

app.use('/', indexRoute);
app.use('/list', listRoute);
app.use('/list/:id/comment', commentRoute);

/* database connection */
mongoose.connect("mongodb://localhost:27017/web_app", {useNewUrlParser: true});

/* Database init */
// Seed();       // add some test data into database

/* finally, if a request is not recorded in router, return a 404 page */
app.get('*', function (req, res) {
    // console.log("Request invalid page.");
    res.send("404!");
});


/* listen port */
let port = process.env.PORT || 25600;
let ip = process.env.IP || 'localhost';

/* Listen on certain port */
app.listen(port, ip, function () {
    console.log("Server online at port: " + port + " and address: " + ip)
});
