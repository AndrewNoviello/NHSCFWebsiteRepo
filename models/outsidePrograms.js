var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var outsideProgramsSchema = mongoose.Schema({
    programName: String,
    programHost: String,
    programLocation: String,
    programDesc: String,
    programDates: String,
    programLink: String,
    img:
    {
        data: Buffer,
        contentType: String
    },
    used: Boolean,
    associatedNewsletter: String
});

var outsideProgram = mongoose.model("OutsidePrograms", outsideProgramsSchema);

module.exports = outsideProgram;