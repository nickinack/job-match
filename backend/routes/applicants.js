const router = require('express').Router();
let Applicant = require('../models/applicant.model');

router.route('/viewall').get((req , res) => {
    console.log("View all Applicants")
    Applicant.find()
    .then(applicants => res.json(applicants))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req , res) => {
    console.log("Add applicant")
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    var rating = Number(req.body.rating);
    const education = req.body.education;
    const languages = req.body.languages;
    const skills = req.body.skills
    if(!rating)
        rating = Number(0);
    const newApplicant = new Applicant({name,email,password,rating,skills,education,languages});
    newApplicant.save()
    .then(() => res.json('Succesfully added new applicant!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req , res) => {
    console.log("View applicant by ID")
    Applicant.findById(req.params.id)
    .then(applicants => res.json(applicants))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req , res) => {
    console.log("Delete Applicant")
    Applicant.findByIdAndDelete(req.params.id)
    .then(() => res.json('Successfully Deleted'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req , res) => {
    console.log("Update Applicant")
    Applicant.findById(req.params.id)
    .then(applicants => {
        applicants.name = req.body.name;
        applicants.email = req.body.email;
        applicants.passowrd = req.body.password;
        applicants.rating = Number(req.body.rating);
        applicants.education = req.body.education;
        applicants.skills = req.body.skills;
        applicants.languages = req.body.languages;
        applicants.save()
        .then(applicants => res.json('Successfully updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});
module.exports = router;
