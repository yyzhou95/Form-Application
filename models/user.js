let mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    username: String,
    password: String,
    registerDate: {
        type: Date,
        default: Date.now()
    }
});

userSchema.plugin(passportLocalMongoose);       // add serializeUser and deserializeUser

module.exports = mongoose.model("User", userSchema);