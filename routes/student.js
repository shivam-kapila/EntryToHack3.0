var express = require("express");
var router = express.Router();
var Mentor = require("../models/mentor");
var Student = require("../models/student");
var Team = require("../models/team");
var async = require("async");
var nodemailer = require("nodemailer");
var passport = require("passport"),
  LocalStrategy = require('passport-local').Strategy;

router.get("/signup", function (req, res) {
  res.render("studentSignup");
});

router.get("/dashboard", isStudentLoggedIn, function(req, res) {
    Team.findOne({username: req.user.team}, function(err, team) {
        // console.log(req.user.team);
        // console.log(JSON.stringify(team));
        if (err) {
            console.log(err);
        } else if (JSON.parse(JSON.stringify(team)).members.length < 1) {
            res.render("teamLeaderSignup");
        } else {
            res.render("studentDashboard", { team: JSON.parse(JSON.stringify(team)) });
        }
        });
});

router.get("/login", function(req, res) {
    res.render("studentLogin");
});

router.post("/login", passport.authenticate("student",
  {
    successRedirect: "/student/dashboard",
    failureRedirect: "/student/login",

  }), function (req, res) {
    student: req.body.username;
  });

router.post("/signup", function (req, res) {
    Team.findOne({username: req.body.team}, function(err, team) {
        if (err) {
            console.log(err);
            return res.render("studentSignup");
        }

        // console.log(JSON.parse(JSON.stringify(team)).members);
        // console.log('req.body.year');
        // console.log(req.body.year);
        // console.log('req.body.year');
        if(!validateTeam(JSON.parse(JSON.stringify(team)).members, req.body.year)) {
            return res.render("studentSignup");
        }

        var newStudent = new Student({
            name: req.body.name,
            team: req.body.team,
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
            return res.render("studentSignup");
        }  
        delete newStudent.username;
        delete newStudent.team;

        // team.members.push(newStudent);
        

        team.members.push(newStudent);
        team.save(function (err) {
        });
        //   console.log(newStudent);
        JSON.parse(JSON.stringify(team)).members.push(newStudent);
          
        //   console.log(JSON.parse(JSON.stringify(team)).members);
          team.save();

        // JSON.parse(JSON.stringify(team)).members.push(newStudent);
        // team.save(function (err) {
        // });
        //   console.log(newStudent);
          
        //   console.log(JSON.parse(JSON.stringify(team)).members);
        //   team.save();

        passport.authenticate("student")(req, res, function () {
            res.redirect("/student/dashboard");
          });
    });
    
    });
    });

function isStudentLoggedIn(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "student") {

    return next();
  }
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/student/login");
}

// function isVerified(req, res, next) {
//   if (req.user.isVerified == "Verified") {
//     return next();
//   }
//   req.flash("error", "You need to be logged in to do that");
//   res.redirect("/mentor/dashboard");
// }

function validateTeam(teamDetails, year) {
    var first = 0, second = 0, third = 0, fourth = 0, fifth = 0;
    console.log("Year" + year);
    switch (year) {
        case "2": second++;
            break;
        case "3": third++;
            break;
        case "4": fourth++;
            break;
        case "5": fifth++;
            break;
        case "1": first++;
            break;
        default: break;     // No use        
    }
    teamDetails.forEach(function (member) {
        switch (member.year) {
            case "2": second++;
                break;
            case "3": third++;
                break;
            case "4": fourth++;
                break;
            case "5": fifth++;
                break;
            case "1": first++;
                break;
            default: break;     // No use        
        }
    });
    console.log(`Second: ${second}\nThird: ${third}\nFourth: ${fourth}\nFirst: ${first}`);
    console.log('Team Details in Validate Form: ', teamDetails);
    if (second > 1) {        // If there are three second years
        if (third > 0 || fourth > 0 || fifth > 0 || second > 3) {
            console.log('Caught at first if');
            return false;
        } else {
            return true;
        }
    }
    if (third > 0) {         // If there are two third years
        if (second > 1 || fourth > 0 || fifth > 0 || third > 2) {
            console.log('Caught at second if');
            return false;
        } else {
            return true;
        }
    }
    if (fourth > 0) {
        if (third > 0 || second > 0 || fifth > 0 || fourth > 1) {
            return false;
        } else {
            return true;
        }
    }
    if (fifth > 0) {
        if (third > 0 || second > 0 || fourth > 0 || fifth > 1) {
            return false;
        } else {
            return true;
        }
    }
    return true;
}

module.exports = router;