var express = require('express');
var router = express.Router();
var db = require('../config/database');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/*
 * Register a user
 */
router.post('/signup', function(req, res) {

    // Check if there is already an account using the inserted email
    let query = 'SELECT EXISTS ( SELECT * FROM users WHERE email = $(email))';

    db.one(query, {email: req.body.email})
        .then(data => {
            if (data.exists) { // email already in use, abort
                res.status(409).send("Email already in use");
            } else { // register new user 
                bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                    query = 'INSERT INTO users (email, pass_hash, full_name, phone) VALUES ($(email), $(hash), $(full_name), $(phone)) RETURNING id';
                    db.one(query, {
                        email: req.body.email,
                        hash: hash,
                        full_name: req.body.name,
                        phone: req.body.phone
                    }).then(data => {
                        res.status(201).send('Sucessfully added user');
                    }).catch(err => {
                        res.status(500).json({err});
                    });
                });
            }
        }).catch(err => {
            res.status(500).json({err});
        });
});


/*
 * Login
 */
router.post('/login', function(req, res) {
    // Get password from db
    let query = 'SELECT pass_hash FROM users where email = $(email)'

    db.one(query, {email: req.body.email})
        .then(data => {
            bcrypt.compare(req.body.password, data.pass_hash, function(res){
                if(res) { // password matches
                    res.status(200).send('Logged in');
                } else {  // password doesn't match
                    res.status(400).json({error: 'Invalid email or password'});
                }
            })
        }).catch(err => {
            res.status(500).json({err});
        });
});

module.exports = router;

