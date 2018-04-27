var express = require('express');
var router = express.Router();
var db = require('../config/database');
var image = require('../images/Image');
const policy = require('../policies/crowdfundingsPolicy');

// CROWDFUNDING.
// ===============================================================================

/**
 * @api {post} /crowdfunding/ Creates a new crowdfunding project.
 * @apiName PostCrowdfunding
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestBody) {String} title
 * @apiParam (RequestBody) {String} description
 * @apiParam (RequestBody) {String} category
 * @apiParam (RequestBody) {String} location
 *
 * @apiSuccess (Success 201) {String} message Sucessfully created a crowdfunding project.
 * @apiError (Error 500) InternalServerError Couldn't create a crowdfunding.
 */
router.post('/', policy.valid, function(req, res) {
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let location = req.body.location;
    let mygrantTarget = req.body.mygrant_target;
    let dateFinished = req.body.date_finished;
    let creatorId = req.body.creator_id;
    let query =
        `INSERT INTO crowdfunding (title, description, category, location, mygrant_target, date_created, date_finished, status, creator_id)
        VALUES ($(title), $(description), $(category), $(location), $(mygrant_target), now(), now() + interval '1 week', COLLECTING, $(creator_id));`;

    db.none(query, {
        title: title,
        description: description,
        category: category,
        location: location,
        mygrant_target: mygrantTarget,
        creator_id: creatorId
    }).then(() => {
        res.status(201).send({message: 'Sucessfully created a crowdfunding project.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t create a crowdfunding.'});
    });
});

/**
 * @api {get} /crowdfunding/:crowdfunding_id Get crowdfunding project.
 * @apiName GetCrowdfunding
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 *
 * @apiSuccess (Success 200) {String} title
 * @apiSuccess (Success 200) {String} description
 * @apiSuccess (Success 200) {String} category
 * @apiSuccess (Success 200) {String} location
 * @apiSuccess (Success 200) {Integer} mygrant_target
 * @apiSuccess (Success 200) {Date} date_created
 * @apiSuccess (Success 200) {Date} date_finished
 * @apiSuccess (Success 200) {String} status
 * @apiSuccess (Success 200) {Integer} creator_id
 * @apiSuccess (Success 200) {String} creator_name
 * @apiSuccess (Success 200) {Integer} creator_id
 * @apiSuccess (Success 200) {Integer} average_rating
 * @apiSuccess (Success 200) {Array} images
 * 
 * @apiError (Error 500) InternalServerError Could't get the crowdfunding.
 */
router.get('/:crowdfunding_id', function(req, res) {
    let id = req.params.crowdfunding_id;
    let query =
        `SELECT title, description, category, location, mygrant_target, date_created, date_finished, status, creator_id, users.full_name as creator_name, users.id as creator_id, ( SELECT avg (total_ratings.rating) as average_rating
            FROM (
                SELECT rating
                FROM crowdfunding_donation
                WHERE crowdfunding_id = $(id)
            ) as total_ratings), ARRAY( SELECT image_url FROM crowdfunding_image WHERE crowdfunding_id = $(id)) as images
        FROM crowdfunding
        INNER JOIN users ON users.id = crowdfunding.creator_id
        WHERE crowdfunding.id = $(id);`;

    db.one(query, {
        id: id
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Could\'t get the crowdfunding project.'});
    });
});

/**
 * @api {put} /crowdfunding/:crowdfunding_id Update crowdfunding.
 * @apiName UpdateCrowdfunding
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding project id.
 * @apiParam (RequestBody) {String} title
 * @apiParam (RequestBody) {String} description
 * @apiParam (RequestBody) {String} location
 *
 * @apiSuccess (Success 200) {String} message Successfully updated crowdfunding project.
 * 
 * @apiError (Error 500) InternalServerError Could't update the crowdfunding project.
 */
router.put('/:crowdfunding_id', function(req, res) {
    let id = req.params.crowdfunding_id;
    let title = req.body.title;
    let description = req.body.description;
    let location = req.body.location;
    let query =
        `UPDATE crowdfunding
        SET title = $(title),
            description = $(description),
            category = 'ARTS'::service_categories,
            location = $(location)
        WHERE id = $(id);`;

    db.none(query, {
        title: title,
        description: description,
        location: location,
        id: id
    }).then(() => {
        res.status(200).send({message: 'Successfully updated crowdfunding project.'});
    }).catch(error => {
        res.status(500).json({error: 'Could\'t update the crowdfunding project.'});
    });
});

/**
 * @api {delete} /crowdfunding/:crowdfunding_id Delete crowdfunding.
 * @apiName DeleteCrowdfunding
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding project id.
 *
 * @apiSuccess (Success 200) {String} message Successfully deleted crowdfunding project.
 * 
 * @apiError (Error 500) InternalServerError Could't update the crowdfunding project.
 */
router.delete('/:crowdfunding_id', function(req, res) {
    let id = req.params.crowdfunding_id;
    let query =
        `DELETE FROM crowdfunding
        WHERE id = $(id);`;

    db.none(query, {
        id: id
    }).then(() => {
        res.status(200).send({message: 'Sucessfully deleted crowdfunding project.'});
    }).catch(error => {
        res.status(500).json({error: 'Could\'t update the crowdfunding project.'});
    });
});

/**
 * @api {get} /crowdfunding/:crowdfunding_id/rating Get crowdfunding average rating.
 * @apiName GetCrowdfundingAverageRating
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding project id.
 *
 * @apiSuccess (Success 200) {String} average_rating Crowdfunding average rating.
 * 
 * @apiError (Error 500) InternalServerError Could't update the crowdfunding project.
 */
router.get('/:crowdfunding_id/rating', function(req, res) {
    let id = req.params.crowdfunding_id;
    let query =
        `SELECT avg(total_ratings.rating) as average_rating
        FROM (
            SELECT rating
            FROM crowdfunding_donation
            WHERE crowdfunding_id = $(id)
        ) as total_ratings;`;

    db.one(query, {
        id: id
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    });
});

/**
 * @api {get} /crowdfunding/ Get all crowdfundings.
 * @apiName GetCrowdfundings
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiSuccess (Success 200) {String} title Crowdfunding average rating.
 * @apiSuccess (Success 200) {String} category Crowdfunding average rating.
 * @apiSuccess (Success 200) {String} location Crowdfunding average rating.
 * @apiSuccess (Success 200) {Integer} mygrant_target Crowdfunding average rating.
 * @apiSuccess (Success 200) {String} status Crowdfunding average rating.
 * @apiSuccess (Success 200) {String} creator_name Crowdfunding average rating.
 * @apiSuccess (Success 200) {Integer} creator_id Crowdfunding average rating.

 * @apiError (Error 500) InternalServerError Couldn't get crowdfundings.
 */
router.get('/', function(req, res) {
    let query =
        `SELECT title, category, location, mygrant_target, status, users.full_name as creator_name, users.id as creator_id
        FROM crowdfunding
        INNER JOIN users ON users.id = crowdfunding.creator_id;`;

    db.many(query)
    .then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get crowdfundings.'});
    });
});

// User donates to crowdfunding project.
router.post('/:crowdfunding_id/donations', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let donatorId = req.body.donator_id;
    let amount = req.body.amount;
    let query =
        `INSERT INTO crowdfunding_donation (crowdfunding_id, donator_id, amount, date_sent)
        VALUES ($(crowdfunding_id), $(donator_id), $(amount), now());`;

    db.none(query, {
        crowdfunding_id: crowdfundingId,
        donator_id: donatorId,
        amount: amount
    }).then(() => {
        res.status(201).send('Successfully donated to crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    });
});

// Gets all crowdfunding project's donations.
router.get('/:crowdfunding_id/donations', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT users.id as donator_id, full_name as donator_name, amount
        FROM crowdfunding_donation
        INNER JOIN users ON users.id = crowdfunding_donation.donator_id
        WHERE crowdfunding_id = $(crowdfunding_id);`;

    db.many(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Rate a crowdfunding project.
router.put('/:crowdfunding_id/rate', function(req, res) {
    let id = req.params.crowdfunding_id;
    let rating = req.body.rating;
    let crowdfundingId = req.body.crowdfunding_id;
    let donatorId = req.body.donator_id;
    let query =
        `UPDATE crowdfunding_donation
        SET rating = $(rating)
        WHERE crowdfunding_id = $(crowdfunding_id)
            AND donator_id = $(donator_id);`;

    db.none(query, {
        rating: rating,
        crowdfunding_id: crowdfundingId,
        donator_id: donatorId
    }).then(() => {
        res.status(200).send('Successfully rated the crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    });
});

router.post('/:crowdfunding_id/image', function(req, res) {
    let filename = image.uploadImage(req, res, 'crowdfunding/');
    if(filename !== false) {
        let crowdfundingId = req.params.crowdfunding_id;
        let query =
            `INSERT INTO crowdfunding_image (crowdfunding_id, filename)
            VALUES ($(crowdfunding_id), $(filename));`;

        db.none(query, {
            crowdfunding_id: crowdfundingId,
            filename: filename
        });
    }
});

router.delete('/:crowdfunding_id/image', function(req, res) {
    let removed = image.removeImage(req, res);
    if(removed) {
        let crowdfundingId = req.params.crowdfunding_id;
        let filename = req.body.filename;
        let query =
            `DELETE FROM crowdfunding_image
            WHERE crowdfunding_id = $(crowdfunding_id)
                AND filename = $(filename)`;

        db.none(query, {
            crowdfunding_id: crowdfundingId,
            filename: filename
        });
    }
});

// SERVICES OFFERS.
// ===============================================================================

// Service creator offers a service to the crowdfunding creator.
router.post('/:crowdfunding_id/services_offers', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let query =
        `INSERT INTO crowdfunding_offer (service_id, crowdfunding_id)
        VALUES ($(service_id), $(crowdfunding_id));`;

    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(201).send('Successfully offered a service to the crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Gets all the service offers for the crowdfunding.
router.get('/:crowdfunding_id/services_offers', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT service.id as service_id, service.title as service_title, service.category as service_category, service.service_type
        FROM service
        INNER JOIN crowdfunding_offer ON crowdfunding_offer.service_id = service.id
        WHERE crowdfunding_offer.crowdfunding_id = $(crowdfunding_id);`;

    db.many(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Deletes a service offer from the available offers.
router.delete('/:crowdfunding_id/services_offers', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let query =
        `DELETE FROM crowdfunding_offer
        WHERE service_id = $(service_id)
            AND crowdfunding_id = $(crowdfunding_id);`;

    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(200).send('Successfully deleted the service offer.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// SERVICE REQUESTED.
// ===============================================================================

// Create a new service request for the crowdfunding.
router.post('/:crowdfunding_id/services_requested', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let location = req.body.location;
    let acceptableRadius = req.body.acceptable_radius;
    let mygrantValue = req.body.mygrant_value;
    let query =
        `INSERT INTO service (title, description, category, location, acceptable_radius, mygrant_value, date_created, service_type, crowdfunding_id)
        VALUES ($(title), $(description), $(category), $(location), $(acceptable_radius), $(mygrant_value), now(), 'REQUEST', $(crowdfunding_id));`;

    db.none(query, {
        title: title,
        description: description,
        category: category,
        location: location,
        acceptable_radius: acceptableRadius,
        mygrant_value: mygrantValue,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(201).send('Successfully created a new service request for the crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Get all services requested for the crowdfunding.
router.get('/:crowdfunding_id/services_requested', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT title, mygrant_value, category
        FROM service
        WHERE service.crowdfunding_id = 1;`;

    db.many(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Deletes a service request from the services that the crowdfunding creator is looking to get.
router.delete('/:crowdfunding_id/services_requested', function(req, res) {
    let serviceId = req.body.service_id;
    let query =
        `DELETE FROM service
        WHERE id = $(service_id)`;

    db.none(query, {
        service_id: serviceId
    }).then(() => {
        res.status(200).send('Successfully removed the service.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// SERVICES ACCORDED
// ===============================================================================

// Select a service from the available offered ones. This service is then instantiated as an agreed service.
// FIXME: giving an error when trying out in Postman.
router.post('/:crowdfunding_id/services', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let partnerId = req.body.partner_id;
    //let dateScheduled = req.body.date_scheduled;    // Format: 'yyyy-mm-dd hh:m:ss'.
    let query =
        `INSERT INTO service_instance (service_id, partner_id, crowdfunding_id, date_agreed, date_scheduled)
        VALUES ($(service_id), $(partner_id), $(crowdfunding_id), now(), now() + interval '1 week');`;

    db.none(query, {
        service_id: serviceId,
        partner_id: partnerId,
        crowdfunding_id: crowdfundingId,
        //date_scheduled: dateScheduled
    }).then(() => {
        res.status(201).send('Successfully agreed with a service for the crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Gets all the services that were already agreed to happen.
// TODO: test.
router.get('/:crowdfunding_id/services', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT service_instance.service_id, service_instance.date_scheduled, service_instance.partner_id, service.title, service.mygrant_value, service.description, users.full_name as user_full_name
        FROM service_instance
        INNER JOIN service ON service.id = service_instance.service_id
        INNER JOIN users ON users.id = service_instance.partner_id
        WHERE service_instance.crowdfunding_id = $(crowdfunding_id);`;

    db.many(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Deletes a service that was agreed to happen.
// TODO: test.
// TODO: is this desired behaviour?
router.delete('/:crowdfunding_id/services', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let query =
        `DELETE FROM service_instance
        WHERE service_id = $(service_id)
            AND crowdfunding_id = $(crowdfunding_id);`;

    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(200).send('Successfully deleted the service instance');
    }).catch(error => {
        res.status(500).json({error});
    })
})

module.exports = router;
