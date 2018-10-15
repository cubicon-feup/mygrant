var express = require('express');
var router = express.Router();
var db = require('../config/database');

/**
 * @api {get} /service_categories/ Get service categories.
 * @apiName GetServiceCategories
 * @apiGroup Service Categories
 * 
 * @apiSuccess (Success 201) {String[]} service_category Service category name.
 * @apiError (Error 500) InternalServerError Couldn\'t get the service categories.
 */
router.get('/', function(req, res) {
    let query =
        `SELECT unnest(enum_range(NULL::service_categories)) as service_category;`;
    
    db.many(query)
    .then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get the service categories.'});
    });
})

module.exports = router;