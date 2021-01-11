const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const applicationSchema = new Schema({

    applicant: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },

    sop: {
        type: String,
        maxlength: 250,
        minlength: 10,
        required: true
    },

    accept: {
        type: Number,
        min: 0,
        max: 2,
        default: 0,
        required: true
    }

}, {timestamps: true});

// Application
const Application = mongoose.model('Application' , applicationSchema);
module.exports = Application;