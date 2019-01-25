var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));
var Mentor = require("../models/mentor");

Mentor.findById("5c4b638c48d00d440b01dc6c", async function(err, mentor){
            mentor.isVerified = true;

            mentor.save();
console.log("done");
        });