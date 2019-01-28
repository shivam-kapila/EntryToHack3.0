var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var async = require("async");
var nodemailer = require("nodemailer");
var passport = require("passport");

router.get("/signup", function (req, res) {
  res.render("mentor"); 
});

//show login form 
router.get("/login", function(req, res){
	res.render("mentorLogin");
});

router.get("/challenge", isLoggedIn, isVerified, function(req, res){
	res.render("mentorChallenge");
});

router.get("/dashboard", isLoggedIn, function(req, res){
  console.log(res.locals.mentorid);
  res.render("mentorDashboard", {mentor: req.user});          
});

// router.get("/update", isLoggedIn, function(req, res){
// Mentor.findById("5c4b638c48d00d440b01dc6c", async function(err, mentor){
//             mentor.mentorChallenges.splice(0,mentor.mentorChallenges.length)


//             mentor.save();
// console.log("done");        
// });
// })
router.post("/addChallenge/:id", function(req,res){
Mentor.applicants.findById(req.aprams.id, function(err, applicant){
  if(err){
    console.log(err);
    res.redirect("back");
  } else {
  applicant.applicants.push(req.user.username)
  applicant.save();
  res.redirect("/team/dashboard");
}
});
});

router.post("/challenge", isLoggedIn, isVerified, function(req, res){
  Mentor.findOne({username: req.user.username}, function(err, mentor){
    console.log(mentor);
    mentor.mentorChallenges.push(req.body.challenge);
     mentor.save(function(err) {
        });
     res.redirect("/mentor/dashboard");
  });
});

//handling login logic
router.post("/login", passport.authenticate("mentor",
    {
        successRedirect:  "/mentor/dashboard",
        failureRedirect: "/mentor/login",

}),function(req, res) {
          mentor: req.body.username 
});


router.post("/signup", function(req, res) {
  console.log(req.body.skills);
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
        newMentor.isVerified = true;
        console.log(newMentor);
    Mentor.register(newMentor, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("mentor", {error: err.message});
       }
       passport.authenticate("mentor")(req, res, function(){
        console.log("qwertyuiirrffesed");
           res.redirect("/mentor/dashboard");
       });
   }); 
});

router.get("/mentorChallengeList", isLoggedIn, function(req, res){
      var noMatch = null;
      Mentor.find({username: req.user.username}, function(err, mentor){
      if(err){
        console.log(err);
      } else {
        allMentorChallenges = mentor;
         if(allMentorChallenges.length < 1){
           noMatch ="No Challenges have yet been posted.";
       }
  res.render("mentorChallengeList", {challenges: allMentorChallenges, noMatch: noMatch});    
   }
  });
});

router.get("/allMentorChallenges", function(req, res){
      var noMatch = null;
      Mentor.find({}, function(err, mentor){
      if(err){
        console.log(err);
      } else {
        allMentorChallenges = mentor;
         if(allMentorChallenges.length < 1){
           noMatch ="No Challenges have yet been posted.";
       }
  res.render("allMentorChallenges", {challenges: allMentorChallenges, noMatch: noMatch});    
   }
  });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/mentor/login");
}

function isVerified(req, res, next){
    if(req.user.isVerified){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/mentor/dashboard");
}
module.exports = router;

