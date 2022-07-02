var mongoose = require("mongoose");

var speakerSchema = mongoose.Schema({
    name: String,
    bio: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

var Speaker = mongoose.model("Speaker", speakerSchema);

module.exports = Speaker;