const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recruiterSchema = new Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 3
    },

    bio: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 250
    },

}, {timestamps: true});

//Validators

function dateValidator (value) {
    if(!value.end_year){
        return true;
    }
    return value.start_year <= value.end_year;
}

//Applicant

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiter