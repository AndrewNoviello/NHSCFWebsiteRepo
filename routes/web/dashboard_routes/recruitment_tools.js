var express = require("express");
var multer = require("multer");

var router = express.Router();

var express = require("express");
var router = express.Router();
var School = require("../../../models/school");
var delay = require("delay");
var nodemailer = require("nodemailer");
var fs = require("fs");
var recruitEmail = require("../../../params/params").recruitmentEmailTemplate;

var csvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/CSVFileUploads');
    },
    filename: (req, file, cb) => {
        
        if (file.originalname.match(/\.(csv)$/)){
            curCSVFileName = file.originalname;
            cb(null, file.originalname);
        }
        
    }
});

var csvUpload = multer({storage: csvStorage});

router.post("/csvUpload", csvUpload.single("csvFile"), async function(req,res,next){
    if(curCSVFileName){
        var data = fs.readFileSync("public/CSVFileUploads/" + curCSVFileName, "utf8");
        data = data.split("\r\n");
        var firstRow = data[0];
        var arrFirstRow = firstRow.split(',');
        var finalData = new Array(arrFirstRow.length);
        data.shift();
        var ct;
        for(ct = 0; ct < data.length; ct++){
            data[ct] = data[ct].split(',');
        }
        for(ct = 0; ct < data.length; ct++){
            await delay(5000);
            //Email, Full Name, School Name, Position
            var email = data[ct][0];
            var name = data[ct][1];
            var school = data[ct][2];
            var pos = data[ct][3];
            await School.find().distinct("schoolName", function(err, count){
                totalSchools = count.length;
            });
            await School.find().distinct("state", function(err, count){
                totalStates = count.length;
            });
            var emailMessage = recruitEmail;
            var emailSubject = "Student Club Opportunity: The National High School Climate Forum";
            emailMessage = emailMessage.replace(/contactschool/g, school);
            emailMessage = emailMessage.replace(/contactname/g, name);
            emailMessage = emailMessage.replace(/contactpos/g, pos);
            emailMessage = emailMessage.replace(/cmmname/g, req.user.fname + " " + req.user.lname);
            emailMessage = emailMessage.replace(/cmmschool/g, req.user.schoolName);
            emailMessage = emailMessage.replace(/schoolnum/g, totalSchools);
            emailMessage = emailMessage.replace(/statenum/g, totalStates);
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'nhsclimateforum@gmail.com',
                    pass: 'abnoviello23'
                    }
            });
          
            var mailOptions = {
                from:  req.user.fname + " " + req.user.lname + '<nhsclimateforum@gmail.com>',
                to: email,
                cc:[req.user.prefEmail, "acnoviello23@lawrenceville.org", "elise.picard@indiansprings.org", "isabelle.miller22@trinityschoolnyc.org"],
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
        
        }
    }
    curCSVFileName = null;
    res.redirect("/dashboard");
});

router.post("/emailForm", async function(req, res, next){
    console.log(req.user);
    await School.find().distinct("schoolName", function(err, count){
        totalSchools = count.length;
    });
    await School.find().distinct("state", function(err, count){
        totalStates = count.length;
    });
    var recEmailAddress = req.body.emailAddr;
    var emailMessage = recruitEmail;
    var schoolName = req.body.schoolName;
    var recipient = req.body.recipient;
    var recPosition = req.body.position;
    console.log(totalSchools);
    console.log(totalStates);
    var emailSubject = "Test Email From NHSCF Website Development (please disregard)";//"Student Club Opportunity: The National High School Climate Forum";
    emailMessage = emailMessage.replace(/contactschool/g, schoolName);
    emailMessage = emailMessage.replace(/contactname/g, recipient);
    emailMessage = emailMessage.replace(/contactpos/g, recPosition);
    emailMessage = emailMessage.replace(/cmmname/g, req.user.fname + " " + req.user.lname);
    emailMessage = emailMessage.replace(/cmmschool/g, req.user.schoolName);
    emailMessage = emailMessage.replace(/schoolnum/g, totalSchools);
    emailMessage = emailMessage.replace(/statenum/g, totalStates);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'abnoviello23'
            }
    });
    console.log("Checking console - preparing to send email");
    
    var mailOptions = {
        from:  req.user.fname + " " + req.user.lname + '<nhsclimateforum@gmail.com>',
        to: recEmailAddress,
        cc:[req.user.prefEmail, "acnoviello23@lawrenceville.org", "elise.picard@indiansprings.org", "isabelle.miller22@trinityschoolnyc.org"],
        subject: emailSubject,
        text: emailMessage
    };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      throw error;
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.redirect("/dashboard");
});

module.exports = router;