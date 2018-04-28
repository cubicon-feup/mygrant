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
 * @apiParam (RequestBody) {String} title Crowdfunding title.
 * @apiParam (RequestBody) {String} description Crowdfunding description.
 * @apiParam (RequestBody) {String} category Crowdfunding category.
 * @apiParam (RequestBody) {String} location Location where the crowdfunding is going to take place.
 * @apiParam (RequestBody) {Integer} mygrant_target Number of mygrants needed for the crowdfunding to success.
 * @apiParam (RequestBody) {Integer} time_interval Number of week to collect donators.
 * @apiParam (RequestBody) {Integer} creator_id Creator user id.
 *
 * @apiSuccess (Success 201) {String} message Sucessfully created a crowdfunding project.
 * 
 * @apiError (Error 400) BadRequest Invalid crowdfunding data.
 * @apiError (Error 500) InternalServerError Couldn't create a crowdfunding.
 */
router.post('/', policy.valid, function(req, res) {
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let location = req.body.location;
    let mygrantTarget = req.body.mygrant_target;
    let timeInterval = req.body.time_interval;
    let creatorId = req.body.creator_id;
    let query =
        `INSERT INTO crowdfunding (title, description, category, location, mygrant_target, date_created, date_finished, status, creator_id)
        VALUES ($(title), $(description), $(category), $(location), $(mygrant_target), NOW(), NOW() + INTERVAL '$(time_interval) week', 'COLLECTING', $(creator_id));`;

    db.none(query, {
        title: title,
        description: description,
        category: category,
        location: location,
        mygrant_target: mygrantTarget,
        time_interval: timeInterval,
        creator_id: creatorId
    }).then(() => {
        res.status(201).send({message: 'Sucessfully created a crowdfunding project.'});
    }).catch(error => {
        console.log(error)
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
 * @apiSuccess (Success 200) {String} title Crowdfunding title.
 * @apiSuccess (Success 200) {String} description Crowdfunding description.
 * @apiSuccess (Success 200) {String} category Crowdfunding category.
 * @apiSuccess (Success 200) {String} location Location where the crowdfunding is going to take place.
 * @apiSuccess (Success 200) {Integer} mygrant_target Number of mygrants needed for the crowdfunding to success.
 * @apiSuccess (Success 200) {Date} date_created Creation date.
 * @apiSuccess (Success 200) {Date} date_finished Close date.
 * @apiSuccess (Success 200) {String} status Current crowdfunding status. 
 * @apiSuccess (Success 200) {String} creator_name Creator user name.
 * @apiSuccess (Success 200) {Integer} creator_id Creator user id.
 * @apiSuccess (Success 200) {Integer} average_rating Average rating given by donators.
 * @apiSuccess (Success 200) {Array} images Array of images.
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
 *
 * @apiSuccess (Success 200) {String} message Successfully updated crowdfunding project.
 * 
 * @apiError (Error 400) BadRequest Invalid crowdfunding data.
 * @apiError (Error 500) InternalServerError Could't update the crowdfunding project.
 */
router.put('/:crowdfunding_id', policy.edit, function(req, res) {
    let id = req.params.crowdfunding_id;
    let title = req.body.title;
    let description = req.body.description;
    let query =
        `UPDATE crowdfunding
        SET title = $(title),
            description = $(description),
            category = 'ARTS'::service_categories
        WHERE id = $(id);`;

    db.none(query, {
        title: title,
        description: description,
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
        res.status(500).json({error: 'Could\'t delete the crowdfunding project.'});
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

/**
 * @api {post} /crowdfunding/:crowdfunding_id/donations Donate.
 * @apiName Donate
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 * @apiParam (RequestBody) {Integer} donator_id Donator user id.
 * @apiParam (RequestBody) {Integer} amount Number of mygrant to donate.
 * 
 * @apiSuccess (Success 201) {String} message Successfully donated to crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid donation data.
 * @apiError (Error 500) InternalServerError Couldn't donate.
 */
router.post('/:crowdfunding_id/donations', policy.donate, function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let donatorId = req.body.donator_id;
    let amount = req.body.amount;
    let query =
        `INSERT INTO crowdfunding_donation (crowdfunding_id, donator_id, amount, date_sent)
        VALUES ($(crowdfunding_id), $(donator_id), $(amount), NOW());`;

    db.none(query, {
        crowdfunding_id: crowdfundingId,
        donator_id: donatorId,
        amount: amount
    }).then(() => {
        res.status(201).send({message: 'Successfully donated to crowdfunding.'});
    }).catch(error => {
        res.status(500).json({error});
    });
});

/**
 * @api {get} /crowdfunding/:crowdfunding_id/donations Get donations.
 * @apiName GetDonations
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 * 
 * @apiSuccess (Success 200) {Integer} donator_id Donator user id.
 * @apiSuccess (Success 200) {String} donator_name Donator user name.
 * @apiSuccess (Success 200) {Integer} amount Number of mygrants donated.
 * 
 * @apiError (Error 500) InternalServerError Couldn't get donations.
 */
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
        res.status(500).json({error: 'Couldn\'t get donations'});
    })
});

/**
 * @api {put} /crowdfunding/:crowdfunding_id/rate Rate.
 * @apiName Rate
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 * @apiParam (RequestBody) {Integer} rating Donator user rating.
 * @apiParam (RequestBody) {Integer} donator_id Donator user id.
 * 
 * @apiSuccess (Success 200) {Integer} message Successfully rated the crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid rate data.
 * @apiError (Error 500) InternalServerError Couldn't get donations.
 */
router.put('/:crowdfunding_id/rate', policy.rate, function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let rating = req.body.rating;
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
        res.status(200).send({message: 'Successfully rated the crowdfunding.'});
    }).catch(error => {
        res.status(500).json({error});
    });
});

/*router.post('/:crowdfunding_id/image', function(req, res) {
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
});*/

// SERVICES OFFERS.
// ===============================================================================

/**
 * @api {post} /crowdfunding/:crowdfunding_id/services_offers Offer service to crowdfunding.
 * @apiName OfferService
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id that is offered the service.
 * @apiParam (RequestBody) {Integer} service_id Service id to offer.
 * 
 * @apiSuccess (Success 201) {Integer} message Successfully offered a service to the crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid service offer data.
 * @apiError (Error 500) InternalServerError Couldn't offer service.
 */
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
        res.status(201).send({message: 'Successfully offered a service to the crowdfunding.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t offer service.'});
    })
});

/**
 * @api {get} /crowdfunding/:crowdfunding_id/services_offers Get all crowdfunding service offers.
 * @apiName GetAllServiceOffer
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id that the services are offered.
 * 
 * @apiSuccess (Success 200) {Integer} service_id Offered service id.
 * @apiSuccess (Success 200) {String} service_title Offered service title.
 * @apiSuccess (Success 200) {String} service_category Offered service category.
 * @apiSuccess (Success 200) {String} service_type Offered service type.
 * 
 * @apiError (Error 500) InternalServerError Couldn't get service offers.
 */
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
        res.status(500).json({error: 'Couldn\'t get service offers.'});
    })
});

/**
 * @api {delete} /crowdfunding/:crowdfunding_id/services_offers Delete crowdfunding service offer.
 * @apiName DeleteServiceOffer
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id that the service is offered.
 * @apiParam (RequestBody) {Integer} service_id Service id to remove from the offers.
 * 
 * @apiSuccess (Success 200) {String} message Successfully deleted the service offer.
 * 
 * @apiError (Error 400) BadRequest Invalid service offer data.
 * @apiError (Error 500) InternalServerError Couldn't delete the service offer.
 */
router.delete('/:crowdfunding_id/services_offers', policy.offerService, function(req, res) {
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
        res.status(200).send({message: 'Successfully deleted the service offer.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t delete the service offer.'});
    })
});

// SERVICE REQUESTED.
// ===============================================================================

/**
 * @api {post} /crowdfunding/:crowdfunding_id/services_requested Create service request.
 * @apiName ServiceRequest
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id associated with the service request.
 * @apiParam (RequestBody) {Integer} title Request service title.
 * @apiParam (RequestBody) {Integer} description Request service description.
 * @apiParam (RequestBody) {Integer} category Request service category.
 * @apiParam (RequestBody) {Integer} location Location for the service to happen.
 * @apiParam (RequestBody) {Integer} acceptable_radius FIXME: To use?????.
 * @apiParam (RequestBody) {Integer} mygrant_value Mygrants amount to transfer.
 * 
 * @apiSuccess (Success 201) {String} message Successfully created a new service request for the crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid service request data.
 * @apiError (Error 500) InternalServerError Couldn\'t create a service request.
 */
router.post('/:crowdfunding_id/services_requested', policy.requestService, function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let location = req.body.location;
    let acceptableRadius = req.body.acceptable_radius;
    let mygrantValue = req.body.mygrant_value;
    let query =
        `INSERT INTO service (title, description, category, location, acceptable_radius, mygrant_value, date_created, service_type, crowdfunding_id)
        VALUES ($(title), $(description), $(category), $(location), $(acceptable_radius), $(mygrant_value), NOW(), 'REQUEST', $(crowdfunding_id));`;

    db.none(query, {
        title: title,
        description: description,
        category: category,
        location: location,
        acceptable_radius: acceptableRadius,
        mygrant_value: mygrantValue,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(201).send({message: 'Successfully created a new service request for the crowdfunding.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t create a service request.'});
    })
});

/**
 * @api {get} /crowdfunding/:crowdfunding_id/services_requested Get all service requests.
 * @apiName GetAllServiceRequests
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id associated with the service requests.
 * 
 * @apiSuccess (Success 200) {String} title Service request title.
 * @apiSuccess (Success 200) {Integer} mygrant_value Mygrants amount to transfer.
 * @apiSuccess (Success 200) {String} category Service request category.
 * 
 * @apiError (Error 500) InternalServerError Couldn't get service requests.
 */
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
        res.status(500).json({error: 'Couldn\'t get service requests.'});
    })
});

// Deletes a service request from the services that the crowdfunding creator is looking to get.
/**
 * @api {delete} /crowdfunding/:crowdfunding_id/services_requested Delete a service request.
 * @apiName DeleteServiceRequest
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id associated with the service requests.
 * @apiParam (RequestBody) {Integer} service_id Service request id.
 * 
 * @apiSuccess (Success 200) {String} message Successfully removed the service requested.
 * 
 * @apiError (Error 400) BadRequest Invalid service request data.
 * @apiError (Error 500) InternalServerError Couldn't get service requests.
 */
router.delete('/:crowdfunding_id/services_requested', policy.deleteRequestService, function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let query =
        `DELETE FROM service
        WHERE id = $(service_id)
            AND crowdfunding_id = $(crowdfunding_id);`;

    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(200).send({message: 'Successfully removed the service requested.'});
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
        VALUES ($(service_id), $(partner_id), $(crowdfunding_id), NOW(), NOW() + interval '1 week');`;

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
