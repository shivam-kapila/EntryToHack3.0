var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var Team = require("../models/team");
var async = require("async");
var nodemailer = require("nodemailer");
var passport = require("passport"),
  LocalStrategy = require('passport-local').Strategy;

router.get("/signup", function (req, res) {
  res.render("mentor");
});

//show login form 
router.get("/login", function (req, res) {
  res.render("mentorLogin");
});

router.get("/challenge", isLoggedIn, isVerified, function (req, res) {
  res.render("mentorChallenge");
});

router.get("/dashboard", isLoggedIn, function (req, res) {
  Mentor.find({ username: req.user.username }, function (err, mentor) {
    if (err) {
      console.log(err);
      res.redirect("back");
    }
    // else {
    //   // req.user.mentorChallenges = (mentor.mentorChallenges[0]);
    // }
    res.render("mentorDashboard", { mentor: req.user });
  });
});

// router.get("/update", isLoggedIn, function(req, res){
// Mentor.findById("5c4b638c48d00d440b01dc6c", async function(err, mentor){
//             mentor.mentorChallenges.splice(0,mentor.mentorChallenges.length)


//             mentor.save();
// console.log("done");        
// });
// })

router.get("/:id/view/:challengeid/:username", isLoggedIn, function (req, res) {
  // console.log("start" + req.params +" finish");
  // Mentor.findById(req.params.id, function (err, mentor) {
  //   mentor.mentorChallenges.forEach(function (chall) {
  //     var k = 0;
  //     for (var i = 0; i < chall.applicants.length; i++) {
  //       if (chall.applicants[i] == req.params.username) {
  //         k = 1;
  //         break;
  //       }
  //     }
  //     if (k === 1) {
        Team.find({ username: req.params.username }, function (err, team) {
          if (err) {
            console.log(err);
            res.redirect("back");
          } 


          // var s = JSON.stringify(team).slice(1, JSON.stringify(team).length - 1);
          res.render("teamDetails", { team: team[0], mentorid: req.params.id, 
                                      challengeid: req.params.challengeid, username: req.params.username });
        });
      // }
  //   });
  // });
});

router.post("/:id/view/:challengeid/:username/accept", isLoggedIn,function (req, res) {
var user, chall;
Mentor.findById(req.params.id, function(err, mentor){
  for(var i = 0; i < mentor.mentorChallenges.length; i++){
    if(mentor.mentorChallenges[i].id == req.params.challengeid){
        user = mentor.username;
        chall = mentor.mentorChallenges[i];
        var challenge = mentor.mentorChallenges[i];
        mentor.mentorChallenges[i].teamusername = req.params.username;
        mentor.mentorChallenges[i].applicants = [];
        mentor.save()
        console.log('Mentor Saved');
      }
  }
}).then(() => {
            addTeamChallenge(req.params.username, chall, user, res);
          }).catch((e) => console.log('Failed to save mentor\'s team', e));

});

var addTeamChallenge = (username, chall, user, res) => {
  Team.find({username}, function(err, team){
  if(err){
    console.log(err)
    res.redirect("back");
  }
  else {
   var challenge = {
        mentorname : user,
        title : chall.title,
        category : chall.category,
        description : chall.description
    };
    team[0].mentorchallenge = challenge;
    team[0].save();
  }
}).then(() => {
                removeTeamMentorChallenges(username, res);
                console.log('Redirected, route successfully executed');
              })
              .catch((e) => console.log('Failed to add Team Challenge', e));
};

var removeTeamMentorChallenges = (username, res) => {
  Mentor.find({}, function(err, mentors){
  if(err){
    res.redirect("back");
  } else {
  mentors.forEach(function(mentor){
  for(var i = 0; i < mentor.mentorChallenges.length; i++){
      var appl = mentor.mentorChallenges[i].applicants;
      mentor.mentorChallenges[i].applicants = [];
      for(var j = 0; j < appl.length; j++){
        if(appl[j] != username){
          mentor.mentorChallenges[i].applicants.push(appl[j]);
        }
      }
    mentor.save();              
   }
  });
     res.redirect("/mentor/mentorChallengeList");
  }  
});
};

router.post("/:id/view/:challengeid/:username/reject", isLoggedIn, function (req, res) {
Mentor.findById(req.params.id, function(err, mentor){
  for(var i = 0; i < mentor.mentorChallenges.length; i++){
    if(mentor.mentorChallenges[i].id == req.params.challengeid){
      var appl = mentor.mentorChallenges[i].applicants;
      mentor.mentorChallenges[i].applicants = [];
      for(var j = 0; j < appl.length; j++){
        if(appl[j] != req.params.username){
          mentor.mentorChallenges[i].applicants.push(appl[j]);
        }
      }
    mentor.save();      
    res.redirect("/mentor/mentorChallengeList");
        }
  }
});
});

router.post("/challenge", isLoggedIn, isVerified, function (req, res) {
  Mentor.findOne({ username: req.user.username }, function (err, mentor) {
    mentor.mentorChallenges.push(req.body.challenge);
    req.user.mentorChallenges.push(req.body.challenge);
    mentor.save(function (err) {
    });
    res.redirect("/mentor/dashboard");
  });
});

//handling login logic
router.post("/login", passport.authenticate("mentor",
  {
    successRedirect: "/mentor/dashboard",
    failureRedirect: "/mentor/login",

  }), function (req, res) {
    mentor: req.body.username;
  });


router.post("/signup", function (req, res) {

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
  newMentor.isVerified = "NotVerified";

  Mentor.register(newMentor, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("mentor", { error: err.message });
    }
    passport.authenticate("mentor")(req, res, function () {

      res.redirect("/mentor/dashboard");
    });
  });
});

router.get("/mentorChallengeList", isLoggedIn, function (req, res) {
  var noMatch = null;
  Mentor.find({ username: req.user.username }, function (err, mentor) {
    if (err) {
      console.log(err);
    } else {
      allMentorChallenges = mentor;
      if (allMentorChallenges.length < 1) {
        noMatch = "No Challenges have yet been posted.";
      }
      res.render("mentorChallengeList", { challenges: allMentorChallenges, noMatch: noMatch });
    }
  });
});

// router.get("/mentorChallengeList", isLoggedIn, function (req, res) {
//   var noMatch = null;
//   Mentor.find({ username: req.user.username }, function (err, mentor) {
//     if (err) {
//       console.log(err);
//     } else {
//       allMentorChallenges = mentor;
//       // console.log(JSON.stringify(allMentorChallenges));
//       if (allMentorChallenges.length < 1) {
//         noMatch = "No Challenges have yet been posted.";
//       }
//       var arr = [];
//       allMentorChallenges[0].mentorChallenges.forEach((challenge) => {
//         // console.log("Challenge" + challenge);
//         challenge.applicants.forEach((applicant) => {
//           // console.log(applicant);
//           Team.findOne({username: applicant}, function(err, team) {
//             // console.log(JSON.stringify(team));
//             // arr.push(team[0].username);
//             if(team.mentor === "") {
//               arr.push('');
//             } else {
//               arr.push(team.mentor);
//             }
//           });
//         });
//       });
//       res.render("mentorChallengeList", { challenges: allMentorChallenges, applicantArr: arr, noMatch: noMatch });
//     }
//   });
// });

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "mentor") {

    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/mentor/login");
}

function isVerified(req, res, next) {
  if (req.user.isVerified == "Verified") {
    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/mentor/dashboard");
}
module.exports = router;

