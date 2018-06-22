var express = require('express');
var router = express.Router();



/**
 * @api {get} /service_categories/ Get service categories.
 * @apiName GetServiceCategories
 * @apiGroup Service Categories
 *
 * @apiSuccess (Success 201) {String[]} service_category Service category name.
 * @apiError (Error 500) InternalServerError Couldn\'t get the service categories.
 */
router.get('/', function(req, res) {
    res.sendStatus(200);
});


module.exports = router;