var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var interestingLinkSchema = mongoose.Schema({
    linkFinder: String,
    linkFinderSchool: String,
    linkTitle: String,
    linkDesc: String,
    link: String,
    used: Boolean,
    associatedNewsletter: String
});

var interestingLink = mongoose.model("InterestingLinks", interestingLinkSchema);

module.exports = interestingLink;