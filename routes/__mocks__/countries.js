const express = require('express');
const router = express.Router();


// Get a list of all countries
router.get('/', function(req, res) {
    res.sendStatus(200);
});
// Get a list of countries with the correct names to appear as options in the client
router.get('/as_options', function(req, res) {
    res.sendStatus(200);
});

module.exports = router;
