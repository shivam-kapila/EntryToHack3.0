const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

var mentorSchema = mongoose.Schema({
    name: {
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
    // year: {
    //     type: Number,
    //     required: true
    // },
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
    isVerified: {
        type: Boolean,
        required: true
    },
    mentorChallenge: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "MentorChallenge"
            },
        name: String
    }
});

// PASSWORD HASHING ADDED

mentorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Mentor", mentorSchema);
