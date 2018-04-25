const express = require('express');
const router = express.Router();
const db = require('../config/database');

/*
 * api/countries/
 * GET a list of all countries
 */
router.get('/', function(req, res) {
    let query = 'SELECT * FROM country ORDER BY name ASC';
    db.any(query)
    .then(data =>  {
        res.status(200).json([data]);
    })
    .catch(error => {
        res.status(500).json({error});
    });
});

router.get('/as_options', function(req, res) {
    let query = "SELECT id as value, name as text, code FROM country ORDER BY id ASC";
    db.any(query)
    .then(data =>  {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json({error});
    });
});

module.exports = router;
