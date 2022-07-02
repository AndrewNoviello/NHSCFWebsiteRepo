var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var newsletterSchema = mongoose.Schema({
    newsletterMonth: String,
    newsletterYear: String,
    releaseDate: String,
    newsletterQuote: String,
    newsletterQuoteAuthor: String,
    newsletterAnnouncements: String,
    newsletterMessage: String,
    activityWritings: Array,
    susTips: Array,
    otherArticles: Array,
    outsidePrograms: Array,
    interestingLinks: Array,
    schoolEvents: Array
});

var Newsletter = mongoose.model("Newsletter", newsletterSchema);

module.exports = Newsletter;