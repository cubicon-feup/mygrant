var express = require('express');
var router = express.Router();
var db = require('../config/database');

/**
 * @api {get} /associations/:id Get association
 * @apiName getAssociation
 * @apiGroup Associations
 *
 * @apiParam (RequestBody) {Integer} id Association id.
 *
 * @apiSuccess (Success 200) {Integer} association_id Association id.
 * @apiSuccess (Success 200) {Text} association_name Association name.
 * @apiSuccess (Success 200) {Text} association_description Association description.
 *
 * @apiError (Error 500) InternalServerError
 */
router.get('/:id', function(req, res) {
    const query = `
        SELECT id, id_creator, ass_name, missao, criterios_entrada, joia, quota
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
