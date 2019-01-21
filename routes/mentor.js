var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var MentorChallenge = require("../models/mentorChallenge");
var async = require("async");
var nodemailer = require("nodemailer");
var passport = require("passport");

router.get("/", function (req, res) {
  res.render("mentor"); 
});

//show login form 
router.get("/login", function(req, res){
	res.render("mentorLogin");
});

router.get("/challenge", function(req, res){
	res.render("mentorChallenge");
});


//handling login logic
router.post("/login", passport.authenticate("mentor",
    {
        successRedirect: "/mentor/challenge",
        failureRedirect: "/mentor/login", 
}),function(req, res) {
    
});


router.post("/", function(req, res) {
    var newMentor = new Mentor({
            name: req.body.name,
            rollNumber: req.body.rollno,
            email: req.body.email,
            phone: req.body.phone,
            username: req.body.username,
            area: req.body.area,
            year: req.body.year,
            skills: req.body.skills
        });
    console.log(req.body.skills)
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

