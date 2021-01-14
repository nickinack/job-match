const router = require('express').Router();
let Recruiter = require('../models/recruiter.model');
let Job = require('../models/job.model');
let User = require('../models/user.model');
let Application = require('../models/application.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.route('/viewall').get((req , res) => {
    console.log("In recruiter Viewall")
    Recruiter.find()
    .then(recruiters => res.json(recruiters))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').post((req,res) => {

    if(jwt.verify(req.body.token , 'nickinack').id !== req.params.id)
        return res.status(400).json({ msg: 'Not permitted' });

    Recruiter.findOne({usrid: req.params.id})
    .then(recruiter => {
        if(!recruiter){
            return res.status(400).json({ msg: 'Not permitted' });
        }
        const id = req.params.id;
        User.findById(id)
        .then(users => res.json({users , recruiter}))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

// Given usrid, delete recruiter
router.route('/:id').delete( (req , res) => {

    console.log("Delete Recruiter")
    Recruiter.findOneAndDelete({usrid: req.params.id})
    .then(() => {
        Job.find({recruiter: req.params.id})
        .then(jobs => {
            var jobids = [];
            if(jobs.length != 0)
            {
                for(var i = 0 ; i < jobs.length ; i++)
                {
                    jobids.push(jobs[i].id);
                }
                console.log(jobids);
            }
            Job.deleteMany({recruiter: req.params.id})
            .then(() => {
                Application.deleteMany({job: {$in : jobids}})
                .then(() => {
                    User.findOneAndDelete(req.params.id)
                    .then(() => res.json("Successfully delete user"))
                    .catch(err => res.status(400).json('Error: ' + err));
                })
                .catch(err => res.status(400).json('Error: ' + err));
            })
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
    console.log("Update Recruiter")
    User.findById(req.params.id)
    .then(users => {
        Recruiter.findOne({usrid : req.params.id})
        .then(recruiters => {
            if(!recruiters) res.status(400).json({ msg: 'Not permitted' });
            users.name = req.body.name;
            users.email = req.body.email;
            users.password = req.body.password;
            recruiters.usrid = req.params.id;
            recruiters.phone = req.body.phone;
            recruiters.bio = req.body.bio;
            users.save()
            .then(() => {
                recruiters.save()
                .then(() => res.json("Successfully saved!!"))
                .catch(err => res.status(400).json('Error: ' + err));
            })
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Given usrid find job
router.route('/:id/jobs').get(auth, (req,res) => {
    if(req.user.id != req.params.id)
        return res.status(400).json({ msg: 'Not permitted' });
    console.log("View all jobs");
    Job.find({"recruiter": req.params.id})
    .then(jobs => res.json(jobs))
    .catch(err => res.status(400).json('Error: ' + err));
})

// Given usrid, update job details
router.route('/:id1/updatejob/:id2').post(auth, (req,res) => {
    if(req.user.id != req.params.id1)
        return res.status(400).json({ msg: 'Not permitted' });
    console.log('Update Job Details');
    Job.findById(req.params.id2)
    .then(jobs => {
        if(jobs.recruiter != req.user.id) return res.status(400).json({ msg: 'Not permitted' });
        jobs.title = req.body.title;
        jobs.max_applicants = req.body.max_applicants;
        jobs.max_positions = req.body.max_positions;
        jobs.posting_date = req.body.posting_date;
        jobs.type = req.body.type;
        jobs.duration = req.body.duration;
        jobs.skills = req.body.kills;
        jobs.deadline = req.body.deadline;
        jobs.recruiter = req.params.id1;
        jobs.salary = req.body.salary;
        jobs.save()
        .then(jobs => res.json("Successfully updated"))
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});


module.exports = router;


