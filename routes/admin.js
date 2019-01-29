var express = require("express");
var router = express.Router();
var Admin = require("../models/admin");
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
    console.log("wqwqwqwqwqqwwq");
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

router.get("/dashboard", function(req, res){
  res.render("adminDashboard");
});


module.exports = router;
