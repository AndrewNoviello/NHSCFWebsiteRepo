var fs = require("fs");
var path = require("path");
var express = require("express");
var multer = require("multer");

var router = express.Router();

var express = require("express");
var router = express.Router();

var fs = require("fs");
var path = require("path");

const sustainabilityTip = require("../../../models/sustainabilityTips");
var ActivityWriting = require('../../../models/activityWritings');
var OutsideProgram  = require('../../../models/outsidePrograms');
var AdditionalArticle = require('../../../models/otherArticles');
var InterestingLink = require('../../../models/interestingLinks');
var SchoolEvent = require('../../../models/schoolEvents');

var activityWritingsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/activityWritingsUploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var susTipsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/sustainabilityTipsUploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var outsideProgramsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/outsideProgramUploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var activityWritingsUpload = multer({storage: activityWritingsStorage});

var susTipsUpload = multer({storage: susTipsStorage});

var outsideProgramsUpload = multer({storage: outsideProgramsStorage});

router.post("/submitActivityWriting", activityWritingsUpload.single('activityWritingImage'), function(req, res, next) {
    console.log(req.file);
    var activityWritingObj = {
        authorName: req.body.authorName,
        authorGradYear: req.body.authorGradYear,
        authorSchoolName: req.body.authorSchool,
        dateSubmitted: req.body.dateSubmitted,
        fullText: req.body.fullText,
        imageFileName: req.body.activityWritingImage,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/../../public/activityWritingsUploads/' + req.file.originalname)),
            contentType: 'image/png'
        },
        used: false,
        associatedNewsletter: null
    }
    ActivityWriting.create(activityWritingObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

router.post("/submitSusTip", susTipsUpload.single('susTipImage'), function(req, res, next) {
    console.log(req.file);
    var susTipObj = {
        susTipTitle: req.body.susTipTitle,
        susTipFullText: req.body.susTipFullText,
        susTipSourceURL: req.body.susTipLink,
        img:
        {
            data: fs.readFileSync(path.join(__dirname + '/../../public/sustainabilityTipsUploads/' + req.file.originalname)),
            contentType: 'image/png'
        },
        used: false,
        associatedNewsletter: null
    }
    sustainabilityTip.create(susTipObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

router.post("/submitOutsideProgram", outsideProgramsUpload.single('programImage'), function(req, res, next) {
    console.log(req.file);
    var outsideProgramObj = {
        programName: req.body.programName,
        programHost: req.body.programHost,
        programLocation: req.body.programLocation,
        programDesc: req.body.programDesc,
        programDates: req.body.programDates,
        programLink: req.body.programLink,
        img:
        {
            data: fs.readFileSync(path.join(__dirname + '/../../public/outsideProgramUploads/' + req.file.originalname)),
            contentType: 'image/png'
        },
        used: false,
        associatedNewsletter: null
    }
    OutsideProgram.create(outsideProgramObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

router.post("/submitOtherArticle", function(req, res, next){
    var additionalArticleObj = {
        authorName: req.body.authorName,
        authorGradYear: req.body.authorGradYear,
        authorSchoolName: req.body.authorSchool,
        dateSubmitted: req.body.dateSubmitted,
        articleTitle: req.body.articleTitle,
        fullText: req.body.articleFullText,
        used: false,
        associatedNewsletter: null
    }
    AdditionalArticle.create(additionalArticleObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

router.post("/submitInterestingLink", function(req, res, next){
    var interestingLinkObj = {
        linkTitle: req.body.linkTitle,
        link: req.body.linkURL,
        used: false,
        associatedNewsletter: null
    }
    InterestingLink.create(interestingLinkObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

router.post("/submitSchoolEvent", function(req, res, next){
    var schoolEventObj = {
        schoolName: req.body.schoolName,
        schoolEventDate: req.body.schooLEventDate,
        schoolEventTime: req.body.schoolEventTime,
        schoolEventTimeZone: req.body.schoolEventTimeZone,
        schoolEvent_ampm: req.body.schoolEventAmPm,
        schoolEventName: req.body.schoolEventName,
        schoolEventDesc: req.body.schoolEventDesc,
        used: false,
        associatedNewsletter: null
    }
    SchoolEvent.create(schoolEventObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/dashboard');
        }
    });
});

module.exports = router;