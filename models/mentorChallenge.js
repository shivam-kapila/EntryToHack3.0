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
    mentor: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mentor"
        },
        name: String
    }
});

// PASSWORD HASHING ADDED


module.exports = mongoose.model("MentorChallenge", mentorChallengeSchema);
