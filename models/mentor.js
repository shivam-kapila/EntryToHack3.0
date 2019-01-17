const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

var mentorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,                   // TODO: VALIDATOR TO BE ADDED
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// PASSWORD HASHING ADDED

mentorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Mentor", mentorSchema);
