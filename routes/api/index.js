var express = require("express");

var router = express.Router();

//TODO: Add in Error and Info

router.use("/users", require("./users"));

module.exports = router;