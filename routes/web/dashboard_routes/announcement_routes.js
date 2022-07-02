var express = require("express");
var multer = require("multer");

var router = express.Router();

var User = require("../../../models/user");
var baseURL = require("../../../params/params").baseURL;
var nodemailer = require("nodemailer");
var Post = require('../../../models/announcement');


var postAttachmentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/postAttachments');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

var postAttachmentUpload = multer({storage: postAttachmentStorage});

router.post("/addPost", postAttachmentUpload.single('fileAttachment'), async function(req, res, next){
    var fullBody = req.body;
    var fullFile = req.file;
    var title = req.body.title;
    var content = req.body.content;
    
    content = content.replace(/\n/g, "<br>");
    console.log(req.body.content);
    var userList = await User.find({}, (err, userList) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            console.log("in userList else");
        }
    });
    var recEmailAddress = "";
    userList.forEach(function(user) {
        recEmailAddress = recEmailAddress + "," + user.prefEmail;
    });
    console.log(recEmailAddress);
    var newPost = new Post({
        title:title,
        content:content,
        commentable:true
    });
    newPost.save(next);
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'nhsclimateforum@gmail.com',
            pass: 'abnoviello23'
            }
    });
    console.log("Full Body");
    console.log(fullBody);
    console.log("Full File");
    console.log(fullFile);
    if(fullFile){
        console.log("Entered property If");
        console.log(fullFile.filename);
    var mailOptions = {
        from: 'The National High School Climate Forum <nhsclimateforum@gmail.com>',
        to: "abnoviello23@lawrenceville.org",
        bcc: recEmailAddress,
        subject: title,
        html: content + "<br><br> Please view on our website at: <br>" + baseURL + "/dashboard",
        attachments: [
            {
                filename: fullFile.filename,
                path: __dirname + '/../../public/postAttachments/' + fullFile.filename,
            }
        ]
    };
    console.log("Exited file attachment if - build okay");
    }
    else{
        var mailOptions = {
            from: 'The National High School Climate Forum <nhsclimateforum@gmail.com>',
            to: "abnoviello23@lawrenceville.org",
            bcc: recEmailAddress,
            subject: title,
            html: content + "<br><br> Please view on our website at: <br>" + baseURL + "/dashboard"
        };
    }
  if(req.user.admin == true){
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}
    res.redirect("/dashboard");
});

router.post("/deletePost", async function(req, res, next){
    var title = req.body.delposts;
    let doc = await Post.findOneAndUpdate({title:title}, {commentable:false}, {
        new: true
      });
    res.redirect("/dashboard");
});

module.exports = router;