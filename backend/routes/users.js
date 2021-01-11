const router = require('express').Router();
let Applicant = require('../models/applicant.model');
let Recruiter = require('../models/recruiter.model');
let User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');


router.route('/register').post((req , res) => {

    if(req.body.type === "Applicant"){
        console.log("Add applicant")

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        var rating = Number(req.body.rating);
        const education = req.body.education;
        const languages = req.body.languages;
        const skills = req.body.skills;
        const type = "Applicant";

        if(!rating)
            rating = Number(0);

        // Check if all fields have been entered correctly
        if(!name || !email || !password)
            return res.status(400).json({ msg: 'Please enter all the fields properly' });

        // Check if start date is lesser than end date
        if(education){
            for(var i = 0 ; i < education.length ; i++)
            {
                if(Number(education[i].start_year >= Number(education[i].end_year)))
                    return res.status(400).json({ msg: 'Please enter date fields properly' });
            }
        }
        
        const newUser = new User({name,email,password,type});
        console.log('Created');
        
        //Generate salt
        bcrypt.genSalt(10, (err,salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => {
                    jwt.sign({id: user.id} , 'nickinack' , {expiresIn: 3600}, (err , token) => {
                    const usrid = user._id;
                    const newApplicant = new Applicant({usrid, rating , education , skills , languages});
                    console.log(newApplicant);
                    newApplicant.save()
                    .then(applicant => {console.log('created');res.json({token, applicant});})
                    .catch(err => res.status(400).json('Error: ' + err));
                    })        
                })
                .catch(err => res.status(400).json('Error: ' + err));
                })
        }) 
        
    }

    else if(req.body.type === "Recruiter"){
        console.log("Add Recruiter")

        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone;
        const bio = req.body.bio;
        const type = "Recruiter";

        if(!name || !email || !password || !bio || !phone)
            return res.status(400).json({ msg: 'Please enter all details properly' })

        const newUser = new User({name,email,password,type});

        bcrypt.genSalt(10, (err , salt) => {
            bcrypt.hash(newUser.password, salt, (err,hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user => {
                    jwt.sign({id: user.id} , 'nickinack' , {expiresIn: 3600}, (err , token) => {
                        const usrid = user._id;
                        const newRecruiter = new Recruiter({usrid, phone , bio});
                        newRecruiter.save()
                        .then(recruiters => res.json({token,recruiters}))
                        .catch(err => res.status(400).json('Error: ' + err));
                    })
                })
                .catch(err => res.status(400).json('Error: ' + err));
            })
        })
    }

    else{
        return res.status(400).json({ msg: 'Wrong type (Applicant/Recruiter) only'} );
    }
});

// Given usrid, find recruiter
router.route('/login').post((req , res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user) return res.status(400).json({msg: 'User does not exist'});
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(!isMatch) res.status(400).json({msg: 'Wrong password'});
                jwt.sign({id: user.id} , 'nickinack' , {expiresIn: 3600}, (err , token) => {
                    if(err) throw err;
                    res.json({token,user})
                })
            })
        .catch(err => res.status(400).json('Error: ' + err));
        
    });
});
module.exports = router;