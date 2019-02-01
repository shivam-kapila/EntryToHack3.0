var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
var Mentor = require("../models/mentor");
var async = require("async");
var nodemailer = require("nodemailer");
var passport = require("passport");

router.get("/login", function(req, res){
	res.render("adminLogin");
});

router.post("/login", passport.authenticate("admin",
    {
        successRedirect:  "/admin/dashboard",
        failureRedirect: "/admin/login",

}),function(req, res) {
});

router.get("/signup", function (req, res) {
  res.render("admin"); 
});

router.post("/signup", function(req, res) {
    var newAdmin = new Admin({
            username: req.body.username,
        });
    Admin.register(newAdmin, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("admin", {error: err.message});
       }
       passport.authenticate("admin")(req, res, function(){
           res.redirect("/admin/dashboard");
       });
   }); 
});

router.get("/dashboard", isAdminLoggedIn, function(req, res){
  Mentor.find({}, function(err, mentors){
    if(err){
      console.log(err);
      res.redirect("back");
    } else{
  res.render("adminDashboard", {mentors: mentors});
    }
  });
});

router.post("/:id/verify", isAdminLoggedIn, function(req, res){
Mentor.findById(req.params.id, function(err, mentor){
  mentor.isVerified = "Verified";
  mentor.save();
  res.redirect("/admin/dashboard");
});
});

router.post("/:id/reject", isAdminLoggedIn, function(req, res){
Mentor.findById(req.params.id, function(err, mentor){
  mentor.isVerified = "Rejected";
  mentor.save();
  res.redirect("/admin/dashboard");
});
});

function isAdminLoggedIn(req, res, next){
      console.log("Display");
       console.log(req.user);
    if(req.isAuthenticated() && req.user.role === "admin"){
      console.log("Yes");
        return next();
    }
    console.log("No");
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/admin/login");
}


module.exports = router;
