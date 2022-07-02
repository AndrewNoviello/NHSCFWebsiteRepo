var express = require("express");

var router = express.Router();

router.get("/", function(req, res){
    res.json("JSON status code for users API");
});

module.exports = router;