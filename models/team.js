const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

var teamSchema = mongoose.Schema({
    teamUsername: {
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

teamSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("Team", teamSchema);
