var express = require('express');
var router = express.Router();
var db = require('../config/database');

var bcrypt = require('bcrypt');
const saltRounds = 10;

// Register a user
router.post('/signup', function(req, res) {

    // Check if there is already an account using the inserted email
    let query = 'SELECT EXISTS ( SELECT * FROM users WHERE email = $(email))';

    db.one(query, { email: req.body.email })
        .then(data => {
            // email already in use, abort
            if (data.exists) {
                res.status(409).send('Email already in use');
            } else {
                // register new user +
                bcrypt.hash(req.body.password, saltRounds, function(_err, hash) {
                    query = 'INSERT INTO users (email, pass_hash, full_name, phone) VALUES ($(email), $(passHash), $(fullName), $(phone)) RETURNING id';
                    db.one(query, {
                        email: req.body.email,
                        fullName: req.body.name,
                        passHash: hash,
                        phone: req.body.phone
                    }
                    ).then(() => {
                        res.status(201).send('Sucessfully added user');
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json({ err });
        });
});


// Login
router.post('/login', function(req, res) {

    // Get password from db
    const query = 'SELECT pass_hash FROM users where email = $(email)';

    db.one(query, { email: req.body.email })
        .then(data => {
            bcrypt.compare(req.body.password, data.pass_hash, function(_err, result) {
                if (result) {
                    // password matches
                    res.status(200).send('Logged in');
                } else {
                    // password doesn't match
                    res.status(400).json({ error: 'Invalid email or password' });
                }
            });
        })

        // Query error - no user with that email
        .catch(() => {
            res.status(400).json({ error: 'Invalid email or password' });
        });
});

module.exports = router;

