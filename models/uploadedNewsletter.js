var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var uploaded_newsletterSchema = mongoose.Schema({
    newsletterMonth: String,
    newsletterYear: String,
    releaseDate: String,
    newsletterPDFFileName: String,
    newsletterImgFileName: String
});

var UploadedNewsletter = mongoose.model("UploadedNewsletter", uploaded_newsletterSchema);

module.exports = UploadedNewsletter;