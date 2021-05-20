var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var schoolSchema = mongoose.Schema({
    schoolName:{type:String, required:true},
    clubName:{type:String, required:true},
    clubFacAdv:{type:String, required:false},
    state:{type:String, required:true},
    primSocMedia:{type:String, required:false},
    createdAt:{type:Date, default:Date.now}
});

var School = mongoose.model("School", schoolSchema);

module.exports = School;
