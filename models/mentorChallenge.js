const mongoose = require('mongoose');

var mentorChallengeSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: { 
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: true
    },
});

// PASSWORD HASHING ADDED


module.exports = mongoose.model("MentorChallenge", mentorChallengeSchema);
