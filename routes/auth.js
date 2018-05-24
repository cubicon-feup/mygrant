const express = require('express');
const passport = require('../auth/local');
const router = express.Router();
const db = require('../config/database');
const appSecret = require('../config/config').secret;
const initialMygrantBalance = require('../config/config').initialMygrantBalance;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const expressJwt = require('express-jwt');
const authenticate = expressJwt({ secret: appSecret });

// Register a user
router.post('/signup', function(req, res) {

    // Check if there is already an account using the inserted email
    let query = 'SELECT EXISTS ( SELECT 1 FROM users WHERE email = $(email))';

    db.one(query, { email: req.body.email })
        .then(data => {
            // email already in use, abort
            if (data.exists) {
                res.status(409).send('Email already in use');
            } else {

                // Check if there is already an account using the inserted phone
                query = 'SELECT EXISTS ( SELECT 1 FROM users WHERE phone = $(phone))';
                db.one(query, { phone: req.body.phone })
                    .then(phoneData => {
                        if (phoneData.exists) {
                            res.status(409).send('Phone number already in use');
                        } else {

                            // register new user
                            bcrypt.hash(req.body.password, saltRounds, function(_err, hash) {

                                query = `INSERT INTO users (email, pass_hash, full_name, phone, mygrant_balance) 
                                VALUES ($(email), $(passHash), $(fullName), $(phone), $(initialMygrantBalance)) RETURNING id`;

                                db.one(query, {
                                    email: req.body.email,
                                    fullName: req.body.name,
                                    initialMygrantBalance,
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
                    // error on phone query - should not happen - check DB connection
                    .catch(phoneError => {
                        res.status(500).json({ phoneError });
                    });
            }
        })
        // error on email query - should not happen - check DB connection
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
                            const token = jwt.sign({ id: req.user.id }, appSecret);
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

// Logout
router.get('/logout', authenticate, function(req, res) {
    req.logout();
    res.sendStatus(200);
});

module.exports = router;

