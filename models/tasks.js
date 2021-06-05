var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var taskSchema = mongoose.Schema({
    commAssign:{type:String, required:true},
    dueDate:{type:String, required:true},
    title:{type:String, required:true},
    description:{type:String, required:true},
    active:{type:Boolean, required:true, default:false},
    createdAt:{type:Date, default:Date.now}
});

var Task = mongoose.model("Task", taskSchema);

module.exports = Task;