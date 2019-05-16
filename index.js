// requirement
let express = require("express");
let bodyParser = require("body-parser");

const port = 25600;     // listen port

let app = express();        // express app

let arr = ['a', 'b'];

// mark public folder to use css files inside it
app.use(express.static("public"));

// use body parser
app.use(bodyParser.urlencoded({extended: true}));

// set ejs as default file
app.set("view engine", "ejs");

app.post("/newpost", function (req, res) {
    let content = req.body.content;
    arr.push(content);
    res.redirect("/");

    // res.send(req.body);
});

// root path
app.get('/', function (req, res) {
    console.log("Request root");
    res.render('home', {arr: arr});
});


// test parameter passing through
app.get('/para/:para', function (req, res) {
    let pass = req.params.para;
    console.log(req.params);
    console.log("Request " + pass);
    res.render('para', {para: pass});
});


// loop test
app.get('/loop/:iter', function (req, res) {
    let array = [
        {title: 'Post 1', author: 'Mirage'},
        {title: 'Post 2', author: 'Boris'},
        {title: 'Post 3', author: 'Olivia'},
    ];
    res.render('loop', {arr: array})
});


// finally, if a request is not recorded in router, return a 404 page
app.get('*', function (req, res) {
    // console.log("Request invalid page.");
    res.send("404!");
});

// Listen on certain port
app.listen(port, function () {
    console.log("Server online.")
});
