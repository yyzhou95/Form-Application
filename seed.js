let Comment = require('./models/comment'),
    Ground = require('./models/post');


let data = [
    {
        name: "iPhone 4s",
        link: 'https://cnet4.cbsistatic.com/img/GwR3_fkUehzC3TIHgQZEOufwC7k=/868x488/2012/09/12/8acbd499-cc2e-11e2-9a4a-0291187b029a/apple-iphone5_1.jpg',
    },
    {
        name: "iPhone X",
        link: 'https://thumbor.forbes.com/thumbor/960x0/https%3A%2F%2Fblogs-images.forbes.com%2Fgordonkelly%2Ffiles%2F2019%2F04%2FiPhone-fold-1200x800.jpg'
    }
];

function seedDB() {

    /* First, remove all Ground instance */
    Ground.remove({}, function (err) {
        // if (err) {
        //     console.log(err)
        // } else {
        //     console.log("Database has been removed...");
        //
        //     /* After remove each Ground instance, remove associated Comment */
        //     Comment.remove({}, function (err) {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             console.log("Comment removed!");
        //
        //             /* After remove Comment, create new data */
        //             data.forEach(function (s) {
        //
        //                 /* Create Ground instance first */
        //                 Ground.create(s, function (err, d) {
        //                     if (err) {
        //                         console.log(err);
        //                     } else {
        //                         console.log("item added...");
        //
        //                         /* Then create associated comment */
        //                         Comment.create({
        //                             text: "APPLE IS THE BEST",
        //                             author: "Boris",
        //                         }, function (err, comment) {
        //                             if (err) {
        //                                 console.log(err);
        //                             } else {
        //                                 d.imageRelatedComment.push(comment);        // add to associated Ground instance
        //                                 d.save();                       // save to db
        //                                 console.log("A new test comment is added.");
        //                                 // console.log(d.comment);
        //                             }
        //                         })
        //                     }
        //                 })
        //             });
        //         }
        //     });
        // }
    });
}

module.exports = seedDB;