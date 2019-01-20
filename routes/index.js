var express = require("express");
var router = express.Router();

//root route
router.get("/", function (req, res) {
res.render('index', {
        title: "Home", 
        user: "Participants"
    });});

router.get("/test", function (req, res) {
  res.render("test"); 
});

module.exports = router;
