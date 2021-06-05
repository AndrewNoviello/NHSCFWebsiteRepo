var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var schoolSchema = mongoose.Schema({
    schoolName:{type:String, required:true, default:" "},
    clubName:{type:String, required:true, default:" "},
    clubFacAdvName:{type:String, required:false},
    clubFacAdvEmail:{type:String, required:false},
    state:{type:String, required:true, default:" "},
    primSocMedia:{type:String, required:false},
    createdAt:{type:Date, default:Date.now}
});

var School = mongoose.model("School", schoolSchema);

module.exports = School;
