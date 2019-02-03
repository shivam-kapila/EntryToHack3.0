const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

var studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    rollNumber: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
    },
    area: {
        type: String,
    },
    skills: {
        type: [],
        required: true
    },
    role: {
        type: String,
        default: "student"
    }
});

// PASSWORD HASHING ADDED

studentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", studentSchema);
