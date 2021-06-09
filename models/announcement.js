var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var dateFormat = require("dateformat");
var now = new Date();
const SALT_FACTOR = 10;

var announcementSchema = mongoose.Schema({
    title:{type:String, required:true},
    content:{type:String, required:true},
    commentable:{type:Boolean, required:true, default:false},
    createdAt:{type:String, default:dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT")}
});

var Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;