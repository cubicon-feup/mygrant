const express = require('express');
const passport = require('../auth/local');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
                // register new user
                bcrypt.hash(req.body.password, saltRounds, function(_err, hash) {
                    query = 'INSERT INTO users (email, pass_hash, full_name, phone) VALUES ($(email), $(passHash), $(fullName), $(phone)) RETURNING id';

                    db.one(query, {
                        email: req.body.email,
                        fullName: req.body.name,
                        passHash: hash,
                        phone: req.body.phone
                    })
                        .then(() => {
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
    passport.authenticate('local', (err, user) => {
        if (err) {
            res.status(500).send('error');
        }
        if (user) {
            req.logIn(user, function(error) {
                if (error) {
                    res.status(500).send('error');
                } else {
                    req.session.save(sessionErr => {
                        if (sessionErr) {
                            res.status(500).send('error');
                        } else {
                            const token = jwt.sign({ id: req.user.id }, 'carbonbytunicgym');
                            res.status(200)
                                .json({
                                    token,
                                    user: req.user
                                });
                        }
                    });
                }
            });
        } else {
            res.status(400).json({ error: 'Invalid email or password' });
        }
    })(req, res);
});

module.exports = router;

