var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var schoolEventSchema = mongoose.Schema({
    schoolName: String,
    schoolEventDate: String,
    schoolEventTime: Number,
    schoolEventTimeZone: String,
    schoolEvent_ampm: String,
    schoolEventName: String,
    schoolEventDesc: String,
    used: Boolean,
    associatedNewsletter: String
});

var schoolEvent = mongoose.model("SchoolEvents", schoolEventSchema);

module.exports = schoolEvent;