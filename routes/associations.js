var express = require('express');
var router = express.Router();
var db = require('../config/database');

router.get('/:id', function(req, res) {
    const query = `
        SELECT id, name, description
        FROM association
        WHERE id = $(associationId)`;

    db.one(query, { associationId: req.params.id })
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = router;
