var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var Team = require("../models/team");

var passport = require("passport");

router.get("/", function (req, res) {
  res.render("team");
});

//show login form 
router.get("/login", function (req, res) {
  res.render("teamLogin");
});

//handling login logic
router.post("/login", passport.authenticate("team",
  {
    // successRedirect: "/team/teamDashboard",
    failureRedirect: "/team/login",
  }), function (req, res) {
    // console.log(req.user);
    res.redirect("/team/teamDashboard");
  });

router.get("/teamDashboard", isTeamLoggedIn, function (req, res) {
  Team.findOne({ username: req.user.username }, function (err, team) {
    if (err) {
      console.log(err);
    } else if (team.members.length < 4) {
      res.render("teamRegistration");
    } else {
      res.render("teamDashboard", { team: JSON.parse(JSON.stringify(team)) });
    }
  });
});

router.get("/student", isTeamLoggedIn, function (req, res) {
  res.render('teamRegistration');
});

router.post('/student', isTeamLoggedIn, function (req, res) {
  req.body.members[0]["isLeader"] = true;
  Team.findOne({ username: req.user.username }, function (err, team) {
    console.log('Team found!');
    // console.log(team);
    team.members = req.body.members;
    team.save().then((data) => {
      console.log('Data saved!');
      res.sendStatus(200);
    }).catch((e) => res.sendStatus(501));
    
  });
});

router.post("/:id/participate/:challengeid", isTeamLoggedIn, function (req, res) {
  Mentor.findById(req.params.id, function (err, challenge) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      challenge.mentorChallenges.forEach(function (chall) {
        if (chall.id === req.params.challengeid) {
          var k = 0;
          for (var j = 0; j < chall.applicants.length; j++) {
            if (req.user.username == chall.applicants[j]) {
              k = 1;
              break;
            }
          }
          if (k === 1) {
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

router.get("/allMentorChallenges", isTeamLoggedIn, function (req, res) {
  var noMatch = null;
  Mentor.find({}, function (err, mentor) {
    if (err) {
      console.log(err);
    } else {
      allMentorChallenges = mentor;
      if (allMentorChallenges.length < 1) {
        noMatch = "No Challenges have yet been posted.";
      }
      res.render("allMentorChallenges", { challenges: allMentorChallenges, noMatch: noMatch, team: req.user.username });
    }
  });
});

router.get("/postChallenge", isTeamLoggedIn, function (req, res) {
  res.render("teamChallenge");
});

router.post("/postChallenge", isTeamLoggedIn, isTeamLoggedIn, function (req, res) {
  Team.findOne({ username: req.user.username }, function (err, team) {
    team.challenge = (req.body.challenge);
    // req.user.mentorChallenges.push(req.body.challenge)
    team.save(function (err) {
    });
    //  console.log("See" + mentor);
    res.redirect("/team/teamDashboard");
  });
});

router.post("/", function (req, res) {
  var newTeam = new Team({
    username: req.body.username,
    mentorchallenge: {
      mentorname: "",
        title : "",
        category : "",
        description : ""
    }
  });
  Team.register(newTeam, req.body.password, function (err, user) {
    if (err) {
      console.log("yes" + err);
      return res.render("team", { error: err.message });
    }
    passport.authenticate("team")(req, res, function () {
      console.log("qwertyujkl");
      res.redirect("/team/student");
    });
  });
});

function isTeamLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "team") {
    console.log("Yes");
    return next();
  }
  console.log("No");
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/team/login");
}

module.exports = router;