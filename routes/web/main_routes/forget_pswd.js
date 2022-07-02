var express = require("express");

var router = express.Router();

var User = require("../../../models/user");
var baseURL = require("../../../params/params").baseURL;
var nodemailer = require("nodemailer");
var delay = require("delay");

router.get("/forgotPassword", function(req, res, next){
    res.render("pages/signup_forms/forgot_pswd_forms/forgotPasswordForm");
});

router.post("/sendConfirmEmailPwdChg", async function(req, res, next){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'abnoviello23'
            }
    });
  
    var mailOptions = {
        from:  'The National High School Climate Forum <nhsclimateforum@gmail.com>',
        to: req.body.email,
        subject: "Password Reset",
        html: "Please use the following link to change your NHSCF password: <br> " + baseURL + "/cwhfbehfeofbhoe3he33cdw3e3fe3fe3uu0bfe02fbe20e30ebf42f429yfevy3f"
    };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect("/home");
});

router.post("/changePassword", async function(req, res, next){
    if(req.body.pwd == req.body.cpwd){
        let doc = await User.findOne({prefEmail:req.body.email});
        console.log("Original: " + doc);
        doc.password = req.body.pwd;
        console.log("Updated: " + doc);
        doc.save();
    }
    res.redirect("/login");
});

router.get("/cwhfbehfeofbhoe3he33cdw3e3fe3fe3uu0bfe02fbe20e30ebf42f429yfevy3f", function(req, res, next){
    res.render("pages/signup_forms/forgot_pswd_forms/newPasswordForm");
});

module.exports = router;