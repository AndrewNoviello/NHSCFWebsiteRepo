var express = require("express");
var router = express.Router();
var passport = require("passport");
var performance = require('universal-perf-hooks').performance;
var json2csv = require('json2csv');
var User = require("../../models/user");
var Speaker = require("../../models/speaker");
const sustainabilityTip = require("../../models/sustainabilityTips");
const download = require('download');
var School = require("../../models/school");
var delay = require("delay");
var FileSaver = require('file-saver');
var eventEmail = require("../../params/params").eventRegisterEmailTemplate;
var baseURL = require("../../params/params").baseURL;
var Task = require("../../models/tasks");
var Comment = require("../../models/comment");
var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
var nodemailer = require("nodemailer");
var Newsletter = require("../../models/newsletter");
var UploadedNewsletter = require("../../models/uploadedNewsletter");
var multer = require("multer");
var Event = require('../../models/event');
var Post = require('../../models/announcement')
var fs = require("fs");
var pdf = require("html-pdf");
var fs = require("fs");
var path = require("path");
var ejs = require("ejs");
var delay = require("delay");
const { root } = require("npm");
var recruitEmail = require("../../params/params").recruitmentEmailTemplate;
var privateKey = require("../../params/params").privateKey;
const { doesNotMatch } = require("assert");
var Newsletter = require("../../models/newsletter");

var totalSchools = 0;
var totalStates = 0;



//Dashboard Misc

module.exports = router;