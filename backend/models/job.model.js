const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({

    title: {
        type: String,
        required: true
    },

    max_applicants: {
        type: Number,
        required: true
    },

    max_positions: {
        type: Number,
        required: true
    },

    date_posted: {
        type: Number,
        required: true
    },

    recruiter: {
        type: String,
        required: true
    },

    deadline: {
        type: Date,
        required: true
    },

    skills: [
        {
            type: String,
            required: true
        }
    ],

    type: {
        type: String,
        required: true
    },

    salary: {
        type: Number,
        required: true,
        min: 0
    },

    duration: {
        type: Number,
        required: true,
        min: 0
    },

    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },

    posting_date: {
        type: {
            date: Number,
            month: String,
            year: Number
        },
        required: true
    }

})