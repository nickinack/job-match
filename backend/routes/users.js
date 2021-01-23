const router = require('express').Router();
let Applicant = require('../models/applicant.model');
let Recruiter = require('../models/recruiter.model');
let User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
var multer = require('multer')
var cors = require('cors');
var express = require('express');
var app = express();
app.use(cors())
require('./config')


router.route('/register').post((req , res) => {

    if(req.body.type === "Applicant"){
        console.log("Add applicant")
        const type = "Applicant";
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        var rating = req.body.rating;
        const education = req.body.education;
        const languages = req.body.languages;
        const skills = req.body.skills;
        var resume = 0;
        if(!req.body.resume)
            resume = 0;
        if(req.body.resume)
            resume = 1;

        if(!rating){
            rating = Number(0);
        }

        // Check if all fields have been entered correctly
        if(!name || !email || !password)
            return res.send('0');


        // Check if start date is lesser than end date
        if(education){
            for(var i = 0 ; i < education.length ; i++)
            {
                if(isNaN(Number(education[i].start_year)) ||  isNaN(Number(education[i].end_year))){
                    return res.send('1');
                }
                if(Number(education[i].start_year >= Number(education[i].end_year)))
                    return res.send('2');

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
                    const newApplicant = new Applicant({usrid, rating , education , skills , languages , resume});
                    console.log(newApplicant);
                    newApplicant.save()
                    .then(applicant => {
                        console.log(); 
                        res.send(applicant);

                    })
                    .catch(err => res.send('Error: ' + err));
                    })        
                })
                .catch(err => res.send('Error: ' + err));
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
            return res.send({ msg: 'Please enter all details properly' })

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
                        .then(recruiters => res.send('1'))
                        .catch(err => res.send('Error: ' + err));
                    })
                })
                .catch(err => res.send('Error: ' + err));
            })
        })
    }

    else{
        return res.status(400).json({ msg: 'Wrong type (Applicant/Recruiter) only'} );
    }
});

// Given usrid, find recruiter
router.route('/login').post((req , res) => {
    console.log('Logging done');
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user) return res.send({msg: 'User does not exist'});
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(!isMatch) res.send({msg: 'Wrong password'});
                jwt.sign({id: user.id} , 'nickinack' , {expiresIn: 3600}, (err , token) => {
                    if(err) throw err;
                    res.json({token,user});
                })
            })
        .catch(err => res.send('Error: ' + err));
        
    });
});


router.route('/decode').post((req , res) => {
    console.log('Decoding in progress');
    try{
    res.send(jwt.verify(req.body.token , 'nickinack'))
    }
    catch(e) {
        res.send(e);
    }
});


router.route('/uploadresume/:id').post((req , res) => {


    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, '../public')
    },
    filename: function (req, file, cb) {
        cb(null, req.params.id+'.pdf')
    }
    })
    var upload = multer({ storage: storage }).single('file')

    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.send('Upload Error')
        } else if (err) {
            return res.send('Upload error')
        }
        return res.send(req.file)
    })

});

module.exports = router;