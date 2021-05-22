var express = require("express");

var router = express.Router();
var passport = require("passport");
var User = require("../../models/user");
var nodemailer = require("nodemailer");
var multer = require("multer");
var Event = require('../../models/event');
var fs = require("fs");
var path = require("path");
const { root } = require("npm");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 
var upload = multer({ storage: storage });

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

router.get("/emailForm", function(req,res){
    res.render("home/emailForm");
});

router.get("/CMPanelToggle", function(req,res){
    res.render("home/CMPanelToggle");
});

router.get('/eventCreate', function(req, res) {
    Event.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('home/eventCreate', { items: items });
        }
    });
});

router.get('/eventListRender', function(req, res) {
    Event.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('home/eventListRender', { items: items });
        }
    });
});

router.get('/eventRegister', function(req, res) {
    Event.find({"isOpen" : "Yes"}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            if(items.length){
                console.log(items[0].eventFields);
                var formFields = items[0].eventFields.split(",");
                var additionalInfo = items[0];
            }
            else{
                var formFields=[];
                additionalInfo = null;
            }
            console.log(additionalInfo.eventName);
            res.render('home/eventRegister', { info: additionalInfo, items: formFields });
        }
    });
});

router.post('/eventCreate', upload.single('image'), (req, res, next) => {
    var rootPath = 'C:/Users/alex8/Desktop/ClimateActionClubFolder/NHSCFWebApp/NHSCFWebsiteRepo';
    console.log(req.body.eventName);
    var obj = {
        eventName: req.body.eventName,
        eventDate: req.body.eventDate,
        eventDesc: req.body.eventDesc,
        numEventFields: req.body.numEventFields,
        eventFields: req.body.eventFields,
        isPublic: req.body.isPublic,
        isOpen: req.body.isOpen,
        img: {
            data: fs.readFileSync(path.join(rootPath + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Event.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
           
            res.redirect('/eventListRender');
        }
    });
});

router.post("/emailForm", function(req, res, next){
    var emailAddress = req.body.emailAddr;
    var emailSubject = req.body.emailSubj;
    var emailMessage = req.body.emailMessage;
    var schoolName = req.body.schoolName;
    var recipient = req.body.recipient;
    emailMessage = emailMessage.replace(/SCHOOL_NAME/g, schoolName);
    emailMessage = emailMessage.replace(/PERSON_NAME/g, recipient);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'Noviello88$'
            }
    });
  
    var mailOptions = {
        from: 'nhsclimateforum@gmail.com',
        to: emailAddress,
        subject: emailSubject,
        text: emailMessage
    };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
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
        //console.log("Created New User");
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
        //console.log("About to Check Passport");
    });
}, passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect:"/signup",
    failureFlash:true
}));

module.exports = router;