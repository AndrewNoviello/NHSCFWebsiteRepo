var bcrypt = require("bcryptjs");
var mongoose = require("mongoose");

const SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    fname:{type:String, required:true},
    lname:{type:String, required:true},
    grade:{type:Number, required:true},
    prefEmail:{type:String, required:true, unique:true},
    prefPhoneNum:{type:String, required:false, unique:true},
    password:{type:String, required:false},
    schoolName:{type:String, required:true},
    admin:{type:Boolean, required:true, default:false},
    createdAt:{type:Date, default:Date.now}
});

userSchema.pre("save", function(done){
    
    var user = this;

    if(!user.isModified("password")){
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err){ return done(err);}
        bcrypt.hash(user.password, salt, function(err, hashedPassword){
            if(err){return done(err);}
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.checkPassword = function(guess, done){
    if(this.password != null){
        bcrypt.compare(guess, this.password, function(err, isMatch){
            done(err, isMatch);
        });
    }
}

var User = mongoose.model("User", userSchema);

module.exports = User;