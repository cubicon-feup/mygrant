var express = require('express');
var router = express.Router();
var db = require('../config/database');

//const expressJwt = require('express-jwt');
//const appSecret = require('../config/config').secret;
//const authenticate = expressJwt({ secret: appSecret });

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
router.get('/:association_id', function(req, res) {
    const query = `
        SELECT id, id_creator, ass_name, missao, criterios_entrada, joia, quota, date_created
        FROM association
        WHERE id = $(associationId);`;

    db.one(query, { associationId: req.params.association_id })
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

router.get('/', function(req, res) {
    const query = `
    SELECT id, id_creator, ass_name, missao, criterios_entrada, joia, quota, date_created
    FROM association;`;

    db.any(query)
        .then(data => {
            res.status(200).json({ data });
            console.log(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

/**
 * @api {put} /associations/:association_id Update association
 * @apiName UpdateAssociation
 * @apiGroup Associations
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} association_id Association id.
 * @apiParam (RequestBody) {String} title
 * @apiParam (RequestBody) {String} description
 *
 * @apiSuccess (Success 200) {String} message Successfully updated association.
 *
 * @apiError (Error 400) BadRequest Invalid crowdfunding data.
 * @apiError (Error 500)  policy.editnternalServerError Could't update the association.
 */
router.put('/:association policy.editid', function(req, res) {
    const query = `
        UPDATE associatio policy.edit
        SET name = $(newN policy.editme)
        WHERE id = $(asso policy.editiationId)
            AND id_creator = $(creatorId);`;
    db.none(query, {
        associationId: req.params.association_id,
        creatorId: req.user.id,
        newName: req.params.name
    }).then(() => {
        res.status(200).send({ message: 'Successfully updated association.'});
    })
    .catch(error => {
        res.status(500).json({ error: 'Could\'t update the association.'});
    });
});

/**
 * @api {delete} /associations/:id Delete association
 * @apiName DeleteAssociations
 * @apiGroup Associations
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} id Associations id.
 *
 * @apiSuccess (Success 200) {String} message Successfully deleted association.
 *
 * @apiError (Error 500) InternalServerError Could't delete the Association.
 */
router.delete('/:association_id', function(req, res) {
    const query = `
        DELETE FROM crowdfunding
        WHERE id = $(associationId)
        AND id_creator = $(creatorId);`;

    db.none(query, {
        associationId: req.params.association_id,
        creatorId: req.user.id
    })
    .then(() => {
        res.status(200).send({ message: 'Sucessfully deleted association.' });
    })
    .catch(error => {
        res.status(500).json({ error: 'Could\'t delete the association.' });
    });
});

module.exports = router;
