
var express = require('express');
var router = express.Router();



router.post('/signup',  function(req, res) {
    res.sendStatus(200);
});


// Login
router.post('/login',  function(req, res) {
    res.sendStatus(200);
});


// Logout
router.get('/logout',  function(req, res) {
    res.sendStatus(200);
});


module.exports = router;
