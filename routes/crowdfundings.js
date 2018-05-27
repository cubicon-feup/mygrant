var express = require('express');
var router = express.Router();
const cronJob = require('../cronjob');
var db = require('../config/database');
var image = require('../images/Image');
const policy = require('../policies/crowdfundingsPolicy');
const allowedSortingMethods = ["date_created", "date_finished", "title", "percentage_achieved"];

const expressJwt = require('express-jwt');
const appSecret = require('../config/config').secret;
const authenticate = expressJwt({ secret: appSecret });

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
 * @apiSuccess (Success 201) {Integer} id Newly created crowdfunding id.
 *
 * @apiError (Error 400) BadRequest Invalid crowdfunding data.
 * @apiError (Error 500) InternalServerError Couldn't create a crowdfunding.
 */
router.post('/', authenticate, policy.valid, function(req, res) {
    let title = req.body.title;
    let description = req.body.description;
    let category = req.body.category;
    let location = req.body.location;
    let mygrantTarget = req.body.mygrant_target;
    let timeInterval = req.body.time_interval;
    let creatorId = req.user.id;
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
        res.status(201).send({id: crowdfundingId});
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
        `SELECT title, description, category, location, mygrant_target, crowdfunding.mygrant_balance, date_created, date_finished, status, creator_id, users.full_name as creator_name, users.id as creator_id, 
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
router.put('/:crowdfunding_id', authenticate, policy.edit, function(req, res) {
    let creatorId = req.user.id;
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
router.delete('/:crowdfunding_id', authenticate, function(req, res) {
    let creatorId = req.user.id;
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
router.post('/:crowdfunding_id/donations', authenticate, policy.donate, function(req, res) {
    let donatorId = req.user.id;
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
router.put('/:crowdfunding_id/rating', authenticate, policy.rate, function(req, res) {
    let donatorId = req.user.id;
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
// ===============================================================================


/**
 * @api {get} /crowdfundings/:crowdfunding_id/images - Get crowdfunding images' urls
 * @apiName GetcrowdfundingImages
 * @apiGroup crowdfunding
 * @apiPermission visitor
 *
 * @apiDescription Get images of a crowdfunding
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id ID of the crowdfunding to get images of
 *
 * @apiExample Syntax
 * GET: /api/crowdfundings/<ID>/images
 * @apiExample Example
 * GET: /api/crowdfundings/5/images
 *
 * @apiSuccess (Success 200) images List of images of the crowdfunding {crowdfunding_id, image_url}
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:crowdfunding_id/images', authenticate, function(req, res) {
    // check for valid input
    try {
        var crowdfunding_id = req.params.crowdfunding_id;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // define query
    const query = `
        SELECT crowdfunding_image.crowdfunding_id, crowdfunding_image.image_url
        FROM crowdfunding_image
        WHERE crowdfunding_image.crowdfunding_id = $(crowdfunding_id)`;
    // place query
    db.any(query, { crowdfunding_id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});


/**
 * @api {put} /crowdfundings/:crowdfunding_id/images - Create crowdfunding image
 * @apiName CreatecrowdfundingImage
 * @apiGroup crowdfunding
 * @apiPermission crowdfunding creator
 *
 * @apiDescription Upload image and add it to the crowdfunding's images
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id ID of the crowdfunding to get images of
 * @apiParam (RequestFiles) {File} file Image file of the image
 *
 * @apiExample Syntax
 * PUT: /api/crowdfundings/<ID>/images
 * @apiExample Example
 * PUT: /api/crowdfundings/5/images
 * files.image?
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/:crowdfunding_id/images', authenticate, function(req, res) {
    // get crowdfunding_id
    try {
        var crowdfunding_id = req.params.crowdfunding_id;
        // get filename
        var filename = image.uploadImage(req, res, 'crowdfundings/');
        if(filename === false){
            return;
        }
    } catch (err) {
        res.status(400).json(err);
        return;
    }
    // define query
    const query = `
        INSERT INTO crowdfunding_image (crowdfunding_id, image_url)
        VALUES ($(crowdfunding_id), $(filename))`;
    db.none(query, {
        crowdfunding_id,
        filename
    });
});


/**
 * @api {delete} /crowdfundings/:crowdfunding_id/images/:image - Delete crowdfunding image
 * @apiName DeletecrowdfundingImage
 * @apiGroup crowdfunding
 * @apiPermission crowdfunding creator
 *
 * @apiDescription Delete image of a crowdfunding by its URL
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id ID of the crowdfunding to get images of
 * @apiParam (RequestParam) {String} image URL of the image to delete
 *
 * @apiExample Syntax
 * DELETE: /api/crowdfundings/<ID>/images/<IMAGE_URL>
 * @apiExample Example
 * DELETE: /api/crowdfundings/5/images/http://dummyimage.com/965x531.png/dddddd/000000
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:crowdfunding_id/images/:image', authenticate, function(req, res) {
    // get crowdfunding_id
    try {
        var crowdfunding_id = req.params.crowdfunding_id;
        // get filename
        var image_url = req.params.image;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // define query //TODO: must be restricted to user
    const query = `
        DELETE FROM crowdfunding_image 
        WHERE crowdfunding_id=$(crowdfunding_id) AND image_url=$(image_url);`;
    db.none(query, {
            crowdfunding_id,
            image_url
        })
        .then(data => {
            image.removeImage(req, res, 'crowdfundings/'+image_url);
        })
        .catch(error => {
            res.status(500).send(error);
        });
});

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
router.post('/:crowdfunding_id/services_offers', authenticate, policy.serviceOffer, function(req, res) {
    let creatorId = req.user.id;
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
// TODO: test this one.
router.get('/:crowdfunding_id/services_offers', authenticate, function(req, res) {
    let crowdfundingCreatorId = req.user.id;
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT service.id, service.title, service.description, service.category, service.service_type
        FROM service
        INNER JOIN crowdfunding_offer ON crowdfunding_offer.service_id = service.id
        INNER JOIN crowdfunding ON crowdfunding.id = crowdfunding_offer.crowdfunding_id
        INNER JOIN users ON users.id = crowdfunding.creator_id
        WHERE crowdfunding_offer.crowdfunding_id = $(crowdfunding_id)
            AND crowdfunding.creator_id = $(crowdfunding_creator_id);`;

    db.manyOrNone(query, {
        crowdfunding_id: crowdfundingId,
        crowdfunding_creator_id: crowdfundingCreatorId
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
router.delete('/:crowdfunding_id/services_offers', authenticate, policy.serviceOffer, function(req, res) {
    let crowdfundingCreatorId = req.user.id;
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
router.post('/:crowdfunding_id/services_requested', authenticate, function(req, res) {
    console.log(req.user)
    console.log(req.params)
    console.log(req.body)
    let creatorId = req.user.id;
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
        console.log(error);
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
// TODO: test this.
router.get('/:crowdfunding_id/services_requested', function(req, res) {
    //let crowdfundingCreatorId = req.user.id;
    let crowdfundingId = req.params.crowdfunding_id;
    let query =
        `SELECT service.*
        FROM service
        INNER JOIN crowdfunding ON crowdfunding.id = service.crowdfunding_id
        INNER JOIN users ON users.id = crowdfunding.creator_id
        WHERE service.crowdfunding_id = $(crowdfunding_id);`;
            //AND users.id = $(crowdfunding_creator_id);`;

    db.manyOrNone(query, {
        crowdfunding_id: crowdfundingId//,
        //crowdfunding_creator_id: crowdfundingCreatorId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        console.log(error);
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
router.delete('/:crowdfunding_id/services_requested', authenticate, policy.deleteRequestService, function(req, res) {
    let creatorId = req.user.id;
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

/**
 * @api {post} /crowdfundings/:crowdfunding_id/:service_requested_id Assigns a candidate to a requested service.
 * @apiName AssignServiceRequestCandidate
 * @apiGroup Crowdfunding
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} crowdfunding_id Crowdfunding id associated with the service requests.
 * @apiParam (RequestParam) {Integer} service_requested_id Service request id.
 *
 * @apiSuccess (Success 200) Created
 *
 * @apiError (Error 500) InternalServerError
 */
router.post('/:crowdfunding_id/:service_requested_id', authenticate, function(req, res) {
    let serviceId = req.params.service_requested_id;
    let candidateId = req.user.id;
    let query =
        `INSERT INTO service_offer (service_id, candidate_id)
        VALUES ($(service_id), $(candidate_id));`;

    db.none(query, {
        service_id: serviceId,
        candidate_id: candidateId
    }).then(() => {
        res.status(201).send(201);
    }).catch(error => {
        res.status(500).json({error});
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
router.post('/:crowdfunding_id/services', authenticate, policy.serviceAccorded, function(req, res) {
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
    // TODO: users authenticated and owning the crowdfunding.
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

router.put('/:crodfunding_id/services', function(req, res) {
    let crowdfundingId = req.params.crowdfunding_id;
    let serviceId = req.body.service_id;
    let rating = req.body.rating;
    let query =
        `UPDATE service_instance
        SET `;
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

/**
 * @api {get} /crowdfundings/filter/:from-:to/pages_number Get pages number
 * @apiName GetPagesNumber
 * @apiGroup Crowdfunding
 *
 * @apiParam (RequestParam) {Integer} from Crowdfunding number from returned.
 * @apiParam (RequestParam) {Integer} to Crowdfunding number to returned.
 * @apiParam (RequestParam) {Integer} to Crowdfunding number to returned.
 *
 * @apiSuccess (Success 200) {Integer} pages_number Number of crowdfunding pages when using :from and :to.
 *
 * @apiError (Error 400) BadRequest Invalid pages number data.
 * @apiError (Error 500) InternalServerError Couldn't get pages number.
 */
router.get('/filter/:from-:to/pages_number', function(req, res) {
    let from = req.params.from - 1;
    let to = req.params.to;
    let query =
        `SELECT COUNT(*) as crowdfundings_number
        FROM crowdfunding;`;

    db.one(query)
    .then(data => {
        let crowdfundingsNumber = data.crowdfundings_number;
        let pagesNumber = Math.ceil(crowdfundingsNumber / (to - from));
        res.status(200).json({pages_number: pagesNumber});
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get pages number.'});
    })
});

module.exports = router;
