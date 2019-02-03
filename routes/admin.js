var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var Mentor = require("../models/mentor");
var Team = require("../models/team");
var async = require("async");
var nodemailer = require("nodemailer");
var passport = require("passport");

router.get("/login", function (req, res) {
  res.render("adminLogin");
});

router.get("/teams", isAdminLoggedIn, function (req, res) {
  Team.find({} , function (err, teams) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("adminTeams", { teams });
    }
  });
});

router.get("/mentorChallenges", isAdminLoggedIn, function (req, res) {
  Mentor.find({} , function (err, mentors) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("adminMentorChallenges", { mentors });
    }
  });
});

router.get("/team/:id", isAdminLoggedIn, function (req, res) {
  Team.findOne({_id: req.params.id} , function (err, team) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("adminTeamDashboard", { team });
    }
  });
});

router.post("/login", passport.authenticate("admin",
  {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",

  }), function (req, res) {
  });

router.get("/signup", function (req, res) {
  res.render("admin");
});

router.post("/signup", function (req, res) {
  var newAdmin = new Admin({
    username: req.body.username,
  });
  Admin.register(newAdmin, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render("admin", { error: err.message });
    }
    passport.authenticate("admin")(req, res, function () {
      res.redirect("/admin/dashboard");
    });
  });
});

router.get("/dashboard", isAdminLoggedIn, function (req, res) {
    res.render("adminDashboard");
});

router.get("/mentors", isAdminLoggedIn, function (req, res) {
  Mentor.find({}, function (err, mentors) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("adminMentors", { mentors: mentors });
    }
  });
});

router.post("/:id/verify", isAdminLoggedIn, function (req, res) {
  Mentor.findById(req.params.id, function (err, mentor) {
    mentor.isVerified = "Verified";
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
                to: mentor.email,
                from: 'csechack3.0@gmail.com',
                subject: 'Challenge Request Sent',
                text: 'Dear '+  mentor.name + '\n \n This is to inform you that your mentor status has been verified. You will be notified about further updates soon. \n\n Regards \n Team CSEC'
              };
              smtpTransport.sendMail(userMail, function(err) {
              });
            }
          ], function(err) {
            if (err) return next(err);
            res.redirect('/admin/dashboard');
          });
    mentor.save();
    res.redirect("/admin/mentors");
  });
});

router.post("/:id/reject", isAdminLoggedIn, function (req, res) {
  Mentor.findById(req.params.id, function (err, mentor) {
    mentor.isVerified = "Rejected";
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
                to: mentor.email,
                from: 'csechack3.0@gmail.com',
                subject: 'Challenge Request Sent',
                text: 'Dear '+  mentor.name + '\n \n This is to inform you that your mentorship has been rejected.Please contact the organisers for further details. \n\n Regards \n Team CSEC'
              };
              smtpTransport.sendMail(userMail, function(err) {
              });
            }
          ], function(err) {
            if (err) return next(err);
            res.redirect('/team/teamDashboard');
          });
    mentor.save();
    res.redirect("/admin/mentors");
  });
});

function isAdminLoggedIn(req, res, next) {
  console.log("Display");
  console.log(req.user);
  if (req.isAuthenticated() && req.user.role === "admin") {
    console.log("Yes");
    return next();
  }
  console.log("No");
  req.flash("error", "You need to be logged in to do that");
  res.redirect("/admin/login");
}


module.exports = router;
