var express = require('express');
var router = express.Router();
var db = require('../config/database');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/*
 * Register a user
 **/
router.post('/signup', function(req, res) {

    let query = 'SELECT EXISTS ( SELECT * FROM users WHERE email = $(email))';
    db.one(query, {email: req.body.email})
    .then(data => {
        console.log(data);
        if (data.exists) {
            res.status(409).end();
            return;
        }
    }).catch(err => {
        res.status(500).json({err});
    });

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
});

/*
 * Login
 **/
router.post('/login', function(req, res) {
    // Get password from db
    
    // result should be res == true
    //bcrypt.compare(req.params.password, hashedPass, function(err, res) {
    //});
});

function isRepeatedEmail(email) {
}

module.exports = router;

