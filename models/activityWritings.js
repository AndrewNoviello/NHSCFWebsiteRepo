var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var activityWritingSchema = mongoose.Schema({
    authorName: String,
    authorGradYear: Number,
    authorSchoolName: String,
    dateSubmitted: String,
    fullText: String,
    imageFileName: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    used: Boolean,
    associatedNewsletter: String
});

var activityWriting = mongoose.model("ActivityWritings", activityWritingSchema);

module.exports = activityWriting;
