var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var Team = require("../models/team");
var Student = require("../models/student");
var nodemailer = require("nodemailer");


var passport = require("passport");

router.get("/signup", function (req, res) {
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
    } else if (team.members.length < 1) {
      res.render("teamLeaderSignup");
    } else {
      res.render("teamDashboard", { team: JSON.parse(JSON.stringify(team)) });
    }
  });
});

// router.get("/student", isTeamLoggedIn, function (req, res) {
//   res.render('teamRegistration');
// });

router.post('/leaderSignup', isTeamLoggedIn, function(req, res) {
  Team.findOne({ username: req.user.username }, function (err, team) {
    var newStudent = new Student({
      area: req.body.area,
      name: req.body.name,
      team: req.user.username,
      rollNumber: req.body.rollno,
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
      area: req.body.area,
      year: req.body.year,
      skills: req.body.skills
    });

  Student.register(newStudent, req.body.password, function (err, user) {
  if (err) {
      console.log(err);
      return res.render("teamLeaderSignup");
  }
  
  delete newStudent.username;
  delete newStudent.team;
  newStudent = newStudent.toObject();
  newStudent.isLeader = true;

  console.log(JSON.stringify(newStudent));

  team.members.push(newStudent);
  team.save(function (err) {
  });

  return res.render("index");
  });

  //   console.log(newStudent);
    JSON.parse(JSON.stringify(team)).members.push(newStudent);
    
  //   console.log(JSON.parse(JSON.stringify(team)).members);
    team.save();
  });
});

router.post('/student', isTeamLoggedIn, function (req, res) {
  req.body.members[0]["isLeader"] = true;
  Team.findOne({ username: req.user.username }, function (err, team) {
    console.log('Team found!');
    // console.log(team);
    team.members = req.body.members;
     async.waterfall([
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
            type: "login",
          user: 'csechack3.0@gmail.com',
          pass: process.env.PASS
        }
      });
      console.log(req.user.username);
      var userMail = {
        to: req.body.members[0].email,
        from: 'csechack3.0@gmail.com',
        subject: 'Thankyou for Registering',
        text: 'Dear '+  req.body.members[0].name + '\n \n This is to inform you that your registration as team ' + req.user.username + 'is successful. You will be notified about further updates soon. \n\n Regards \n Team CSEC'
      };
      smtpTransport.sendMail(userMail, function(err) {
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/team/teamDashboard');
  });
  
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
            async.waterfall([
            function(token, user, done) {
              var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    type: "login",
                  user: 'csechack3.0@gmail.com',
                  pass: process.env.PASS
                }
              });
              var userMail = {
                to: req.user.members[0].email,
                from: 'csechack3.0@gmail.com',
                subject: 'Challenge Request Sent',
                text: 'Dear '+  req.user.members[0].name + '\n \n This is to inform you that your challenge request has been sent to the respective mentor. You will be notified about further updates soon. \n\n Regards \n Team CSEC'
              };
              smtpTransport.sendMail(userMail, function(err) {
              });
            }
          ], function(err) {
            if (err) return next(err);
            res.redirect('/team/teamDashboard');
          });
        async.waterfall([
            function(token, user, done) {
              var smtpTransport2 = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    type: "login",
                  user: 'csechack3.0@gmail.com',
                  pass: process.env.PASS
                }
              });
              var userMail2 = {
                to: challenge.email,
                from: 'csechack3.0@gmail.com',
                subject: 'Challenge Request Received',
                text: 'Dear '+  challenge.name + '\n \n This is to inform you that you have received a challenge reguest form team '+ req.user.username +'.Please take the neccessary actions soon. \n\n Regards \n Team CSEC'
              };
              smtpTransport2.sendMail(userMail2, function(err) {
              });
            }
          ], function(err) {
            if (err) return next(err);
            res.redirect('/team/teamDashboard');
          });
  
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
      // console.log(JSON.stringify(req.user, undefined, 2))
      res.render("allMentorChallenges", { challenges: allMentorChallenges, noMatch: noMatch, team: req.user});
    }
  });
});

router.get("/postChallenge", isTeamLoggedIn, function (req, res) {
  res.render("teamChallenge");
});

router.post("/postChallenge", isTeamLoggedIn, isTeamLoggedIn, function (req, res) {
  Team.findOne({ username: req.user.username }, function (err, team) {
    team.challenge = (req.body.challenge);
    async.waterfall([
            function(token, user, done) {
              var smtpTransport = nodemailer.createTransport({
                service: 'Gmail', 
                auth: {
                    type: "login",
                  user: 'csechack3.0@gmail.com',
                  pass: process.env.PASS
                }
              });
              var userMail = {
                to: req.user.members[0].email,
                from: 'csechack3.0@gmail.com',
                subject: 'Challenge Request Sent',
                text: 'Dear '+  req.user.members[0].name + '\n \n This is to inform you that your challenge has been posted. You will be notified about further updates soon. \n\n Regards \n Team CSEC'
              };
              smtpTransport.sendMail(userMail, function(err) {
              });
            }
          ], function(err) {
            if (err) return next(err);
            res.redirect('/team/teamDashboard');
          });
    team.save(function (err) {
    });
    //  console.log("See" + mentor);
    res.redirect("/team/teamDashboard");
  });
});

router.post("/signup", function (req, res) {

  var showTeam;
  if(req.body.showTeam === "on") {
    showTeam = false;
  } else {
    showTeam = true;
  }

  var newTeam = new Team({
    username: req.body.username,
    showTeam: showTeam,
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
      res.redirect("/team/teamDashboard");
    });
  });
});

function isTeamLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "team") {
    // console.log("Yes");
    return next();
  }
  // console.log("No");
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/team/login");
}

module.exports = router;