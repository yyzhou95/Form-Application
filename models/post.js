let mongoose = require('mongoose');

/* schema setup */
let postSchema = new mongoose.Schema({
    name: String,
    link: {
        type: String,
        default: ''
    },
    postContent: String,
    uploadUser: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    imageRelatedComment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CommentModel"      // name of the model, should be identical to the export model in comment.js
        }
    ],
    createDate: {
        type: Date,
        default: Date.now()
    }
});

/* export database model that is set up via schema */
module.exports = mongoose.model('Ground', postSchema);