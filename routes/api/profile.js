const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


//load models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

/*  
@route   GET api/profile/test
@desc    Tests profile route
@access  Public 
*/
router.get('/test', (req, res) => res.json({msg: "Profile route works!"}));

/*  
@route   GET api/profile
@desc    Return current user profile
@access  Private 
*/
router.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id }) //because it references the user model
        .then(profile => {
            if(!profile) {
                errors.noProfile = 'There is no profile for this user!'
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});



module.exports = router;