const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicantSchema = new Schema({

    usrid: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    education: [
        {
            college: {type: String, required: true},
            start_year: {type: Number, required: true},
            end_year: {type: Number},
        }
    ],

    skills: [
        {
            type:String,
            required: true
            
        }
    ],
    
    languages: [
        {
            type:String,
            required: true
        }
    ],

    recRated: [String]

}, {timestamps: true});

//Validators

function dateValidator (value) {
    if(!value.end_year){
        return true;
    }
    return value.start_year <= value.end_year;
}

//Applicant

const Applicant = mongoose.model('Applicant', applicantSchema);
module.exports = Applicant