const mongoose = require('mongoose');

var mentorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,                   // TODO: VALIDATOR TO BE ADDED
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
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// PASSWORD HASHING TO BE ADDED