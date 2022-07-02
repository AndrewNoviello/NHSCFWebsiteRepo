var express = require("express");
var router = express.Router();


var performance = require('universal-perf-hooks').performance;
var School = require("../../../models/school");
var Task = require("../../../models/tasks");
var Comment = require("../../../models/comment");
var UploadedNewsletter = require("../../../models/uploadedNewsletter");
var Event = require('../../../models/event');
var Post = require('../../../models/announcement')

var ensureAuthenticated = require("../../../auth/auth").ensureAuthenticated;
var totalSchools = 0;
var totalStates = 0;

router.get("/", async function(req, res){ 
    await School.find().distinct("schoolName", function(err, count){
        totalSchools = count.length;
    });
    await School.find().distinct("state", function(err, count){
        totalStates = count.length;
    });
    
    res.render("pages/home", {totalSchools: totalSchools, totalStates: totalStates});
});

router.get("/home", async function(req, res){ 
    await School.find().distinct("schoolName", function(err, count){
        totalSchools = count.length;
    });
    await School.find().distinct("state", function(err, count){
        totalStates = count.length;
    });

    res.render("pages/home", {totalSchools: totalSchools, totalStates: totalStates});
});

router.get("/login", function(req,res){
    res.render("pages/signup_forms/login");
});

router.get("/join", function(req,res){
    res.render("pages/signup_forms/join");
});

router.get("/signup", function(req,res){
    School.find({}, function(err, school){
    if(err){
        res.status(500).send('Error', err);
    }
    else{
        res.render("pages/signup_forms/signup", {schools: school, error:false});
    }
    });
});

router.get("/logout", function(req,res){
    req.logout();
    res.redirect("/home");
});

router.get('/events', async function(req, res) {
    var t0 = performance.now();
    var items;
    if(req.user){
        items = await Event.find({active:true}, {"registered":0, "speakers":0}).lean();
    }
    else {
        items = await Event.find({ active:true, isPublic : true}, {"registered":0, "speakers":0}).lean();
    }
    items = items.reverse();
    res.render('pages/event_views/eventListRender', { items: items });
    var t1 = performance.now();
    console.log("Full Event request: " + (t1 - t0));
});

router.get("/newsletters", function(req,res){
    UploadedNewsletter.find({}, (err, items) => {
        if (err) {res.status(500).send('An error occurred', err);}
        else {
            items.reverse();
            res.render('pages/newsletter_views/newsletters', { items: items });
        }
    });
});

router.get("/dashboard", ensureAuthenticated, async function(req, res){
    
    var t0 = performance.now();
    var comments;
    comments = await Comment.find({active:true}).lean();

    var writeTasks = [];
    var planTasks = [];
    var recruitTasks = [];    
    var activeTasks;
    activeTasks = await Task.find({active:true}).lean();
    for (var i = 0; i < activeTasks.length; i++){
        if(activeTasks[i].commAssign == "rec"){
            recruitTasks.push(activeTasks[i]);
        }
        if(activeTasks[i].commAssign == "plan"){
            planTasks.push(activeTasks[i]);
        }
        if(activeTasks[i].commAssign == "write"){
            writeTasks.push(activeTasks[i]);
        }
    }

    var activeEvents;
    activeEvents = await Event.find({active:true}, {"eventDate":0,"eventDesc":0, "numEventFields":0, "speakers":0, "registered":0, "eventFields":0, "img":0}).lean();
    console.log(activeEvents);
    var t2 = performance.now();
    var activePosts;
    activePosts = await Post.find({commentable:true}).lean();

    writeTasks.reverse();
    recruitTasks.reverse();
    activePosts.reverse();
    activeTasks.reverse();
    planTasks.reverse();
    res.render('pages/dashboard_views/CMPanelToggle', { writeTasks: writeTasks, planTasks:planTasks, activeTasks:activeTasks, activePosts:activePosts, comments:comments, activeEvents:activeEvents, recruitTasks:recruitTasks});
    var t1 = performance.now();
    console.log("Full Dashboard request: " + (t1 - t0) + "Before Placement " + (t2 - t0));
        
});

module.exports = router;