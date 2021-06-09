var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var eventSchema = mongoose.Schema({
    eventName: String,
    eventDate: String,
    eventDesc: String,
    numEventFields: Number,
    eventFields: String,
    registered: Array,
    isPublic: String,
    isOpen: String,
    img:
    {
        data: Buffer,
        contentType: String
    }
});

var Event = mongoose.model("Event", eventSchema);

module.exports = Event;