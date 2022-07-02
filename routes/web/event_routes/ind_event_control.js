var express = require("express");
var router = express.Router();

var json2csv = require('json2csv');
var User = require("../../../models/user");
var baseURL = require("../../../params/params").baseURL;
var nodemailer = require("nodemailer");
var Event = require('../../../models/event');

router.get("/adminEvents", async function(req, res){
    var eventSelected = req.query.adminSelectedEventName;
    var items = await Event.find({eventName: eventSelected}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            console.log("Providing event Information");
            console.log(items[0].eventFields);
            var ev = items[0];
            var numAttending = ev.registered.length;
            res.render('pages/event_views/adminEvents', {eventInfo:  ev, attending: numAttending});
        }
    });
    
});

router.get("/sendSignedUpEventReminder", async function(req, res){
    var link = baseURL + "/events";
    var nameInd = 0, schoolInd = 1, emailInd = 2;
    var event = await Event.findOne({eventName:req.query.reminderEventName}, function(err, event){
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            console.log("In Here");
        }
    });
    var emails = "";
    for(var i = 0; i < event.registered.length; i++){
        emails = emails + event.registered[i][emailInd] + ",";
    }
    console.log(emails);
    var redirectLink = baseURL + "/adminEvents?adminSelectedEventName=" + req.query.reminderEventName;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'abnoviello23'
            }
    });
  
    var mailOptions = {
        from: 'The National High School Climate Forum <nhsclimateforum@gmail.com>',
        to:'nhsclimateforum@gmail.com',
        bcc: emails,
        subject: "NHSCF Event Reminder: " + req.query.reminderEventName,
        html: "Dear Event Registrant,<br>This is a reminder that you signed up for the following National High School Climate Forum Event:<br>"+req.query.reminderEventName+"<br><br>Please view this link for more information: "+link+"<br><br>Thanks,<br>The National High School Climate Forum"
    };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });   
    res.redirect(redirectLink);
});

router.get("/sendNotSignedUpEventReminder", async function(req, res){
    var link = baseURL + "/events";
    var nameInd = 0, schoolInd = 1, emailInd = 2;
    var event = await Event.findOne({eventName:req.query.reminderEventName}, function(err, event){
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            console.log("In Here");
        }
    });
    var regEmails = [];
    var emails = "";
    for(var i = 0; i < event.registered.length; i++){
        regEmails.push(event.registered[i][emailInd]);
    }
    await User.find().then(users => {
        users.forEach(function(user){
            if(!regEmails.includes(user.prefEmail)){
                emails = emails + user.prefEmail + ",";
            }
        });
    })

    console.log(emails);
    var redirectLink = baseURL + "/adminEvents?adminSelectedEventName=" + req.query.reminderEventName;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'abnoviello23'
            }
    });
  
    var mailOptions = {
        from: 'The National High School Climate Forum <nhsclimateforum@gmail.com>',
        to:'nhsclimateforum@gmail.com',
        bcc: emails,
        subject: "Reminder to Register for Upcoming NHSCF Event",
        html:  "Dear Committee Member,<br>This is a reminder that you have not yet signed up for the following National High School Climate Forum Event:<br>"+req.query.reminderEventName+"<br><br>If you are unable to attend, please let us know. Please view this link for more information: "+link+"<br><br>Thanks,<br>The National High School Climate Forum"
    };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });    
    res.redirect(redirectLink);
});

router.get("/downloadEventEmails", async function(req, res, next){
    var myEmails = [];
    let docs = await Event.findOne({eventName: req.query.chosenEventName}).lean();
    //console.log(docs);
    for(var ct = 0; ct < docs.registered.length; ct++){
      myEmails.push({
        "Emails": docs.registered[ct][2],
      });
    }
    //console.log(myCars);
      var csv = json2csv.parse(myEmails);
      res.setHeader('Content-disposition', 'attachment; filename=eventData.csv');
      res.set('Content-Type', 'text/csv');
      res.status(200).send(csv);
    
      res.redirect("/events");
});

module.exports = router;