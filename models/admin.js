const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");

var adminSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    role: {
    	type: String,
    	default: "admin"
    }
});
adminSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("Admin", adminSchema);
