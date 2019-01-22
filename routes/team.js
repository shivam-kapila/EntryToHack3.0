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

router.get('/student1', function(req, res){
  res.render("student1")
});

router.post('/student1', function(req, res){
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

router.get('/student2', function(req, res){
  res.render("student2")
});

router.post('/student2', function(req, res){
  req.body.student.isLeader = false;
Student.create(req.body.student, function(err) {
        if (err) {
          console.log(err);
          return res.redirect('back');
        }
        res.redirect('/');
      });
});

router.get('/student3', function(req, res){
  res.render("student3")
});

router.post('/student3', function(req, res){
  req.body.student.isLeader = false;
Student.create(req.body.student, function(err) {
        if (err) {
          console.log(err);
          return res.redirect('back');
        }
        res.redirect('/');
      });
});

router.get('/student4', function(req, res){
  res.render("student4")
});

router.post('/student4', function(req, res){
  req.body.student.isLeader = false;
Student.create(req.body.student, function(err) {
        if (err) {
          console.log(err);
          return res.redirect('back');
        }
        res.redirect('/');
      });
});

router.get('/student5', function(req, res){
  res.render("student5")
});

router.post('/student5', function(req, res){
  console.log(req.body.student);
  req.body.student.isLeader = fasle;
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