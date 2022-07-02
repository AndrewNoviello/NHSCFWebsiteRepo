var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

var eventSchema = mongoose.Schema({
    active:{type:Boolean, required:true},
    eventName: {type:String, required:true},
    eventDate: {type:String, required:false},
    eventDesc: {type:String, required:false},
    speakers:{type:Array, required:false},
    registered:{type:Array, required:false},
    numEventFields: {type:Number, required:false},
    eventFields: {type:String, required:false},
    isPublic: {type:Boolean, required:true},
    canRegister: {type:Boolean, required:false},
    img:{data: Buffer, contentType: String, required:false}
});

var Event = mongoose.model("Event", eventSchema);

module.exports = Event;