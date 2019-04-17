const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

/*  
@route   GET api/profile/test
@desc    Tests profile route
@access  Public 
*/
router.get('/test', (req, res) => res.json({msg: "Profile route works!"}));

/*  
@route   GET api/profile/all
@desc    Get all profiles
@access  Public
*/
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if(!profiles) {
                errors.noProfile = 'There are no profiles!';
                return res.status(404).json(errors);
            }
            res.json(profiles);
        })
        .catch(err => {
            errors.noProfile = 'There are no profiles!';
            res.status(404).json(errors);
        });
});


/*  
@route   GET api/profile/handle/:handle
@desc    Get profile by handle
@access  Public
*/
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'There is no profile for this user!';
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => {
            errors.noProfile = 'There is no profile for this user!';
            res.status(404).json(errors);
        });
});

/*  
@route   GET api/profile/user/:user_id
@desc    Get profile by user ID
@access  Public
*/
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'There is no profile for this user!';
                res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => {
            errors.noProfile = 'There is no profile for this user!';
            res.status(404).json(errors);
        });
});

/*  
@route   GET api/profile
@desc    Return current user profile
@access  Private 
*/
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id }) //because it references the user model
        .populate('user', ['name', 'avatar']) //include the user data in the response
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'There is no profile for this user!'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

/*  
@route   POST api/profile/
@desc    Create or update user profile
@access  Private 
*/
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    // get fields
    const profileFields = {};
    profileFields.user = req.user.id; //model reference
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubUsername) profileFields.githubUsername = req.body.githubUsername;
    //skills = split into an array
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }
    //social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            if(profile) {
                //update profile because it exists
                Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    {$set: profileFields }, 
                    { new: true }
                ).then(profile => res.json(profile));
            } else {
                //create profile

                //check if handle exists
                Profile.findOne({ handle: profileFields.handle })
                    .then(profile => {
                        if(profile) {
                            errors.handle = "That handle already exists!";
                            res.status(400).json(errors);
                        }

                        //save profile
                        new Profile(profileFields).save()
                            .then(profile => res.json(profile));

                    });
            }
        });
});

/*  
@route   POST api/profile/experience
@desc    Add experience to profile
@access  Private 
*/
router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExperience = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                current: req.body.current,
                description: req.body.description
            }

            //add to experience array
            profile.experience.unshift(newExperience);
            profile.save().then(profile => res.json(profile));
        })
});

/*  
@route   POST api/profile/experience
@desc    Add education to profile
@access  Private 
*/
router.post('/education', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEducation = {
                school: req.body.school,
                degree: req.body.degree,
                fieldOfStudy: req.body.fieldOfStudy,
                fromDate: req.body.fromDate,
                toDate: req.body.toDate,
                current: req.body.current,
                description: req.body.description
            }

            //add to education array
            profile.education.unshift(newEducation);
            profile.save().then(profile => res.json(profile));
        })
});

/*  
@route   DELETE api/profile/experience/:exp_id
@desc    Delete experience section from profile
@access  Private 
*/
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        const removeIndex = profile.experience
            .map(item => item.id)
            .indexOf(req.params.exp_id);

        //splice
        profile.experience.splice(removeIndex, 1);

        //save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

/*  
@route   DELETE api/profile/education/:edu_id
@desc    Delete education section from profile
@access  Private 
*/
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        const removeIndex = profile.education
            .map(item => item.id)
            .indexOf(req.params.edu_id);

        //splice
        profile.education.splice(removeIndex, 1);

        //save
        profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json(err));
});

/*  
@route   DELETE api/profile
@desc    Delete user and profile
@access  Private 
*/
router.delete('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id })
    .then(() => {
        User.findOneAndRemove({ _id: req.user.id})
            .then(() => res.json({ success: true }));
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;