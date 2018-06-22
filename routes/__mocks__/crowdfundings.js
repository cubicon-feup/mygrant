var express = require('express');
var router = express.Router();

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
router.post('/', function(req, res) {
    res.sendStatus(200);
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
    res.sendStatus(200);
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
router.put('/:crowdfunding_id', function(req, res) {
    res.sendStatus(200);
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
    res.sendStatus(200);
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
    res.sendStatus(200);
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
    res.sendStatus(200);
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
router.post('/:crowdfunding_id/donations', function(req, res) {
    res.sendStatus(200);
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
    res.sendStatus(200);
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
router.put('/:crowdfunding_id/rating', function(req, res) {
    res.sendStatus(200);
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
router.get('/:crowdfunding_id/images', function(req, res) {
    res.sendStatus(200);
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
router.put('/:crowdfunding_id/images', function(req, res) {
    res.sendStatus(200);
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
router.delete('/:crowdfunding_id/images/:image', function(req, res) {
    res.sendStatus(200);
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
router.post('/:crowdfunding_id/services_offers', function(req, res) {
    res.sendStatus(200);
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
router.get('/:crowdfunding_id/services_offers', function(req, res) {
    res.sendStatus(200);
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
router.delete('/:crowdfunding_id/services_offers', function(req, res) {
    res.sendStatus(200);
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
router.post('/:crowdfunding_id/services_requested', function(req, res) {
    res.sendStatus(200);
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
    res.sendStatus(200);
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
router.delete('/:crowdfunding_id/services_requested',function(req, res) {
    res.sendStatus(200);
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
router.post('/:crowdfunding_id/:service_requested_id', function(req, res) {
    res.sendStatus(200);
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
router.post('/:crowdfunding_id/services', function(req, res) {
    res.sendStatus(200);
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
    res.sendStatus(200);
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
    res.sendStatus(200);
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
router.delete('/:crowdfunding_id/services', function(req, res) {
    res.sendStatus(200);
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
router.get('/filter/:from-:to', function(req, res) {
    res.sendStatus(200);
});

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
    res.sendStatus(200);
});


module.exports = router;
