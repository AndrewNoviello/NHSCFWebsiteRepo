var express = require("express");
var multer = require("multer");

var router = express.Router();

var json2csv = require('json2csv');
var User = require("../../../models/user");
var delay = require("delay");
var nodemailer = require("nodemailer");
var UploadedNewsletter = require("../../../models/uploadedNewsletter");

var newsletterStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'public/NewsletterUploads');
  },
  filename: (req, file, cb) => {
      
      if (file.originalname.match(/\.(pdf)$/)){
          cb(null, req.body.newsletterMonth + req.body.newsletterYear + "Newsletter.pdf");
      }
      if(file.originalname.match(/\.(pdf|jpg|JPG|jpeg|JPEG|png|PNG)$/)){
          cb(null, req.body.newsletterMonth + req.body.newsletterYear + "CoverImage.jpg");
      }
  }
});

var NewsletterUpload = multer({storage: newsletterStorage});

router.post("/changeComm", async function(req, res, next){
    console.log(req.user.prefEmail);
    console.log(req.body.newComm);
    console.log("In ChangeComm");
    let doc = await User.findOneAndUpdate({prefEmail:req.user.prefEmail}, {committee:req.body.newComm}, {
        new: true
      });

    res.redirect("/dashboard");
});

router.get("/downloadSignedUpEmails", async function(req, res, next){
  var Emails = [];
  let docs = await User.find({}).lean();
  console.log(docs);
  for(var c = 0; c < docs.length; c++){
      Emails.push({
          "Emails": docs[c].prefEmail,
        });
  }
  var csv = json2csv.parse(Emails);
  res.setHeader('Content-disposition', 'attachment; filename=roster.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
  res.redirect("/dashboard");
});

router.post("/sendIndEmails", async function(req, res, next){
  var message = req.body.message;
  message = message.replace(/\n/g, "<br>");
  var subject = req.body.subject;
  var userList = await User.find({}, (err, userList) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          console.log("in userList else");
      }
  });
  userList.forEach(async function(user) {
      await delay(5000);
      var uMessage = message;
      uMessage = uMessage.replace(/cmmname/g, user.fname);
      var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: 'nhsclimateforum@gmail.com',
              pass: 'abnoviello23'
              }
      });
    
      var mailOptions = {
          from: "Andrew Noviello " + '<nhsclimateforum@gmail.com>',
          to: user.prefEmail,
          subject: subject,
          html: uMessage
      };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
  res.redirect("/dashboard");
});

router.post("/uploadNewsletter", NewsletterUpload.fields([{name: 'newsletter', maxCount: 1}, {name: 'image', maxCount: 1}]), (req, res, next) => {
  console.log(req.body);

  var obj = {
      newsletterMonth: req.body.newsletterMonth,
      newsletterYear: req.body.newsletterYear,
      releaseDate: req.body.releaseDate,
      newsletterPDFFileName: req.body.newsletterMonth + req.body.newsletterYear + "Newsletter.pdf",
      newsletterImgFileName: req.body.newsletterMonth + req.body.newsletterYear + "CoverImage.jpg"
  }

  UploadedNewsletter.create(obj, (err, item) => {
      if (err) {
          console.log(err);
      }
      else {
          res.redirect('/newsletters');
      }
  });
});

module.exports = router;