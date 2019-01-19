const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

var teamSchema = mongoose.Schema({
    teamUsername: {
        type: String,
        unique: true,
        required: true
    },
    teamPassword: {
        type: String,
        required: true
    },
    user1: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
            },
        name: String
    },    user2: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
            },
        name: String
    },    user3: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
            },
        name: String
    },    user4: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
            },
        name: String
    },    user5: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student"
            },
        name: String
    },
});

// PASSWORD HASHING ADDED

teamSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("Team", teamSchema);
