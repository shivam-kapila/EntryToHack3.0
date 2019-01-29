require("dotenv").load();

var express     = require("express"),
    ejs = require("ejs"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Mentor   = require("./models/mentor"),
    // Student      = require("./models/student"),

    Team         = require("./models/team");

//requiring routes
var indexRoutes      = require("./routes/index");
var mentorRoutes      = require("./routes/mentor");
var teamRoutes      = require("./routes/team");
var url = process.env.DATABASEURL || "mongodb://localhost/entry_to_hack3";
mongoose.connect(url);
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret: "Hack hai ye hack",
   resave: false,
   saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use('mentor', new LocalStrategy(Mentor.authenticate()));
passport.serializeUser(Mentor.serializeUser());
passport.deserializeUser(Mentor.deserializeUser());
passport.use('team', new LocalStrategy(Team.authenticate()));
passport.serializeUser(Team.serializeUser());
passport.deserializeUser(Team.deserializeUser());

app.use(function (req, res, next) {
  // res.locals.currentTeam = req.username;
  console.log(req.user);
  res.locals.mentor = req.user;
  res.locals.team = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/mentor", mentorRoutes);
app.use("/team", teamRoutes);


console.log(process.env.PORT);

app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log("Port up and running");
});
