var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var susTipsSchema = mongoose.Schema({
    susTipTitle: String,
    susTipFullText: String,
    susTipSourceURL: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    used: Boolean,
    associatedNewsletter: String
});

var sustainabilityTip = mongoose.model("SustainabilityTips", susTipsSchema);

module.exports = sustainabilityTip;