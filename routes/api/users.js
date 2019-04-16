//authentication file
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//load model
const User = require('../../models/User');

/*  
@route   GET api/users/test
@desc    Tests users route
@access  Public 
*/
router.get('/test', (req, res) => res.json({msg: "Users route works!"}));

/*  
@route   POST api/users/register
@desc    Register a user
@access  Public 
*/
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                errors.email = "Email already exists!"
                return res.status(400).json(errors);
            } else {
                //get a gravatar associated to the email or return a default image
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm' //default image
                });

                //create the user object
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar: avatar,
                    password: req.body.password
                });

                //hash the password and save the user to the db
                bcrypt.genSalt(10, (salt_error, salt) => {
                    if(salt_error) throw salt_error;
                    bcrypt.hash(newUser.password, salt, (hash_error, hash) => {
                        if(hash_error) throw hash_error;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(save_error => console.log(save_error));
                    })
                });
            }
        }) 
});

/*  
@route   POST api/users/register
@desc    Login user / Return JWT 
@access  Public 
*/
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    //check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //find the user by email
    User.findOne({ email })
        .then(user => {
            //check for user
            if(!user) {
                errors.email = "User not found!"
                return res.status(404).json(errors);
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        //user matched

                        const payload = { //jwt payload
                            id: user.id,
                            name: user.name,
                            avatar: user.avatar
                        };

                        //sign token
                        jwt.sign(
                            payload, 
                            keys.jwtSecretOrKey, 
                            { expiresIn: 3600 }, 
                            (error, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            }
                        );

                    } else {
                        errors.password = "Password is incorrect!"
                        return res.status(400).json(password);
                    }
                });
        });
});

/*  
@route   GET api/users/current
@desc    Return current user and just an example for a protected route
@access  Private 
*/
router.get('/current', passport.authenticate('jwt', { session: false } ), (req, res) => {
    res.json(req.user);
});


module.exports = router;