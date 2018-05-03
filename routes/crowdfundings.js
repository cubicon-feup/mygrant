var express = require('express');
var router = express.Router();
const cronJob = require('../cronjob');
var db = require('../config/database');
var image = require('../images/Image');
const policy = require('../policies/crowdfundingsPolicy');
const allowedSortingMethods = ["date_created", "date_finished", "title", "percentage_achieved"];

// CROWDFUNDING.
// ===============================================================================

/**
 * @api {post} /crowdfundings/ Create crowdfunding
 * @apiName CreateCrowdfunding
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestBody) {String} title Crowdfunding title.
 * @apiParam (RequestBody) {String} description Crowdfunding description.
 * @apiParam (RequestBody) {String} category Crowdfunding category.
 * @apiParam (RequestBody) {String} location Location where the crowdfunding is going to take place.
 * @apiParam (RequestBody) {Integer} mygrant_target Number of mygrants needed for the crowdfunding to success.
 * @apiParam (RequestBody) {Integer} time_interval Number of week to collect donators.
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
    let creatorId = 1;   // TODO: authenticated user.
    let query =
        `INSERT INTO crowdfunding (title, description, category, location, mygrant_target, date_created, date_finished, status, creator_id)
        VALUES ($(title), $(description), $(category), $(location), $(mygrant_target), NOW(), NOW() + INTERVAL '$(time_interval) weeks', 'COLLECTING', $(creator_id))
        RETURNING id, date_finished;`;

    db.one(query, {
        title: title,
        description: description,
        category: category,
        location: location,
        mygrant_target: mygrantTarget,
        time_interval: timeInterval,
        creator_id: creatorId
    }).then(data => {
        let crowdfundingId = data.id;
        let dateFinished = new Date(data.date_finished);
        cronJob.scheduleJob(crowdfundingId, dateFinished);
        res.status(201).send({message: 'Sucessfully created a crowdfunding project.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t create a crowdfunding.'});
    });
});

/**
 * @api {get} /crowdfundings/:crowdfunding_id Get crowdfunding
 * @apiName GetCrowdfunding
 * @apiGroup Crowdfunding
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
 * @apiError (Error 500) InternalServerError Could't get the crowdfunding project.
 */
router.get('/:crowdfunding_id', function(req, res) {
    let id = req.params.crowdfunding_id;
    let query =
        `SELECT title, description, category, location, mygrant_target, date_created, date_finished, status, creator_id, users.full_name as creator_name, users.id as creator_id,
            ( SELECT avg (total_ratings.rating) as average_rating
                FROM (
                    SELECT rating
                    FROM crowdfunding_donation
                    WHERE crowdfunding_id = $(id)
            ) as total_ratings),
            ARRAY( SELECT image_url FROM crowdfunding_image WHERE crowdfunding_id = $(id)) as images
        FROM crowdfunding
        INNER JOIN users ON users.id = crowdfunding.creator_id
        WHERE crowdfunding.id = $(id);`;

    db.oneOrNone(query, {
        id: id
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Could\'t get the crowdfunding project.'});
    });
});

/**
 * @api {put} /crowdfundings/:crowdfunding_id Update crowdfunding
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
    let creatorId = 1;  // TODO: authenticated user.
    let crowdfundingId = req.params.crowdfunding_id;
    let title = req.body.title;
    let description = req.body.description;
    let query =
        `UPDATE crowdfunding
        SET title = $(title),
            description = $(description)
        WHERE id = $(id)
            AND creator_id = $(creator_id);`;

    db.none(query, {
        title: title,
        description: description,
        id: crowdfundingId,
        creator_id: creatorId
    }).then(() => {
        res.status(200).send({message: 'Successfully updated crowdfunding project.'});
    }).catch(error => {
        res.status(500).json({error: 'Could\'t update the crowdfunding project.'});
    });
});

/**
 * @api {delete} /crowdfundings/:crowdfunding_id Delete crowdfunding
 * @apiName DeleteCrowdfunding
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding project id.
 *
 * @apiSuccess (Success 200) {String} message Successfully deleted crowdfunding project.
 * 
 * @apiError (Error 500) InternalServerError Could't delete the crowdfunding project.
 */
router.delete('/:crowdfunding_id', function(req, res) {
    let creatorId = 1; // TODO: Use session id.
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `DELETE FROM crowdfunding
        WHERE id = $(id)
            AND creator_id = $(creator_id);`;

    db.none(query, {
        id: crowdfundingId,
        creator_id: creatorId
    }).then(() => {
        res.status(200).send({message: 'Sucessfully deleted crowdfunding project.'});
    }).catch(error => {
        res.status(500).json({error: 'Could\'t delete the crowdfunding project.'});
    });
});

/**
 * @api {get} /crowdfundings/:crowdfunding_id/rating Get crowdfunding average rating
 * @apiName GetCrowdfundingAverageRating
 * @apiGroup Crowdfunding
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding project id.
 *
 * @apiSuccess (Success 200) {String} average_rating Crowdfunding average rating.
 * 
 * @apiError (Error 500) InternalServerError Couldn't get the rating.
 */
router.get('/:crowdfunding_id/rating', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT avg(total_ratings.rating) as average_rating
        FROM (
            SELECT rating
            FROM crowdfunding_donation
            WHERE crowdfunding_id = $(id)
        ) as total_ratings;`;

    db.one(query, {
        id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get the rating.'});
    });
});

/**
 * @api {get} /crowdfundings/ Get all crowdfundings
 * @apiName GetAllCrowdfundings
 * @apiGroup Crowdfunding
 * @apiDeprecated use now (#Crowdfunding:SearchCrowdfunding).
 *
 * @apiSuccess (Success 200) {String} title Crowdfunding title.
 * @apiSuccess (Success 200) {String} category Crowdfunding category.
 * @apiSuccess (Success 200) {String} location Location where the crowdfunding is going to take place.
 * @apiSuccess (Success 200) {Integer} mygrant_target Number of mygrants needed for the crowdfunding to success.
 * @apiSuccess (Success 200) {String} status Current crowdfunding status. 
 * @apiSuccess (Success 200) {String} creator_name Creator user name.
 * @apiSuccess (Success 200) {Integer} creator_id Creator user id.
 *
 * @apiError (Error 500) InternalServerError Couldn't get crowdfunding projects.
 */
router.get('/', function(req, res) {
    let query =
        `SELECT title, category, location, mygrant_target, status, users.full_name as creator_name, users.id as creator_id
        FROM crowdfunding
        INNER JOIN users ON users.id = crowdfunding.creator_id;`;

    db.manyOrNone(query)
    .then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get crowdfunding projects.'});
    });
});

/**
 * @api {post} /crowdfundings/:crowdfunding_id/donations Create donation.
 * @apiName CreateDonation
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id that gets the donation.
 * @apiParam (RequestBody) {Integer} amount Number of mygrants to donate.
 * 
 * @apiSuccess (Success 201) {String} message Successfully donated to crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid donation data.
 * @apiError (Error 500) InternalServerError Couldn't donate.
 */
router.post('/:crowdfunding_id/donations', policy.donate, function(req, res) {
    let donatorId = 2; // TODO: authenticated user.
    let crowdfundingId = req.params.crowdfunding_id;
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
        res.status(500).json({error: 'Couldn\'t donate.'});
    });
});

/**
 * @api {get} /crowdfundings/:crowdfunding_id/donations Get donations.
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

    db.manyOrNone(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get donations'});
    })
});

/**
 * @api {put} /crowdfundings/:crowdfunding_id/rating Create rate
 * @apiName CreateRate
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 * @apiParam (RequestBody) {Integer} rating Donator user rating.
 * 
 * @apiSuccess (Success 200) {Integer} message Successfully rated the crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid rate data.
 * @apiError (Error 500) InternalServerError Couldn't get donations.
 */
router.put('/:crowdfunding_id/rating', policy.rate, function(req, res) {
    let donatorId = 2;  // TODO: authenticated user.
    let crowdfundingId = req.params.crowdfunding_id;
    let rating = req.body.rating;
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
        res.status(500).json({error: 'Couldn\'t rate crowdfunding.'});
    });
});

// IMAGES
// DEPRECATED. Wait for new version.
// TODO: new image API version.
// ===============================================================================


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
 * @api {post} /crowdfundings/:crowdfunding_id/services_offers Create service offer.
 * @apiName CreateServiceOffer
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id that the service is being offered.
 * @apiParam (RequestBody) {Integer} service_id Service id to offer.
 * 
 * @apiSuccess (Success 201) {Integer} message Successfully offered a service to the crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid service offer data.
 * @apiError (Error 403) Forbidden You do not have permission to offer the specified service.
 * @apiError (Error 500) InternalServerError Couldn't offer service.
 */
router.post('/:crowdfunding_id/services_offers', policy.serviceOffer, function(req, res) {
    let creatorId = 2;  // TODO: authenticated user.
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let query =
        `SELECT EXISTS (
            SELECT 1
            FROM service
            WHERE id = $(service_id)
                AND creator_id = $(creator_id)
                AND service_type = 'PROVIDE'
        ) as creator_owns_service;`;

    // First we check if the authenticated user is the creator of the service he's offering.
    db.one(query, {
        service_id: serviceId,
        creator_id: creatorId
    }).then(data => {
        // He's the creator, so now we can offer the service.
        let creatorOwnsService = data.creator_owns_service;
        if(creatorOwnsService) {
            query =
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
        } else res.status(403).json({error: 'You do not have permission to offer the specified service.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t offer service.'});
    });
});

/**
 * @api {get} /crowdfundings/:crowdfunding_id/services_offers Get crowdfunding service offers.
 * @apiName GetServiceOffers
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
    // TODO: check if user is authenticated.
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT service.id, service.title, service.description, service.category, service.service_type
        FROM service
        INNER JOIN crowdfunding_offer ON crowdfunding_offer.service_id = service.id
        WHERE crowdfunding_offer.crowdfunding_id = $(crowdfunding_id);`;

    db.manyOrNone(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get service offers.'});
    })
});

/**
 * @api {delete} /crowdfundings/:crowdfunding_id/services_offers Delete service offer.
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
router.delete('/:crowdfunding_id/services_offers', policy.serviceOffer, function(req, res) {
    let crowdfundingCreatorId = 1;  // TODO: get authenticated user.
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let query =
        `DELETE FROM crowdfunding_offer
        USING crowdfunding
        WHERE crowdfunding_offer.service_id = $(service_id)
           AND crowdfunding_offer.crowdfunding_id = $(crowdfunding_id)
           AND crowdfunding.creator_id = $(crowdfunding_creator_id);`;

    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId,
        crowdfunding_creator_id: crowdfundingCreatorId
    }).then(() => {
        res.status(200).send({message: 'Successfully deleted the service offer.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t delete the service offer.'});
    })
});

// SERVICE REQUESTED.
// ===============================================================================

/**
 * @api {post} /crowdfundings/:crowdfunding_id/services_requested Create service request
 * @apiName CreateServiceRequest
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id associated with the service request.
 * @apiParam (RequestBody) {Integer} title Request service title.
 * @apiParam (RequestBody) {Integer} description Request service description.
 * @apiParam (RequestBody) {Integer} category Request service category.
 * @apiParam (RequestBody) {Integer} location Location for the service to happen.
 * @apiParam (RequestBody) {Integer} mygrant_value Mygrants amount to transfer.
 * 
 * @apiSuccess (Success 201) {String} message Successfully created a new service request for the crowdfunding.
 * 
 * @apiError (Error 400) BadRequest Invalid service request data.
 * @apiError (Error 500) InternalServerError Couldn\'t create a service request.
 */
router.post('/:crowdfunding_id/services_requested', policy.requestService, function(req, res) {
    let creatorId = 1;  // TODO: authenticated user.
    let crowdfundingId = req.params.crowdfunding_id;
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let location = req.body.location;
    let mygrantValue = req.body.mygrant_value;
    let query =
        `DO
        $do$
        BEGIN
            IF EXISTS (
                SELECT 1
                FROM crowdfunding
                WHERE crowdfunding.id = $(crowdfunding_id)
                    AND crowdfunding.creator_id = $(creator_id)
            ) THEN INSERT INTO service (title, description, category, location, mygrant_value, date_created, service_type, crowdfunding_id)
                    VALUES ($(title), $(description), $(category), $(location), $(mygrant_value), NOW(), 'REQUEST', $(crowdfunding_id));
            END IF;
        END;
        $do$`;

    db.none(query, {
        title: title,
        description: description,
        category: category,
        location: location,
        mygrant_value: mygrantValue,
        crowdfunding_id: crowdfundingId,
        creator_id: creatorId
    }).then(() => {
        res.status(201).send({message: 'Successfully created a new service request for the crowdfunding.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t create a service request.'});
    })
});

/**
 * @api {get} /crowdfundings/:crowdfunding_id/services_requested Get service requests
 * @apiName GetServiceRequests
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
    // TODO: check if user is authenticated.
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT title, mygrant_value, category
        FROM service
        WHERE service.crowdfunding_id = $(crowdfunding_id);`;

    db.manyOrNone(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get service requests.'});
    })
});

/**
 * @api {delete} /crowdfundings/:crowdfunding_id/services_requested Delete service request
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
    let creatorId = 1;  // TODO: authenticated user.
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let query =
        `DELETE FROM service
        USING crowdfunding
        WHERE service.id = $(service_id)
            AND service.crowdfunding_id = $(crowdfunding_id)
            AND crowdfunding.creator_id = $(creator_id);`;

    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId,
        creator_id: creatorId
    }).then(() => {
        res.status(200).send({message: 'Successfully removed the service requested.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get service requests.'});
    })
});

// SERVICES ACCORDED
// ===============================================================================

/**
 * @api {post} /crowdfundings/:crowdfunding_id/services Create service accorded
 * @apiName CreateServiceAccorded
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id that the service is going to be applied to.
 * @apiParam (RequestBody) {Integer} service_id Service id that is going to be applied.
 * 
 * @apiSuccess (Success 200) {String} message Successfully agreed with a service.
 * 
 * @apiError (Error 400) BadRequest Invalid service accorded data.
 * @apiError (Error 500) InternalServerError Couldn't save the agreed service.
 */
router.post('/:crowdfunding_id/services', policy.serviceAccorded, function(req, res) {
    // TODO: check if user is authenticated and owns the crowdfunding.
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    // TODO: set a date.
    //let dateScheduled = req.body.date_scheduled;    // Format: 'yyyy-mm-dd hh:m:ss'.
    let query =
        `INSERT INTO service_instance (service_id, crowdfunding_id, date_agreed, date_scheduled)
        VALUES ($(service_id), $(crowdfunding_id), NOW(), NOW() + interval '1 week');`;

    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId,
        //date_scheduled: dateScheduled
    }).then(() => {
        res.status(201).send({message: 'Successfully agreed with a service.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t save the agreed service.'});
    })
});

/**
 * @api {get} /crowdfundings/:crowdfunding_id/services/offered Get services accorded offered
 * @apiName GetSearvicesAccordedOffered
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 * 
 * @apiSuccess (Success 200) {Integer} service_id Accorded service id.
 * @apiSuccess (Success 200) {Date} date_agreed Data the service was agreed users.
 * @apiSuccess (Success 200) {Date} date_scheduled Schedule data for the service.
 * @apiSuccess (Success 200) {String} service_title Service title.
 * @apiSuccess (Success 200) {String} service_description Service description.
 * @apiSuccess (Success 200) {String} creator_name Service creator name.
 * 
 * @apiError (Error 500) InternalServerError Couldn't get the services accorded offered.
 */
router.get('/:crowdfunding_id/services/offered', function(req, res) {
    // TODO: check if user is authenticated and owns the crowdfunding.
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT service_instance.service_id, service_instance.date_agreed, service_instance.date_scheduled, service.title as service_title, service.description as service_description, users.full_name as creator_name
        FROM service_instance
        INNER JOIN service ON service.id = service_instance.service_id
        INNER JOIN users ON users.id = service.creator_id
        WHERE service_instance.crowdfunding_id = $(crowdfunding_id);`;

    db.manyOrNone(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get the services accorded offered.'});
    })
});

/**
 * @api {get} /crowdfundings/:crowdfunding_id/services/requested Get services accorded requested
 * @apiName GetSearvicesAccordedRequested
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 * 
 * @apiSuccess (Success 200) {Integer} service_id Accorded service id.
 * @apiSuccess (Success 200) {Date} date_agreed Data the service was agreed users.
 * @apiSuccess (Success 200) {Date} date_scheduled Schedule data for the service.
 * @apiSuccess (Success 200) {String} service_title Service title.
 * @apiSuccess (Success 200) {String} service_description Service description.
 * @apiSuccess (Success 200) {String} creator_name Service provider name.
 * 
 * @apiError (Error 500) InternalServerError Couldn't get the services accorded requested.
 */
router.get('/:crowdfunding_id/services/requested', function(req, res) {
    // TODO: check if user is authenticated and owns the crowdfunding.
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT service_instance.service_id, service_instance.date_agreed, service_instance.date_scheduled, service.title as service_title, service.description as service_description, users.full_name as creator_name
        FROM service_instance
        INNER JOIN service ON service.id = service_instance.service_id
        INNER JOIN users ON users.id = service_instance.partner_id
        WHERE service_instance.crowdfunding_id = $(crowdfunding_id);`;

    db.manyOrNone(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get the services accorded offered.'});
    })
});

// TODO: is this desired behaviour?
/**
 * @api {delete} /crowdfundings/:crowdfunding_id/services/requested Delete service accorded
 * @apiName DeleteServiceAccorded
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id.
 * @apiParam (RequestBody) {Integer} service_id Service id to remove.
 * 
 * @apiSuccess (Success 200) {String} message Successfully deleted the service instance.
 * 
 * @apiError (Error 500) InternalServerError Couldn't delete the accorded service.'
 */
router.delete('/:crowdfunding_id/services', policy.serviceAccorded, function(req, res) {
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
        res.status(200).send({message: 'Successfully deleted the service instance.'});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t delete the accorded service.'});
    })
});

// SEARCH
// ===============================================================================

/**
 * @api {get} /crowdfundings/filter/:from-:to Search crowdfunding.
 * @apiName SearchCrowdfunding
 * @apiGroup Crowdfunding
 *
 * @apiParam (RequestParam) {Integer} from Crowdfunding number from returned.
 * @apiParam (RequestParam) {Integer} to Crowdfunding number to returned.
 * @apiParam (RequestQuery) {String=date_created, date_finished, title, percentage_achieved} [sorting_method] Sorting method selected.
 * @apiParam (RequestQuery) {String=COLLECTING, RECRUITING, FINISHED} [status] Current status.
 * @apiParam (RequestQuery) {String} [category] Category to search.
 * @apiParam (RequestQuery) {String} [location] Location to search.
 * @apiParam (RequestQuery) {String} [keywords] Keywords to search either in the title or description.
 * 
 * @apiSuccess (Success 200) {Integer} crowdfunding_id Crowdfunding id.
 * @apiSuccess (Success 200) {String} title Crowdfunding title.
 * @apiSuccess (Success 200) {String} category Crowdfunding category.
 * @apiSuccess (Success 200) {String} location Location where the crowdfunding is going to take place.
 * @apiSuccess (Success 200) {Integer} mygrant_target Number of mygrants needed for the crowdfunding to success.
 * @apiSuccess (Success 200) {String} status Current crowdfunding status.
 * @apiSuccess (Success 200) {String} creator_name Creator user name.
 * @apiSuccess (Success 200) {Integer} creator_id Creator user id.
 * @apiSuccess (Success 200) {Date} date_finished Closing date.
 * 
 * @apiError (Error 400) BadRequest Invalid search data.
 * @apiError (Error 500) InternalServerError Couldn't get crowdfundings.
 * 
 * @apiExample URL example:
 * http://localhost:3001/api/crowdfundings/filter/1-10?&sorting_method=date_created&category=BUSINESS
 */
router.get('/filter/:from-:to', policy.search, function(req, res) {
    let from = req.params.from - 1; // We're subtracting so that we can include the 'from' crowdfunding.
    let to = req.params.to;
    let sortingMethod = req.query.hasOwnProperty('sorting_method') && (allowedSortingMethods.indexOf(req.query.sorting_method) >= 0) ? req.query.sorting_method : false;
    let category = req.query.hasOwnProperty('category') ? req.query.category.toUpperCase() : false;    // Category enumators are upper case.
    let location = req.query.hasOwnProperty('location') ? req.query.location : false;
    let keywords = req.query.hasOwnProperty('keywords') ? req.query.keywords : false;
    let status = req.query.hasOwnProperty('status') ? req.query.status.toUpperCase() : false;   // Status enumators are upper case.

    let textSearch = `to_tsvector('english', title || ' ' || description)`;
    let textSearchQuery = `plainto_tsquery('english', $(keywords))`;

    if(sortingMethod) {
        switch(sortingMethod) {
            case 'percentage_achieved':
                sortingMethod = `(crowdfunding.mygrant_balance * 100 / crowdfunding.mygrant_target) DESC`;
                break;
            /*case 'rating':
                sortingMethod = `total_ratings DESC`;
                break;*/
            default:
                sortingMethod = `crowdfunding.${sortingMethod} ASC`;    
                break;
        }
    }

    var query =
        `SELECT crowdfunding.id as crowdfunding_id, title, category, location, mygrant_target, crowdfunding.mygrant_balance, crowdfunding.mygrant_balance * 100 / crowdfunding.mygrant_target as percentage_achieved, status, users.full_name as creator_name, users.id as creator_id, crowdfunding.date_finished
        FROM crowdfunding
        INNER JOIN users ON users.id = crowdfunding.creator_id
        WHERE true `
        + (category ? `AND crowdfunding.category = $(category) ` : ``)
        + (location ? `AND crowdfunding.location = $(location) ` : ``)
        + (status ? `AND crowdfunding.status = $(status) ` : ``)
        + (keywords ? `AND ${textSearch} @@ ${textSearchQuery} ` : ``)
        + (sortingMethod ? `ORDER BY ${sortingMethod} ` + (
            keywords ? `, ts_rank_cd(${textSearch}, ${textSearchQuery}) DESC ` : ``
        ) : (
            keywords ? `ORDER BY ts_rank_cd(${textSearch}, ${textSearchQuery}) DESC ` : ``
        ))
        + `LIMIT $(num_crowdfundings)
        OFFSET $(num_offset);`;

    console.log(query);

    db.manyOrNone(query, {
        keywords: keywords,
        num_crowdfundings: (to - from),
        num_offset: from,
        category: category,
        location: location,
        status: status
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        console.error(error);
        res.status(500).json({error: 'Couldn\'t get crowdfundings.'})
    });
})

module.exports = router;
