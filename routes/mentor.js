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

router.post("/challenge", function(req, res){
	console.log(req.body.challenge)
	MentorChallenge.create(req.body.challenge, function(err) {
        if (err) {
          return res.redirect('back');
        }
        res.redirect('/mentor');
});
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

router.get("/mentorChallengeList", function(req, res){
      var noMatch = null;
      MentorChallenge.find({}, function(err, allMentorChallenges){
      if(err){
        console.log(err);
      } else {
         if(allMentorChallenges.length < 1){
           noMatch ="No Mentor Challenges have yet been posted.";
       }
  res.render("mentorChallengeList", {challenges :allMentorChallenges, noMatch: noMatch});    
   }
  });
});
module.exports = router;

