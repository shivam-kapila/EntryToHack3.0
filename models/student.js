const mongoose = require('mongoose');

var studentSchema = mongoose.Schema({
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
    },
    isLeader: {
        type: Boolean,
        required: true
    },
    teamName: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
            },
        name: String
    }
});



// PASSWORD HASHING TO BE ADDED


module.exports = mongoose.model("Student", studentSchema);
