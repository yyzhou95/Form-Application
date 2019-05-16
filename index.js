// requirement
let express = require("express");
let bodyParser = require("body-parser");
let request = require("request");

const port = 25600;     // listen port
const h = {
    'api_key': "2220d5d038fb48cb89b90a3bffe32da3",
};

let app = express();        // express app

let arr = ['a', 'b'];
let metroURL = 'https://api.wmata.com/StationPrediction.svc/json/GetPrediction/C01';

// mark public folder to use css files inside it
app.use(express.static("public"));

// use body parser
app.use(bodyParser.urlencoded({extended: true}));

// set ejs as default file
app.set("view engine", "ejs");

// post request handler
app.post("/newpost", function (req, res) {
    let content = req.body.content;
    arr.push(content);
    res.redirect("/");      // redirect to home page
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

// a example of using data that response from API
app.get('/metro', function (req, res) {
    let r = res;
    request({
        headers: h,
        uri: metroURL,
        method: 'GET'
    }, function (err, res, body) {
        if (err) {
            console.log(err);
        } else {

            if (res.statusCode === 200) {
                let parseData = JSON.parse(body);       // reorganize data from string into JSON
                r.send(parseData);
            } else {
                console.log(res.statusCode);
            }
        }
    });
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
