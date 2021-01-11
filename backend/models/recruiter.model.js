const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recruiterSchema = new Schema({
    
    usrid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    phone: {
        type: String,
        required: true,
        trim: true
    },

    bio: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 250
    }

}, {timestamps: true});

//Validators

function dateValidator (value) {
    if(!value.end_year){
        return true;
    }
    return value.start_year <= value.end_year;
}

//Recruiter

const Recruiter = mongoose.model('Recruiter', recruiterSchema);
module.exports = Recruiter