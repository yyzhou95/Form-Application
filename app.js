// requirement
let express = require("express");
let bodyParser = require("body-parser");

const port = 25600;     // listen port

let app = express();        // express app

app.use(express.static("public"));                         // mark public folder to use css files inside it
app.use(bodyParser.urlencoded({extended: true}));       // expand body structure
app.set("view engine", "ejs");                                  // set ejs as default file

let elements = [
    {name: "Salmon Creek", link: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", link: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", link: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
    {name: "Salmon Creek", link: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", link: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", link: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
    {name: "Salmon Creek", link: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
    {name: "Granite Hill", link: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
    {name: "Mountain Goat's Rest", link: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];

// root
app.get('/', function (req, res) {
    res.render('landing')
});

app.post('/list', function (req, res) {
    let n = req.body.name;
    let i = req.body.image;
    elements.push({name: n, link: i});
    res.redirect('/list');
});

app.get('/list/new', function (req, res) {
    res.render('new')
});

app.get('/list', function (req, res) {
    res.render("list", {component: elements});
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
