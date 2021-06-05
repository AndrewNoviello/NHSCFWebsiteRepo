var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require("./models/user");

module.exports= function(){
    passport.serializeUser(function(user,done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        });
    });

    passport.use("login", new LocalStrategy({
        usernameField:'email',
        passwordField:'password'
    }, function(username, password, done){
        console.log("In Passport Authenticate");
        User.findOne({prefEmail:username}, function(err, user){
            if(err){
                console.log("In Passport Error 1");    
                return done(err);
            }
            if(!user){
                console.log("No User Has That Email")
                return done(null, false, {message: "No User Has That Email"});
            }
            user.checkPassword(password, function(err, isMatch){
                if(err){
                    console.log("In Passport Error 2"); 
                    return done(err);
                }
                if(isMatch){
                    return done(null, user);
                } else{
                    console.log("Wrong Password");
                    return done(null, false, {message: "Invalid Password"});
                }
            });
        });
    }));
}