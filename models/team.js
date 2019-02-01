const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

var teamSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        // default: "team1"
    },
    password: {
        type: String,
    },
    role: {
        type: String,
        default: "team"
    },
    members: [
        {
            name: {
                type: String,
                required: true
            },
            isLeader: {
                type: Boolean,
                default: false
            },
            email: {
                type: String,
                unique: true,
                required: true
            },
            rollNumber: {
                type: String,
                unique: true,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            year: {
                type: String,
                required: true
            },
            skills: {
                type: [],
                required: true
            }
        }
    ],
    challenge: {
        title: {
            type: String
        },
        category: {
            type: String
        },
        description: {
            type: String
        }
    },
    mentor: {
        type: String,
        default: ""
    }
});

// PASSWORD HASHING ADDED

teamSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("Team", teamSchema);
