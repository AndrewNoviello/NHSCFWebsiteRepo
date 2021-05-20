var express = require("express");

var router = express.Router();
var passport = require("passport");
var User = require("../../models/user");

router.get("/", function(req, res){
    console.log("On Start Page");
    res.render("home/index");
});

router.get("/home", function(req, res){ 
    res.render("home/home");
});

router.get("/about", function(req,res){
    res.render("home/about");
});

router.get("/login", function(req,res){
    res.render("home/login");
});

router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/home");
});

router.post("/login", passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true
}));

router.get("/signup", function(req,res){
    res.render("home/signup");
});

router.post("/signup", function(req,res, next){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var prefEmail = req.body.prefEmail;
    var grade = req.body.grade;
    var phone = req.body.prefPhoneNum;
    var password = req.body.password;
    var school = req.body.school;

    User.findOne({prefEmail:prefEmail}, function(err, user){
        if(err){return next(err);}
        if(user){
            req.flash("error", "Account With This Email Already Exists");
            return res.redirect("./signup");
        }
        console.log("Created New User");
        var newUser = new User({
            fname:fname,
            lname:lname,
            grade:grade,
            prefEmail:prefEmail,
            prefPhoneNum: phone,
            password:password,
            schoolName:school
        });
        newUser.save(next);
        console.log("About to Check Passport");
    });
}, passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect:"/signup",
    failureFlash:true
}));

module.exports = router;