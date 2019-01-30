var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var Team = require("../models/team");
// var Student = require("../models/student");

var passport = require("passport");

router.get("/", function (req, res) {
  res.render("team"); 
});
//show login form 
router.get("/login", function(req, res){
	res.render("teamLogin");
});

//handling login logic
router.post("/login", passport.authenticate("team",
    {
        // successRedirect: "/team/teamDashboard",
        failureRedirect: "/team/login", 
}),function(req, res) {
  console.log(req.user);
  res.redirect("/team/teamDashboard")
});

router.get("/teamDashboard", isTeamLoggedIn, function(req, res){
  res.render("teamDashboard");
});

router.get('/student', isTeamLoggedIn, function(req, res){
  // res.render("student1")
  res.render("teamRegistration");
});

router.post('/student', isTeamLoggedIn, function(req, res){
  console.log(req.body);
  req.body.members[0]["isLeader"] = true;
Team.findOne({username: req.user.username}, function(err, team){
  console.log(team);
  team.members = req.body.members;
  team.save();
  res.redirect("/team/allMentorChallenges");
});
});


// router.post("/:id/participate/:challengeid/empty",isTeamLoggedIn, function(req,res){
// Mentor.findById(req.params.id, function(err, challenge){
//   if(err){
//     console.log(err);
//     res.redirect("back");
//   } else {
//   challenge.mentorChallenges.forEach(function(chall) {  
//     if(chall.id === req.params.challengeid){
//           chall.applicants = [];
//       challenge.save();
//       res.redirect("/team/dashboard");

// }
//   });
// }
//   });
// });

router.post("/:id/participate/:challengeid", isTeamLoggedIn, function(req,res){
Mentor.findById(req.params.id, function(err, challenge){
  if(err){
    console.log(err);
    res.redirect("back");
  } else {
  challenge.mentorChallenges.forEach(function(chall) {    
    if(chall.id === req.params.challengeid){
      var k = 0;
      for( var j = 0; j < chall.applicants.length; j++){
        if(req.user.username == chall.applicants[j])
          {
          k = 1;
          break;
          }
      }
      if(k === 1)
      {
        console.log("Already applied");
      } else {
      chall.applicants.push(req.user.username);
      challenge.save();
      res.redirect("/team/allMentorChallenges");
      }
}
});
}
});
});

router.get("/allMentorChallenges", isTeamLoggedIn, function(req, res){
      var noMatch = null;
      Mentor.find({}, function(err, mentor){
      if(err){
        console.log(err);
      } else {
        allMentorChallenges = mentor;
         if(allMentorChallenges.length < 1){
           noMatch ="No Challenges have yet been posted.";
       }
  res.render("allMentorChallenges", {challenges: allMentorChallenges, noMatch: noMatch, team: req.user.username});    
   }
  });
});

router.post("/", function(req, res) {
    var newTeam = new Team({
            username: req.body.username,
        });
// console.log(req.body.teamusername);
// console.log(req.body.teampassword);
    Team.register(newTeam, req.body.password, function(err, user){
       if(err){
           console.log("yes"+err);
           return res.render("team", {error: err.message});
       }
       passport.authenticate("team")(req, res, function(){
       	console.log("qwertyujkl");
        res.redirect("/team/student");
       });
   }); 
});

function isTeamLoggedIn(req, res, next){
    if(req.isAuthenticated() && req.user.role === "team"){
      // console.log("Displayttt");
       // console.log(req.user)
      console.log("Yes")
        return next();
    }
    console.log("No")
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/team/login");
}

module.exports = router;