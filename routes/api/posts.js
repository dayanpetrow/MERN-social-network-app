const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');

/*  
@route   GET api/posts/test
@desc    Tests post route
@access  Public 
*/
router.get('/test', (req, res) => res.json({msg: "Posts route works!"}));

/*  
@route   GET api/posts
@desc    Get posts
@access  Public
*/
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => {
            res.json(posts)
        })
        .catch(err => res.status(404).json(err));
});

/*  
@route   GET api/posts/:id
@desc    Get post by id
@access  Public
*/
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            res.json(post)
        })
        .catch(err => res.status(404).json(err));
});

/*  
@route   DELETE api/posts/:id
@desc    Delete post by id
@access  Private
*/
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    //check for owner
                    if(post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notAuthorized: "Action not authorized" });
                    }

                    //delete
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err => res.status(404).json({ postNotFound: 'No post found!'}));
        });
});


/*  
@route   POST api/posts
@desc    Create post
@access  Private
*/
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

/*  
@route   POST api/posts/like/:id
@desc    Like post
@access  Private
*/
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.status(400).json({ alreadyLiked: "Post is already liked!" });
                }

                //add user_id to like array
                post.likes.unshift({ user: req.user.id });

                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));
});

/*  
@route   POST api/posts/unlike/:id
@desc    Unlike post
@access  Private
*/
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
    .then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                    return res.status(400).json({ alreadyLiked: "Post is not yet liked!" });
                }

                //get remove index
                const removeIndex = post.likes.map(item => item.user.toString)
                    .indexOf(req.user.id);

                post.likes.splice(removeIndex, 1);

                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(404).json(err));
    }).catch(err => res.status(404).json(err));
});

module.exports = router;