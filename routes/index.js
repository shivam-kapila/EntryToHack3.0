var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var Student = require("../models/student");
var Team = require("../models/team");
var async = require("async");
var nodemailer = require("nodemailer");
var passport = require("passport");

//root route
router.get("/", function (req, res) {
  res.render("index"); 
});
module.exports = router;