var express = require("express");
var passport = require("passport");

var router = express.Router();

var passport = require("passport");
var User = require("../../../models/user");
var School = require("../../../models/school");
var nodemailer = require("nodemailer");

var adminEmails = require("../../../params/params").adminEmails;

router.post("/join", function(req,res,next){
    var schoolName = req.body.newSchoolName;
    var newClub = req.body.newSchoolClubName;
    var state = req.body.newSchoolState;
    var facName = req.body.newSchoolFacAdvName;
    var facEmail = req.body.newSchoolFacAdvEmail;
    var socialMedia = req.body.newSchoolClubSM;
    var rep = req.body.recRep;
    
    School.findOne({schoolName:schoolName}, function(err, school){
        if(err){return next(err);}
        if(school){
            req.flash("error", "Your School is Already In the National High School Climate Forum");
            return res.redirect("./join");
        }
        console.log(schoolName);
        console.log(newClub);
        if(schoolName == null || newClub == null || state == null){
            req.flash("error", "Please Complete The Form");
            return res.redirect("./join");
        }
        var newSchool = new School({
            schoolName:schoolName,
            clubName:newClub,
            clubFacAdvName:facName,
            clubFacAdvEmail:facEmail,
            state:state,
            primSocMedia:socialMedia
        });
        newSchool.save(next);
        var repsList = ['AN', 'EP', 'JM', 'IM'];
        var links = ["https://calendly.com/acnoviello23/nhscf", "https://calendly.com/elise-picard/national-high-school-climate-forum-welcome-meeting", "https://calendly.com/jason_ma/national-high-school-climate-forum-welcome-meeting", "https://calendly.com/isabelle-miller-/national-high-school-climate-forum-welcome-meeting"];
        
        res.redirect(links[repsList.indexOf(rep)]);
    });
});

router.post("/login", function(req, res, next){
    var email = req.body.email;
    User.findOne({prefEmail:email}, function(err, user){
        if(err){
            console.log("In Error");
            return next(err);
        }
        if(!user){
            req.flash("error", "No Account Has This Email");
            return res.redirect("./login");
        }

        console.log("About to Check Passport");
        next();
    });
}, passport.authenticate("login", {
    successRedirect:"/dashboard",
    failureRedirect:"/login",
    failureFlash:true
}));

router.post("/signup", function(req,res, next){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var email = req.body.email;
    var grade = req.body.grade;
    var phone = req.body.prefPhoneNum;
    var password = req.body.password;
    var school = req.body.school;
    var adminStatus = false;
    var adminEmailArrayLength = adminEmails.length;
    for(var i = 0; i < adminEmailArrayLength; i++){
        if(email == adminEmails[i]){
            adminStatus = true;
        }
    }

    console.log(school);
    User.findOne({prefEmail:email}, function(err, user){
        if(err){
            console.log("In Error");
            return next(err);
        }
        if(user){
            req.flash("error", "Account With This Email Already Exists");
            console.log("In User Exists");
            return res.redirect("./signup");
        }
        /*
        if(req.body.key != privateKey){
            req.flash("error", "Wrong Private Key");
            console.log("Wrong Private Key");
            return res.redirect("./signup");
        }*/
        if(fname == null || lname == null || email == null || grade == null || school == null){
            console.log("In Nulls");
            
            req.flash("error", "Please Complete The Form");
            return res.redirect("./signup");
        }
        var newUser = new User({
            fname:fname,
            lname:lname,
            grade:grade,
            prefEmail:email,
            prefPhoneNum: phone,
            committee:req.body.comm,
            password:password,
            schoolName:school,
            admin:adminStatus
        });
        newUser.save(next);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nhsclimateforum@gmail.com',
                pass: 'abnoviello23'
                }
        });
      
        var mailOptions = {
            from:   'The National High School Climate Forum <nhsclimateforum@gmail.com>',
            to: email,
            subject: "Welcome to the National High School Forum!",
            html: "Dear " + fname + "<br>We are so excited to welcome you into the National High School Climate Forum community! Now, you will be able to access your committee member dashboard, view private events, and engage with other high school environmental leaders across the country!<br><br>The National High School Climate Forum"
        };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
        console.log("About to Check Passport");
    });
}, passport.authenticate("login", {
    successRedirect:"/dashboard",
    failureRedirect:"/signup",
    failureFlash:true
}));

module.exports = router;