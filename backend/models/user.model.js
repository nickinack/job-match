const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        minlength: 3
    },

    type: {
        type: String,
        required: true
    },

    profile: {
        type: String,
    }

}, {timestamps: true});


//Recruiter

const User = mongoose.model('User', userSchema);
module.exports = User;