var express = require("express");

var router = express.Router();

//TODO: Add in Error and Info
router.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});
//router.use("/", require("./old_routes"));

router.use("/", require("./event_routes/user_event_routes"));
router.use("/", require("./event_routes/dash_event_control"));
router.use("/", require("./event_routes/ind_event_control"));

router.use("/", require("./dashboard_routes/announcement_routes"));
router.use("/", require("./dashboard_routes/misc_routes"));
router.use("/", require("./dashboard_routes/item_submissions"));
router.use("/", require("./dashboard_routes/recruitment_tools"));

router.use("/", require("./main_routes/form_submissions"));
router.use("/", require("./main_routes/nav_get_routes"));
router.use("/", require("./main_routes/forget_pswd"));

module.exports = router;