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

router.get("/mentor", function (req, res) {
  res.render("mentor"); 
});

router.get("/test", function (req, res) {
  res.render("test"); 
});

//show login form 
router.get("/mentorLogin", function(req, res){
	res.render("mentorLogin");
});

//handling login logic
router.post("/mentorLogin", passport.authenticate("mentor",
    {
        successRedirect: "/test",
        failureRedirect: "/mentorLogin", 
}),function(req, res) {
    
});


router.post("/mentor", function(req, res) {
    var newMentor = new Mentor({
            name: req.body.name,
            rollNumber: req.body.rollno,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.username,
            year: req.body.year,
            skills: req.body.skills
        });
        newMentor.isVerified = false;
        console.log(req.body.password)
    Mentor.register(newMentor, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("mentor", {error: err.message});
       }
       passport.authenticate("mentor")(req, res, function(){
       	console.log("qwertyujkl");
           res.redirect("/test");
       });
   }); 
});


module.exports = router;