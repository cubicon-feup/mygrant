var express = require('express');
var router = express.Router();
var db = require('../config/database');

var bcrypt = require('bcrypt');
const saltRounds = 10;

/*
 * Register a user
 **/
router.post('/signup', function(req, res) {
    bcrypt.hash(req.params.password, saltRounds, function(err, hash) {
        const query = 'INSERT QUERY';
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

router.get('/email-exists/:email', function(req, res) {
    console.log(req.params.email);
    res.status(200).json('emailExists: true');
});

module.exports = router;
