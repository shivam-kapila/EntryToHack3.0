var express = require("express");
var router = express.Router();
var Team = require("../models/team");

//root route
router.get("/", function (req, res) {
  res.render('index', {
    title: "Home",
    user: "Participants"
  });
});

router.get("/test", function (req, res) {
  res.render("test");
});

router.get("/viewAllTeams", function (req, res) {
  Team.find({} , function (err, teams) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("viewAllTeams", { teams });
    }
  });
});

module.exports = router;
