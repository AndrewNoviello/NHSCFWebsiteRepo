var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");
var dateFormat = require("dateformat");
var now = new Date();
const SALT_FACTOR = 10;

var commentSchema = mongoose.Schema({
    user:{type:String, required:true},
    title:{type:String, required:true},
    content:{type:String, required:true},
    announcement:{type:String, required:true},
    active:{type:Boolean, required:true, default:false},
    createdAt:{type:String, default:dateFormat(now, "dddd, mmmm dS, yyyy, h:MM TT")}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;