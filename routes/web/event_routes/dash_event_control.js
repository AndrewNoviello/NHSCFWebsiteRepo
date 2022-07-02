var express = require("express");
var multer = require("multer");


var router = express.Router();

var Event = require('../../../models/event');
var fs = require("fs");
var path = require("path");

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
var upload = multer({ storage: storage });

router.post('/eventCreate', upload.single('image'), (req, res, next) => {
    var public = false;
    var desc = req.body.eventDesc;
    desc = desc.replace(/\n/g, "<br>");
    if (req.body.isPublic == "true"){
        public = true;
    }
    console.log(req.body.eventName);
    var obj = {
        active: true,
        eventName: req.body.eventName,
        eventDate: req.body.eventDate,
        eventDesc: desc,
        numEventFields: req.body.numEventFields,
        eventFields: req.body.eventFields,
        isPublic: public,
        canRegister: true,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/../../../uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Event.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
           
            res.redirect('/events');
        }
    });
});

router.post("/delEvent", async function(req, res, next){
    let doc = await Event.findOneAndUpdate({eventName:req.body.delev}, {active:false}, {
        new: true
      });
      res.redirect("/dashboard");
});

router.post("/stopEventRegister", async function(req, res, next){
    let doc = await Event.findOneAndUpdate({eventName:req.body.stopev}, {canRegister:false}, {
        new: true
      });
      res.redirect("/dashboard");
});

module.exports = router;