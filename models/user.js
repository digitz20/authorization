const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    username: {
        type: String,
        lowercase: true
    },
    password: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
    
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    scoreIds: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Scores'
    }],
    profileId: {
        type: String
    }
    
}, {timestamps: true})

const userModel = mongoose.model('Users', userSchema)

module.exports = userModel