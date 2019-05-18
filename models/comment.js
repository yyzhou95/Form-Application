let mongoose = require('mongoose');

/* schema setup */
let commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    createDate: {
        type: Date,
        default: Date.now()
    }
});


/* Export model, note that the 'Comment' is a ref name that would use in Ground */
module.exports = mongoose.model('Comment', commentSchema);