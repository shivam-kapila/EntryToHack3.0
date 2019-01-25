var express = require("express");
var router = express.Router();
var Team = require("../models/team");
var Student = require("../models/student");
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
        successRedirect: "/test",
        failureRedirect: "/team/login", 
}),function(req, res) {
    
});

router.get('/student', function(req, res){
  // res.render("student1")
  res.render("teamRegistration");
});

router.post('/student', function(req, res){
  console.log(req.body.student);
  req.body.student.isLeader = true;
Student.create(req.body.student, function(err) {
        if (err) {
          console.log(err);
          return res.redirect('back');
        }
        res.redirect('/');
      });
});

router.post("/", function(req, res) {
    var newTeam = new Team({
            username: req.body.username,
        });

    Team.register(newTeam, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("team", {error: err.message});
       }
       passport.authenticate("team")(req, res, function(){
       	console.log("qwertyujkl");
           res.redirect("/test");
       });
   }); 
});


module.exports = router;