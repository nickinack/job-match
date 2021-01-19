const router = require('express').Router();
let Job = require('../models/job.model');
let Application = require('../models/application.model');
let Recruiter = require('../models/recruiter.model');
let Applicant = require('../models/applicant.model');
let User = require('../models/user.model');
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');


router.route('/viewall').post((req,res) => {
    if(!req.body.token) res.send('1');
    console.log('In jobs viewall');
    Job.find()
    .then(jobs => {
        const job_len = jobs.length;
        var job_rec = [];
        for(var i = 0 ; i < job_len ; i++)
        {
            job_rec.push(jobs[i].recruiter);
        }
        Recruiter.find({usrid: {$in: job_rec}})
        .then(recruiters => res.send({recruiters , jobs}))
        .catch(err => res.send('Error: ' + err));
    })
    .catch(err => res.send('Error: ' + err));
});

router.route('/viewsome').post((req,res) => {
    if(!req.body.token) res.send('1');
    console.log('In jobs viewall');
    Job.find({_id: {$in: req.body.jobarr}})
    .then(jobs => {
        const job_len = jobs.length;
        var job_rec = [];
        for(var i = 0 ; i < job_len ; i++)
        {
            job_rec.push(jobs[i].recruiter);
        }
        Recruiter.find({usrid: {$in: job_rec}})
        .then(recruiters => res.send({recruiters , jobs}))
        .catch(err => res.send('Error: ' + err));
    })
    .catch(err => res.send('Error: ' + err));
});

// Add a job
router.route('/add').post((req,res) => {
    
    if(!req.body.token) return res.send('Not permitted');
    const user = jwt.verify(req.body.token , 'nickinack');
    console.log(user);
    const title = req.body.title;
    const max_applicants = req.body.max_applicants;
    const max_positions = req.body.max_positions;
    const recruiter = req.body.recruiter;
    const deadline = req.body.deadline;
    const skills = req.body.skills;
    const type = req.body.type;
    const duration = req.body.duration;
    const posting_date = req.body.posting_date;
    const salary = req.body.salary;

    if(!title || !max_applicants || !recruiter || !deadline || !skills || !type || !salary)
        return res.send('Enter the details properly');


    Recruiter.findOne({usrid: recruiter})
    .then(recruiters => {
        if(!recruiters || recruiter != user.id) {
        console.log(recruiter , user.id);
        return res.send('Not a recruiter!');
        }
        const newJob = new Job({salary,title,max_applicants,max_positions,recruiter,deadline,skills,type,duration,posting_date});
        newJob.save()
        .then(() => res.send('1'))
        .catch(err => res.send('Error: ' + err));
    })
    .catch(err => res.send('Error: ' + err));
    
});

// Given Job iD, update the job
router.route('/update/:id').post((req,res) => {
    const user = jwt.verify(req.body.token , 'nickinack');
    console.log('Job Updation');
    Job.findOne({"_id": req.params.id})
    .then(jobs => {
        if(user.id != jobs.recruiter) return res.send('1');
        Application.find({job: req.params.id})
        .then(applications => {
            if(applications.length != 0)
            {
                var max_positions = 0;

                if(applicants.length > req.body.max_applicants)
                {
                    return res.send('2');
                }

                for(var i = 0 ; i < applications.length ; i++)
                {
                    if(applications[i].accept == 2)
                    {
                        max_positions = max_positions + 1;
                    }
                }
                if(max_positions > req.body.max_positions)
                {
                    return res.send('3');
                }

            }
            Job.updateOne({"_id": req.params.id} , {$set: {"max_applicants": req.body.max_applicants, "max_positions": req.body.max_positions, "deadline": req.params.deadline}})
            .then(jobs => res.send('Successfully updated!'))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
        
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Look into a job
router.route('/:id').get((req,res) => {
    console.log('View job by id');                                         
    Job.findById(req.params.id)
    .then(jobs => res.json(jobs))
    .catch(err => res.status(400).json('Error: ' + err));
});

// Delete a job
router.route('/delete/:id').post((req,res) => {
    const user = jwt.verify(req.body.token , 'nickinack');
    console.log('Delete job by id');
    Job.findById(req.params.id)
    .then(jobs => {
        if(jobs.recruiter != user.id) return res.send('1');
        Application.deleteMany({job: req.params.id})
        .then(() => {
            console.log("Delete applications associated with the job");
            Job.findByIdAndDelete(req.params.id)
            .then(() => res.send('Successfully Deleted'))
            .catch(err => res.status(400).json('Error: ' + err));
        })
        .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

// Look at all the applications and user details for a job
router.route('/:id/applications').post((req,res) => {
    console.log('View all applications for a job');
    const user = jwt.verify(req.body.token , 'nickinack');
    Job.findById(req.params.id)
    .then(jobs => {
        if(!jobs) {
            console.log('No such job');
            return res.send('1');
        } 
        if(jobs.recruiter != user.id) {
            console.log(user.id , jobs.recruiter);
            return res.send('1');
        } 
        Application.find({"job" : req.params.id})
        .then(applications => {
            var applicantids = [];
            const len = applications.length;
            for(var i = 0 ; i < len ; i++)
            {
                applicantids.push(applications[i].applicant);
            } 
            Applicant.find({usrid: {$in: applicantids}})
            .then(applicants => {
                User.find({_id: {$in: applicantids}})
                .then(users => {
                    res.send({applications , applicants , users});
                })
                .catch(err => res.send('Error: ' + err));
            })
            .catch(err => res.send('Error: ' + err));
        })
        .catch(err => res.send('Error: ' + err));
    })
    .catch(err => res.send('Error: ' + err));  
});

// Recruiter application update 
router.route('/updateapplication/:id').post((req,res) => {
    const user = jwt.verify(req.body.token , 'nickinack');
    console.log('Update Application Details');
    Application.findById(req.params.id)
    .then(applications => {
        Job.findById(applications.job)
        .then(jobs => {
            if(jobs.recruiter != user.id)  return res.send('1');
            Application.find({'job': jobs._id , 'accept': 2})
            .then(result => {
                console.log(result);
                if(result.length >= jobs.max_positions-1 && req.body.accept == 2) {
                    Application.updateOne({"_id": req.params.id}, {$set: {"accept" : req.body.accept}})
                    .then(results => {
                        Application.updateOne({"job": jobs._id , "accept": {"$in": ['0' , '1']}}, {$set: {"accept" : 3}})
                        .then(results => {
                            Job.updateOne({"_id": jobs.id} , {"$set": {"active": 2}})
                            .then(jobUpdate => res.send('Successful'))
                            .catch(err => res.send('Error: ' + err));
                        })
                        .catch(err => res.send('Error: ' + err));
                    });
                    
                }
                else {
                Application.updateOne({"_id": req.params.id}, {$set: {"accept" : req.body.accept}})
                .then(result => res.send('Successful!'))
                .catch(err => res.send('Error: ' + err));
                }

            })
            .catch(err => res.send('Error: ' + err));
        })
        .catch(err => res.send('Error: ' + err));
    })
    .catch(err => res.send('Error: ' + err));
});

// Update ratings for a job
router.route('/updateratings/:id').post((req,res) => {

    const user = jwt.verify(req.body.token , 'nickinack');
    Applicant.findOne({"usrid": user.id})
    .then(applicant => {
        if(!applicant) return res.send('1');
        Job.findById(req.params.id)
        .then(job => {
            const len = job.appRated.length;
            if(len != 0)
            {
                for(var i = 0 ; i < len ; i++)
                {
                    if(user.id === job.appRated[i])
                    {
                        return res.send('2');
                    }
                }
            }
            const new_rating = ((len)*job.rating + req.body.rating)/(len+1);
            Job.updateOne({"_id": req.params.id} , { $set: {"rating" : new_rating }  ,  $addToSet: {"appRated": user.id} }  )
            .then(jobUpdate => res.send('Successfully rated'))
            .catch(err => res.send('Error: ' + err));
        })
        .catch(err => res.send('Error: ' + err));
    })
    .catch(err => res.send('Error: ' + err));
});

module.exports = router;