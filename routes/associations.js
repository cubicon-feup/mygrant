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

/**
 * @api {get} / Get associations
 * @apiName getAssociations
 * @apiGroup Associations
 *
 * @apiSuccess (Success 200) {Integer} association_id Association id.
 * @apiSuccess (Success 200) {Text} association_name Association name.
 * @apiSuccess (Success 200) {Text} association_description Association description.
 *
 * @apiError (Error 500) InternalServerError
 */
router.get('/', function(req, res) {
    const query = `
    SELECT id, id_creator, ass_name, missao, criterios_entrada, joia, quota, date_created
    FROM association;`;

    db.any(query)
        .then(data => {
            res.status(200).json({ data });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

/**
 * @api {post} /associations/:association_id Create association
 * @apiName CreateAssociation
 * @apiGroup Associations
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} association_id Association id.
 * @apiParam (RequestBody) {String} title
 * @apiParam (RequestBody) {String} description
 *
 * @apiSuccess (Success 200) {String} message Successfully created association.
 *
 * @apiError (Error 400) BadRequest Invalid association data.
 * @apiError (Error 500)  policy.editnternalServerError Could't create the association.
 */
router.post('/simpleassociation', function(req, res) {
    const query = ` INSERT INTO association(id_creator,ass_name)
                        VALUES ($(idCreator), $(assName));`;

    db.one(query, {
        assName: req.body.associationName,
        idCreator: req.body.creatorId
    }).then(data => {
        const associationId = data.id;
        res.status(201).send({ id: associationId });
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
 * @apiError (Error 400) BadRequest Invalid association data.
 * @apiError (Error 500)  policy.editnternalServerError Could't update the association.
 */
router.put('/:association_id', function(req, res) {
    const query = `
        UPDATE association policy.edit
        SET name = $(newN policy.editme)
        WHERE id = $(asso policy.editiationId)
            AND id_creator = $(creatorId);`;
    db.none(query, {
        associationId: req.params.association_id,
        creatorId: req.user.id,
        newName: req.params.name
    }).then(() => {
        res.status(200).send({ message: 'Successfully updated association.' });
    })
    .catch(error => {
        res.status(500).json({ error });
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
        res.status(500).json({ error });
    });
});

router.post('/createassociation', function(req, res) {
    let associationName = req.body.associationName;
    let acceptanceCriteria = req.body.acceptanceCriteria;
    let mission = req.body.mission;
    let initialFee = req.body.initialFee;
    let monthlyFee = req.body.monthlyFee;
    let creatorId = req.user.id;

    // console.log(req.body);

    let query =
        `INSERT INTO association (id_creator, ass_name, missao, criterios_entrada, joia, quota)
        VALUES ($(creatorId), $(associationName), $(mission), $(acceptanceCriteria), $(initialFee), $(monthlyFee))
        RETURNING id`;

    db.one(query, {
        associationName: associationName,
        acceptanceCriteria: acceptanceCriteria,
        mission: mission,
        initialFee: initialFee,
        monthlyFee: monthlyFee,
        creatorId: creatorId
    }).then(data => {
        let associationId = data.id;
        res.status(201).send({ id: associationId });
    }).catch(error => {
        // console.log(error);
        res.status(500).json({ error });
    });
});

module.exports = router;
