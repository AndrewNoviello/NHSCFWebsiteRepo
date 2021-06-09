var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var newsletterSchema = mongoose.Schema({
    newsletterMonth: String,
    newsletterYear: String,
    releaseDate: String,
    newsletterPDFFileName: String,
    newsletterImgFileName: String
});

var Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;