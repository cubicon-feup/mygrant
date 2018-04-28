const express = require('express');
const router = express.Router();
const expressJwt = require('express-jwt');
const db = require('../config/database');

const authenticate = expressJwt({ secret: 'carbonbytunicgym' });

// Get a list of all countries
router.get('/', function(req, res) {
    const query = 'SELECT * FROM country ORDER BY name ASC';
    db.any(query)
        .then(data => {
            res.status(200).json([data]);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Get a list of countries with the correct names to appear as options in the client
router.get('/as_options', authenticate, function(req, res) {
    const query = 'SELECT id as value, name as text, code FROM country ORDER BY id ASC';
    db.any(query)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = router;
