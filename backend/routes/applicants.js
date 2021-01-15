const router = require('express').Router();
let Applicant = require('../models/applicant.model');
let Application = require('../models/application.model');
let User = require('../models/user.model');
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Job = require('../models/job.model');

router.route('/viewall').get((req , res) => {
    console.log("View all Applicants")
    Applicant.find()
    .then(applicants => res.json(applicants))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Find applicant by usrid
router.route('/:id').post((req,res) => {
    if(jwt.verify(req.body.token , 'nickinack').id !== req.params.id)
        return res.status(400).json({ msg: 'Not permitted' });

    Applicant.findOne({usrid: req.params.id})
    .then(applicant => {
        if(!applicant){
            return res.status(400).json({ msg: 'Not permitted' });
        }
        const id = req.params.id;
        User.findById(id)
        .then(users => res.send({users , applicant}))
        .catch(err => res.status(400).send('Error: ' + err));
    })
    .catch(err => res.status(400).send('Error: ' + err));
      
})

// Given usrid, delete an applicant
router.route('/:id').delete(auth , async (req , res) => {
    if(req.user.id != req.params.id)
        return res.status(400).json({ msg: 'Not permitted' });

    console.log("Delete Applicant");
    Applicant.findOneAndDelete({usrid: req.params.id})
    .then(() => {
        Application.deleteMany({applicant: req.params.id})
        .then(() => {
            console.log("Deleted applicant and his/her applications, now deleting user");
            User.findByIdAndDelete(req.params.id)
            .then(() => {res.json("Successfully Deleted")})
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

//Update given userId
router.route('/update/:id').post(auth, (req , res) => {
    if(req.user.id != req.params.id)
        return res.status(400).json({ msg: 'Not permitted' });
    console.log("Update Applicant")
    User.findById(req.params.id)
    .then(users => {
        Applicant.findOne({usrid : req.params.id})
        .then(applicants => {
            if(!applicants) return res.status(400).json({ msg: 'Not permitted' });
            users.name = req.body.name;
            users.email = req.body.email;
            users.password = req.body.password;
            applicants.rating = req.body.rating;
            applicants.usrid = req.params.id;
            applicants.languages = req.params.languages;
            applicants.education = req.params.education;
            applicants.skills = req.params.skills;
            users.save()
            .then(() => {
                applicants.save()
                .then(() => res.json("Successfully saved!!"))
                .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// View applications given usrid
router.route('/applications/:id').post((req,res) => {
    if(jwt.verify(req.body.token , 'nickinack').id !== req.params.id)
        return res.send('1');
    console.log("View all applications by id")
    Applicant.findOne({usrid: req.params.id})
    .then(applicants => {
        console.log(applicants);
        if(!applicants) return res.send('1');
        Application.find({applicant : req.params.id})
        .then(applications => res.send(applications))
        .catch(err => res.send('Error: ' + err));
    })
    .catch(err => res.send('Error: ' + err));
    
});

// Create application given usrid /usrid/jobid
router.route('/applications/:id1/:id2').post((req,res) => {
    if(jwt.verify(req.body.token , 'nickinack').id !== req.params.id1)
    {
        console.log(jwt.verify(req.body.token , 'nickinack').id);
        console.log(req.params.id1);
        return res.send('Not Permitted!');
    }
    console.log('Apply for a job');
    Application.findOne({applicant: req.params.id1 , job: req.params.id2})
    .then(alreadyApplied => {
        if(alreadyApplied) return res.send('Already applied!');
        Applicant.findOne({usrid: req.params.id1})
        .then(applicants => {
            Job.findById(req.params.id2)
            .then(jobs => {
                console.log(jobs);
                console.log(applicants);
                if(jobs.active == 0) return res.send('Not active');
                if(!applicants) return res.send('Not permitted');
                const applicant = req.params.id1;
                const job = req.params.id2;
                const sop = req.body.sop;
                const newApplication = new Application({applicant,job,sop});
                newApplication.save()
                .then(applications => {
                    Application.find({job: req.params.id2})
                    .then(applications => {
                        if(applications.length >= jobs.max_applicants)
                        {
                            //Change job to inactive
                            Job.updateOne({"_id": req.params.id2} , {"active": 0})
                            .then(() => {return res.send('Successfully applied') })
                            .catch(err => res.status(400).json('Error: ' + err));
                        }
                        else
                        {
                            return res.send('Successfully applied');
                        }
                    })
                    .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err)); 
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
    
})
module.exports = router;
