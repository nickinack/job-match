const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicantSchema = new Schema({

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

    education: [
        {
            college: {type: String, required: true},
            date_schema: {
                type: {
                    start_year: {type: Number, required: true},
                    end_year: {type: Number}
                },
                validate: [dateValidator, "Start date must be present and must be before end date"]
            }
        }
    ],

    rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0
        },

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
    ]

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