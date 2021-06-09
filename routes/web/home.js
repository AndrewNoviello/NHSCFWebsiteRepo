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
var adminEmails = require("../../params/params").adminEmails;
var GridFsStorage = require("multer-gridfs-storage")

const { doesNotMatch } = require("assert");

var firstNameG = "";
var lastNameG = "";
var schoolG = "";
var totalSchools = 0;
var totalStates = 0;
var curEvent;
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
        cb(null, file.fieldname + '-' + Date.now())
    }
});
 

var newsletterStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/NewsletterUploads')
    },
    filename: (req, file, cb) => {
        
        if (file.originalname.match(/\.(pdf)$/)){
            cb(null, req.body.newsletterMonth + req.body.newsletterYear + "Newsletter.pdf")
        }
        if(file.originalname.match(/\.(pdf|jpg|JPG|jpeg|JPEG|png|PNG)$/)){
            cb(null, req.body.newsletterMonth + req.body.newsletterYear + "CoverImage.jpg")
        }
    }
});

var upload = multer({ storage: storage });

var NewsletterUpload = multer({storage: newsletterStorage});

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

router.post('/curEvent', function(req, res, next) {
    curEvent = req.body.name;
    console.log("Current Event: ");
    console.log(curEvent);
});

router.get('/eventRegister', function(req, res) {
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

router.post('/eventRegister', async function(req, res, next) {
    var eventName = null;
    console.log(req.body)
    var currentPerson = Object.values(req.body);
    
    let reg = await Event.findOneAndUpdate(
        {eventName: eventName},
        {$push: {registered: currentPerson}},
        {upsert: true, new: true});
    res.redirect('/eventListRender');
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