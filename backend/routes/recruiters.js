const router = require('express').Router();
let Recruiter = require('../models/recruiter.model');

router.route('/viewall').get((req , res) => {
    console.log("In recruiter Viewall")
    Recruiter.find()
    .then(recruiters => res.json(recruiter))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req , res) => {
    console.log("Add Recruiter")
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
    const bio = req.body.bio;

    const newRecruiter = new Recruiter({name,email,password,phone,bio});
    newRecruiter.save()
    .then(() => res.json('Succesfully added new recruiter!'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req , res) => {
    console.log("View recruiter by ID")
    Recruiter.findById(req.params.id)
    .then(recruiters => res.json(recruiters))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req , res) => {
    console.log("Delete Recruiter")
    Recruiter.findByIdAndDelete(req.params.id)
    .then(() => res.json('Successfully Deleted'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req , res) => {
    console.log("Update Recruiter")
    Recruiter.findById(req.params.id)
    .then(recruiters => {
        recruiters.name = req.body.name;
        recruiters.email = req.body.email;
        recruiters.passowrd = req.body.password;
        recruiters.phone = req.body.phone;
        recruiters.bio = req.body.bio;
        recruiters.save()
        .then(recruiters => res.json('Successfully updated'))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
