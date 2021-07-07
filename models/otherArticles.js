var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var otherArticlesSchema = mongoose.Schema({
    authorName: String,
    authorGradYear: Number,
    authorSchoolName: String,
    dateSubmitted: String,
    articleTitle: String,
    fullText: String,
    used: Boolean,
    associatedNewsletter: String
});

var otherArticle = mongoose.model("OtherArticles", otherArticlesSchema);

module.exports = otherArticle;