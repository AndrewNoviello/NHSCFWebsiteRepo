var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../../models/user");
var School = require("../../models/school");
var Task = require("../../models/tasks");
var Comment = require("../../models/comment");
var Newsletter = require("../../models/newsletter");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var nodemailer = require("nodemailer");
var multer = require("multer");
var Event = require('../../models/event');
var Post = require('../../models/announcement')
var fs = require("fs");
var path = require("path");
const { root } = require("npm");
var recruitEmail = require("../../params/params").recruitmentEmailTemplate;
var eventEmail = require("../../params/params").eventRegisterEmailTemplate;
var adminEmails = require("../../params/params").adminEmails;
var GridFsStorage = require("multer-gridfs-storage")
var ActivityWriting = require('../../models/activityWritings');
var OutsideProgram  = require('../../models/outsidePrograms');
var AdditionalArticle = require('../../models/otherArticles');
var InterestingLink = require('../../models/interestingLinks');
var SchoolEvent = require('../../models/schoolEvents');

const { doesNotMatch } = require("assert");
const { pathToFileURL } = require("url");
const sustainabilityTip = require("../../models/sustainabilityTips");


var firstNameG = "";
var lastNameG = "";
var schoolG = "";
var totalSchools = 0;
var totalStates = 0;
var curCSVFileName;
   /*await School.find().distinct("schoolName", function(err, count){
        totalSchools = count.length;
    });
    await School.find().distinct("state", function(err, count){
        totalStates = count.length;
    });
    console.log(totalSchools);
    console.log(totalStates);*/

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});
 
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


var upload = multer({ storage: storage });

var NewsletterUpload = multer({storage: newsletterStorage});

var csvUpload = multer({storage: csvStorage});

var activityWritingsUpload = multer({storage: activityWritingsStorage});

var susTipsUpload = multer({storage: susTipsStorage});

var outsideProgramsUpload = multer({storage: outsideProgramsStorage});

router.get("/", function(req, res){ 
    res.render("home/home");
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

router.get("/join", function(req,res){
    res.render("home/join");
});

router.get("/csvUpload", function(req, res){
    res.render("home/csvUpload");
});

router.get("/newsletterBuilder", function(req, res){
    res.render("home/newsletterBuilder");
});

router.get("/createNewsletter1", function(req, res){
    res.render("home/createNewsletter1");
});

router.post("/submitActivityWriting", activityWritingsUpload.single('activityWritingImage'), function(req, res, next) {
    var rootPath = 'C:/Users/alex8/Desktop/ClimateActionClubFolder/AndrewNewBranch';
    console.log(req.file);
    var activityWritingObj = {
        authorName: req.body.authorName,
        authorGradYear: req.body.authorGradYear,
        authorSchoolNamea: req.body.authorSchool,
        dateSubmitted: req.body.dateSubmitted,
        fullText: req.body.fullText,
        imageFileName: req.body.activityWritingImage,
        img: {
            data: fs.readFileSync(path.join(rootPath + '/public/activityWritingsUploads/' + req.file.originalname)),
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
            res.redirect('/home');
        }
    });
});

router.post("/submitSusTip", susTipsUpload.single('susTipImage'), function(req, res, next) {
    var rootPath = 'C:/Users/alex8/Desktop/ClimateActionClubFolder/AndrewNewBranch';
    console.log(req.file)
    var susTipObj = {
        susTipTitle: req.body.susTipTitle,
        susTipAuthorName: req.body.authorName,
        susTipAuthorSchool: req.body.authorSchool,
        susTipAuthorGradYear: req.body.authorGradYear,
        susTipFullText: req.body.susTipFullText,
        susTipSourceURL: req.body.susTipLink,
        img:
        {
            data: fs.readFileSync(path.join(rootPath + '/public/sustainabilityTipsUploads/' + req.file.originalname)),
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
            res.redirect('/home');
        }
    });
});

router.post("/submitOutsideProgram", outsideProgramsUpload.single('programImage'), function(req, res, next) {
    var rootPath = 'C:/Users/alex8/Desktop/ClimateActionClubFolder/AndrewNewBranch';
    console.log(req.file);
    var outsideProgramObj = {
        programName: req.body.programName,
        programHost: req.body.programHost,
        programLocation: req.body.programLocation,
        programDesc: req.body.programDesc,
        programDates: req.body.programDates,
        programLink: req.body.programLink,
        finderName: req.body.finderName,
        finderSchool: req.body.finderSchool,
        finderGradYear: req.body.finderGradYear,
        img:
        {
            data: fs.readFileSync(path.join(rootPath + '/public/outsideProgramUploads/' + req.file.originalname)),
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
            res.redirect('/home');
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
            res.redirect('/home');
        }
    });
});

router.post("/submitInterestingLink", function(req, res, next){
    var interestingLinkObj = {
        linkFinder: req.body.linkFinder,
        linkFinderSchool: req.body.linkFinderSchool,
        linkTitle: req.body.linkTitle,
        linkDesc: req.body.linkDesc,
        link: req.body.linkURL,
        used: false,
        associatedNewsletter: null
    }
    InterestingLink.create(interestingLinkObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/home');
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
            res.redirect('/home');
        }
    });
});

router.post("/createNewsletter1", function(req, res){
    var newsletterBasicObj = {
        newsletterMonth: req.body.newsletterMonth,
        newsletterYear: req.body.newsletterYear,
        releaseDate: req.body.releaseDate,
        newsletterQuote: req.body.newsletterQuote,
        newsletterQuoteAuthor: req.body.newsletterQuoteAuthor,
        newsletterAnnouncements: req.body.announcements,
        newsletterMessage: req.body.message,
        activityWritings: [],
        susTips: [],
        otherArticles: [],
        outsidePrograms: [],
        interestingLinks: [],
        schoolEvents: []
    }
    console.log(newsletterBasicObj);
    Newsletter.create(newsletterBasicObj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            var queryString = 'month='+req.body.newsletterMonth + '&year=' + req.body.newsletterYear;
            res.redirect("/createNewsletter2?" + queryString);
        }
    });
});

router.get("/createNewsletter2", async function(req,res){
    activityWritings = [];
    outsidePrograms = [];
    interestingLinks = [];
    susTips = [];
    otherArticles = [];
    schoolEvents = [];
    var curMonth = req.query.month;
    var curYear = req.query.year;

    await ActivityWriting.find({used: false}, (err, items) => {
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            activityWritings = items;
        }
    });

    await OutsideProgram.find({used: false}, (err, items) => {
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            outsidePrograms = items;
        }
    });

    await InterestingLink.find({used: false}, (err, items) => {
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            interestingLinks = items;
        }
    });

    await sustainabilityTip.find({used: false}, (err, items) => {
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            susTips = items;
        }
    });

    await SchoolEvent.find({used: false}, (err, items) => {
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            schoolEvents = items;
        }
    });

    await AdditionalArticle.find({used: false}, (err, items) => {
        if(err){
            res.status(500).send('Error', err);
        }
        else{
            otherArticles = items;
        }
    });
    console.log(activityWritings);
    res.render("home/createNewsletter2", {month: curMonth, year: curYear, activityWritings: activityWritings, outsidePrograms: outsidePrograms,
    interestingLinks: interestingLinks, susTips: susTips, otherArticles: otherArticles, schoolEvents: schoolEvents});
});

router.post("/createNewsletter2", async function(req, res, next){
    console.log("Entered create Newsletter 2 POST");

    var activityWriting_element = req.body.activityWriting_element;
    var susTip_element = req.body.susTip_element;
    var outsideProgram_element = req.body.outsideProgram_element;
    var otherArticles_element = req.body.otherArticles_element;
    var interestingLinks_element = req.body.interestingLinks_element;
    var schoolEvents_element = req.body.schoolEvents_element;

    if(!Array.isArray(req.body.activityWriting_element)){
        var activityWriting_element = [req.body.activityWriting_element];
    }
    if(!Array.isArray(req.body.susTip_element)){
        var susTip_element = [req.body.susTip_element];
    }
    if(!Array.isArray(req.body.outsideProgram_element)){
        var outsideProgram_element = [req.body.outsideProgram_element];
    }
    if(!Array.isArray(req.body.otherArticles_element)){
       var otherArticles_element = [req.body.otherArticles_element];
    }
    if(!Array.isArray(req.body.interestingLinks_element)){
        var interestingLinks_element = [req.body.interestingLinks_element];
    }
    if(!Array.isArray(req.body.schoolEvents_element)){
        var schoolEvents_element = [req.body.schoolEvents_element];
    }
    console.log("Finished Checking for Arrays");
    console.log(activityWriting_element);
    let update = await Newsletter.findOneAndUpdate(
        {newsletterMonth: req.body.month, newsletterYear: req.body.year},
        {$push: {activityWritings: activityWriting_element, susTips: susTip_element, outsidePrograms: outsideProgram_element, otherArticles: otherArticles_element, interestingLinks: interestingLinks_element, schoolEvents: schoolEvents_element}},
        {upsert: true, new: true});

    var queryString = '?month='+ req.body.month + '&year=' + req.body.year;
            
    res.redirect('/createNewsletter3' + queryString);
});

router.get("/createNewsletter3", async function(req, res){
    var month =  req.query.month;
    var year = req.query.year;
    activityWritingsIds = [];
    outsideProgramsIds = [];
    interestingLinksIds = [];
    susTipsIds = [];
    otherArticlesIds = [];
    schoolEventsIds = [];

    await Newsletter.find({newsletterMonth: month, newsletterYear: year}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            activityWritingsIds = items[0].activityWritings;
            susTipsIds = items[0].susTips;
            otherArticlesIds = items[0].otherArticles;
            outsideProgramsIds = items[0].outsidePrograms;
            interestingLinksIds = items[0].interestingLinks;
            schoolEventsIds = items[0].schoolEvents;
        }
    });
    
    //Activity Writings Code
    var activityWritings = [];
    for(let i = 0; i < activityWritingsIds.length; i++){
        if(activityWritingsIds[i] != "NoneClicked"){
        await ActivityWriting.find({_id: activityWritingsIds[i], used: false}, (err, items) => {
            if(err){
                res.status(500).send('Error', err);
            }
            else{
                if(activityWritings.indexOf(items[0]) == -1){
                    activityWritings.push(items[0]);
                }
            }
        });
        }
        else{
            activityWritings.push("None");
        }
    }

    //Sus Tips Code
    var susTips = [];
    for(let i = 0; i < susTipsIds.length; i++){
        if(susTipsIds[i] != "NoneClicked"){
        await sustainabilityTip.find({_id: susTipsIds[i], used: false}, (err, items) => {
            if(err){
                res.status(500).send('Error', err);
            }
            else{
                if(susTips.indexOf(items[0]) == -1){
                    susTips.push(items[0]);
                }
            }
        });
    }
    else{
        susTips.push("None");
    }
    }
    //Other Articles Code
    var otherArticles = [];
    for(let i = 0; i < otherArticlesIds.length; i++){
        console.log("Into Other Articles");
        if(otherArticlesIds[i] != "NoneClicked"){
            await AdditionalArticle.find({_id: otherArticlesIds[i], used: false}, (err, items) => {
                if(err){
                    res.status(500).send('Error', err);
                }
                else{
                    if(otherArticles.indexOf(items[0]) == -1){
                        otherArticles.push(items[0]);
                    }
                }
            });
        }
        else{
            otherArticles.push("None");
        }
    }

    //Interesting Links Code
    var interestingLinks = [];
    for(let i = 0; i < interestingLinksIds.length; i++){
        if(interestingLinksIds[i] != "NoneClicked"){
        await InterestingLink.find({_id: interestingLinksIds[i], used: false}, (err, items) => {
            if(err){
                res.status(500).send('Error', err);
            }
            else{
                if(interestingLinks.indexOf(items[0]) == -1){
                    interestingLinks.push(items[0]);
                }
            }
        });
        }
        else{
            interestingLinks.push("None");
        }
    }

    //Outside Programs Code
    var outsidePrograms = [];
    for(let i = 0; i < outsideProgramsIds.length; i++){
        if(outsideProgramsIds[i] != "NoneClicked"){
        await OutsideProgram.find({_id: outsideProgramsIds[i], used: false}, (err, items) => {
            if(err){
                res.status(500).send(err);
            }
            else{
                if(outsidePrograms.indexOf(items[0]) == -1){
                    outsidePrograms.push(items[0]);
                }
            }
        });
        }
        else{
            outsidePrograms.push("None");
        }
    }

    //School Events Code
    var schoolEvents = [];
    for(let i = 0; i < schoolEventsIds.length; i++){
        if(schoolEventsIds[i] != "NoneClicked"){
        await SchoolEvent.find({_id: schoolEventsIds[i], used: false}, (err, items) => {
            if(err){
                res.status(500).send('Error', err);
            }
            else{
                if(schoolEvents.indexOf(items[0]) == -1){
                    schoolEvents.push(items[0]);
                }
            }
        });
        }
        else{
            schoolEvents.push("None");
        }
    }
    console.log("Finalized Arrays: ");
    console.log(activityWritings);
    console.log(interestingLinks);
    console.log(outsidePrograms);
    console.log(otherArticles);
    console.log(schoolEvents);
    console.log(susTips);
    res.render("home/createNewsletter3");

});

router.post("/editActivityWriting", function(req, res, next){
    console.log("Entered edit POST Request");
});

router.post("/editSusTip", function(req, res, next){
    console.log("Entered edit POST Request");
});

router.post("/editOtherArticle", function(req, res, next){
    console.log("Entered edit POST Request");
});

router.post("/editOutsideProgram", function(req, res, next){
    console.log("Entered edit POST Request");
});

router.post("/editInterestingLink", function(req, res, next){
    console.log("Entered edit POST Request");
});

router.post("/editSchoolEvent", function(req, res, next){
    console.log("Entered edit POST Request");
});

router.post("/csvUpload", csvUpload.single("csvFile"), function(req,res,next){
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
            //writeEmails here...
        }
    }
    curCSVFileName = null;
    res.redirect("/csvUpload");
});

router.get("/newsletters", function(req,res){
    
    Newsletter.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            console.log("Newsletters Load");
            items.reverse();
            res.render('home/newsletters', { items: items });
        }
    });
});

router.get("/uploadNewsletter", function(req,res){
    res.render("home/uploadNewsletter");
});

router.post("/join", function(req,res,next){
    var schoolName = req.body.newSchoolName;
    var newClub = req.body.newSchoolClubName;
    var state = req.body.newSchoolState;
    var facName = req.body.newSchoolFacAdvName;
    var facEmail = req.body.newSchoolFacAdvEmail;
    var socialMedia = req.body.newSchoolClubSM;
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
        res.redirect("/home");
    });
});

router.get("/logout", function(req,res){
    firstNameG = "";
    lastNameG = "";
    schoolG = "";
    req.logout();
    res.redirect("/home");
});

router.get("/dashboard", ensureAuthenticated, async function(req, res){
    var writeTasks;
    await Task.find({active: true, commAssign:"write"}, (err, items) => {
        if (err) {
            writeTasks = [];
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            //console.log("Private Events");
            writeTasks = items;
        }
    });

    var comments;
    await Comment.find({active: true}, (err, comment) => {
        if (err) {
            comments = [];
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            //console.log("Private Events");
            comments = comment;
        }
    });

    var planTasks;
    await Task.find({active: true, commAssign:"plan"}, (err, items) => {
        if (err) {
            planTasks = [];
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            planTasks = items;
        }
    });
    var recruitTasks;
    await Task.find({active: true, commAssign:"rec"}, (err, items) => {
        if (err) {
            planTasks = [];
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            recruitTasks = items;
        }
    });
    var activeTasks;
    await Task.find({active:true}, (err, task) => {
        if(err){
            activeTasks = [];
            res.status(500).send('Error', err);
        }
        else{
            activeTasks = task;
            //res.render("home/createTask", {activeTasks: task});
        }
        });

    var activePosts;
    var activePosts = await Post.find({commentable:true}, (err, post) => {
            if(err){
                activePosts = [];
                res.status(500).send('Error', err);
            }
            else{
                console.log("In Here");//activePosts = post;
            }
            });
           console.log(activePosts);
           //console.log(comments);
        var items = await Event.find({}, (err, items) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {
                console.log("In Here 2");
            }
        });
    res.render('home/CMPanelToggle', { writeTasks: writeTasks, planTasks:planTasks, activeTasks:activeTasks, activePosts:activePosts, comments:comments, items:items, recruitTasks:recruitTasks});
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
        schoolG = user.school;
        firstNameG = user.fname;
        lastNameG = user.lname;
        console.log("About to Check Passport");
        next();
    });
}, passport.authenticate("login", {
    successRedirect:"/dashboard",
    failureRedirect:"/login",
    failureFlash:true
}));

router.get("/signup", function(req,res){
    School.find({}, function(err, school){
    if(err){
        res.status(500).send('Error', err);
    }
    else{
        res.render("home/signup", {schools: school});
    }
    });
});

router.get("/createTask", function(req, res){
    Task.find({active:true}, function(err, task){
    if(err){
        res.status(500).send('Error', err);
    }
    else{
        res.render("home/createTask", {activeTasks: task});
    }
    });
});

router.post("/deleteTask", async function(req, res, next){
    var title = req.body.deltasks;
    let doc = await Task.findOneAndUpdate({title:title}, {active:false}, {
        new: true
      });

    res.redirect("/dashboard");
});

router.post("/createTask", function(req,res, next){
    console.log("In post Request");
    var title = req.body.title;
    var description = req.body.description;
    var committee = req.body.commAssign;
    var due = req.body.dueDate;
    
    if(title == "" || description == "" || committee == "" || due == ""){
        //console.log("In Error");
        req.flash("error", "Please Complete Form");
        res.redirect("/dashboard");
    }
    else{
        //console.log("In Main Else");
        var newTask = new Task({
            title:title,
            description:description,
            commAssign:committee,
            dueDate:due,
            active:true
        });
    newTask.save(next);
    res.redirect("/dashboard");
    }
});

router.post("/addPost", async function(req, res, next){
    var title = req.body.title;
    var content = req.body.content;

    var newPost = new Post({
        title:title,
        content:content,
        commentable:true
    });
    newPost.save(next);
    res.redirect("/dashboard");
});
//Still Working On This
router.post("/addComment", async function(req, res, next){
    var compost = req.body.compost;
    var content = req.body.commCon;
    var comtitle = req.body.commTitle;
    var newComment = new Comment({
        user:firstNameG+" " + lastNameG,
        title:comtitle,
        content:content,
        announcement:compost,
        active:true
    });
    newComment.save(next);
    res.redirect("/dashboard");
});

router.post("/deletePost", async function(req, res, next){
    var title = req.body.delposts;
    console.log(title);
    let doc = await Post.findOneAndUpdate({title:title}, {commentable:false}, {
        new: true
      });
    res.redirect("/dashboard");
});

router.post("/deleteComment", async function(req, res, next){
    var title = req.body.delcomms;
    console.log(title);
    let doc = await Comment.findOneAndUpdate({title:title}, {active:false}, {
        new: true
      });
    res.redirect("/dashboard");
});

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
    schoolG = school;
    firstNameG = fname;
    lastNameG = lname;
    console.log(school);
    User.findOne({prefEmail:email}, function(err, user){
        if(err){
            console.log("In Error");
            return next(err);
        }
        if(user){
            req.flash("error", "Account With This Email Already Exists");
            return res.redirect("./signup");
        }
        //console.log("Created New User");
        if(fname == null || lname == null || email == null || grade == null || school == null){
            req.flash("error", "Please Complete The Form");
            return res.redirect("./signup");
        }
        var newUser = new User({
            fname:fname,
            lname:lname,
            grade:grade,
            prefEmail:email,
            prefPhoneNum: phone,
            password:password,
            schoolName:school,
            admin:adminStatus
        });
        newUser.save(next);
        console.log("About to Check Passport");
    });
}, passport.authenticate("login", {
    successRedirect:"/dashboard",
    failureRedirect:"/signup",
    failureFlash:true
}));

router.get("/emailForm", function(req,res){
    res.render("home/emailForm");
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
    if(req.user){
    Event.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            console.log("Private Events");
            res.render('home/eventListRender', { items: items });
        }
    });
    }
    else {
        Event.find({ isPublic : "Yes"}, (err, items) => {
            if (err) {
                console.log(err);
                res.status(500).send('An error occurred', err);
            }
            else {
                console.log("Public Events");
                res.render('home/eventListRender', { items: items });
            }
        });
    }
});

router.get('/eventRegister', function(req, res) {
    var curEvent = req.query.chosenEventName;
    Event.find({"eventName": curEvent, "isOpen" : "Yes"}, (err, items) => {
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

router.post("/eventRegister", async function(req, res, next) {
    var bodyReq = req.body;
    var eventName = req.body.curEventName;
    var eventDateTime = req.body.curEventDate;
    delete bodyReq["curEventName"];
    delete bodyReq["curEventDate"];
    var currentPerson = Object.values(bodyReq);
    let reg = await Event.findOneAndUpdate(
        {eventName: eventName},
        {$push: {registered: [currentPerson]}},
        {upsert: true, new: true});

    var curEventEmail = eventEmail;
    var personName = req.body.attendeeName;
    var schoolName = req.body.attendeeSchool;
    var personEmail = req.body.attendeeEmail;
    curEventEmail = curEventEmail.replace(/ATTENDEE/g, personName);
    curEventEmail = curEventEmail.replace(/EVENTNAME/g, eventName);
    curEventEmail = curEventEmail.replace(/EVENTDATE/g, eventDateTime);
    curEventEmail = curEventEmail.replace(/SCHOOLNAME/g, schoolName);
    var emailMessage = curEventEmail;
    var emailSubject = "Thank you for Registering for " + eventName;
    
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'Noviello88$'
            }
    });
  
    var mailOptions = {
        from: 'nhsclimateforum@gmail.com',
        to: personEmail,
        subject: emailSubject,
        html: emailMessage
    };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
    
    res.redirect('/eventListRender');
});

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
            res.render('home/adminEvents', {eventInfo:  ev, attending: numAttending});
        }
    });
    
});

router.post('/eventCreate', upload.single('image'), (req, res, next) => {
    var rootPath = 'C:/Users/alex8/Desktop/ClimateActionClubFolder/AndrewNewBranch';
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

router.post("/uploadNewsletter", NewsletterUpload.fields([{name: 'newsletter', maxCount: 1}, {name: 'image', maxCount: 1}]), (req, res, next) => {
    var rootPath = 'C:/Users/alex8/Desktop/ClimateActionClubFolder/AndrewNewBranch';
    console.log(req.body);

    var obj = {
        newsletterMonth: req.body.newsletterMonth,
        newsletterYear: req.body.newsletterYear,
        releaseDate: req.body.releaseDate,
        newsletterPDFFileName: req.body.newsletterMonth + req.body.newsletterYear + "Newsletter.pdf",
        newsletterImgFileName: req.body.newsletterMonth + req.body.newsletterYear + "CoverImage.jpg"
    }

    Newsletter.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/newsletters');
        }
    });
});
router.post("/emailForm", async function(req, res, next){
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
    var emailSubject = "Student Club Opportunity: The National High School CLimate Forum";
    emailMessage = emailMessage.replace(/contactschool/g, schoolName);
    emailMessage = emailMessage.replace(/contactname/g, recipient);
    emailMessage = emailMessage.replace(/contactpos/g, recPosition);
    emailMessage = emailMessage.replace(/cmmname/g, firstNameG + lastNameG);
    emailMessage = emailMessage.replace(/cmmschool/g, schoolG);
    emailMessage = emailMessage.replace(/schoolnum/g, totalSchools);
    emailMessage = emailMessage.replace(/statenum/g, totalStates);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'Noviello88$'
            }
    });
  
    var mailOptions = {
        from: 'nhsclimateforum@gmail.com',
        to: recEmailAddress,
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

  res.redirect("/dashboard");
});

module.exports = router;