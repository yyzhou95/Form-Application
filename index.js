let express = require("express");
let app = express();
const port = 25600;

app.get('/', function (req, res) {
    console.log("Request root");
    res.render('home.ejs');
});

app.get('/para/:para', function (req, res) {
    let pass = req.params.para;
    console.log(req.params);
    console.log("Request " + pass);
    res.render('para.ejs', {para: pass});
});

app.get('/loop/:iter', function (req, res) {
    let array = [
        {title: 'Post 1', author: 'Mirage'},
        {title: 'Post 2', author: 'Boris'},
        {title: 'Post 3', author: 'Olivia'},
    ];
    res.render('loop.ejs', {arr: array})
});

app.get('*', function (req, res) {
    console.log("Request invalid page.");
    res.send("404!");
});

app.listen(port, function () {
    console.log("Server online.")
});
