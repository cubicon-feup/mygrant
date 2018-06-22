var express = require('express');
var router = express.Router();

//
//
// SERVICES
//
//


/**
 * @api {get} /services - Get service's list
 * @apiName SearchService
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiDescription Search for and filters listing of active services according to parameters given
 *
 * @apiParam (RequestQueryParams) {String} q Search query; searches among titles and descriptions (Optional)
 * @apiParam (RequestQueryParams) {Integer} page page number to return (Optional)
 * @apiParam (RequestQueryParams) {Integer} items number of items per page default/max: 50 (Optional)
 * @apiParam (RequestQueryParams) {String} the field to be ordered by (defaults to search_score) (Optional)
 * @apiParam (RequestQueryParams) {Boolean} display in ascesding order (defaults to true) (Optional)
 * @apiParam (RequestQueryParams) {String} lang Language of the query ['portuguese', 'english', ...] default: 'english' (Optional)
 * @apiParam (RequestQueryParams) {String} desc Searches in description ['yes', 'no'] default: 'yes' (Optional)
 * @apiParam (RequestQueryParams) {String} cat Category of the service [BUSINESS, ARTS, ...] (Optional)
 * @apiParam (RequestQueryParams) {String} type Type of the service [PROVIDE, REQUEST] (Optional)
 * @apiParam (RequestQueryParams) {Integer} mygmax Max bound for mygrant_value (Optional)
 * @apiParam (RequestQueryParams) {Integer} mygmin Min bound for mygrant_value (Optional)
 * @apiParam (RequestQueryParams) {Date} datemax Max bound for created_date (Optional)
 * @apiParam (RequestQueryParams) {Date} datemin Min bound for created_date (Optional)
 *
 * @apiExample Syntax
 * GET: /api/services/?q=<QUERY>
 * @apiExample Example 1
 * GET: /api/services/?q=support+tangible+extranet
 * @apiExample Example 2
 * GET: /api/services/?q=tangible services&desc=no
 * @apiExample Example 3
 * GET: /api/services/?q=support paradigms&lang=english&limit=10&cat=fun&type=request
 * @apiExample Example 4
 * GET: /api/services/?q=support paradigms&lang=english&limit=100&mygmax=50&mygmin=30&datemin=2018-01-01
 * @apiExample Example 5
 * GET: /api/services/?q=service&order=distance&asc=false
 *
 * @apiSuccess (Success 200) {Integer} service_id ID of the service
 * @apiSuccess (Success 200) {String} title Title of the service
 * @apiSuccess (Success 200) {String} description Description of the service
 * @apiSuccess (Success 200) {String} category Category of the service [BUSINESS, ARTS, ...]
 * @apiSuccess (Success 200) {String} location Geographic coordinated of the service
 * @apiSuccess (Success 200) {Integer} acceptable_radius Maximum distance from location where the service can be done
 * @apiSuccess (Success 200) {Integer} mygrant_value Number of hours the service will take
 * @apiSuccess (Success 200) {Date} date_created Date the service was created
 * @apiSuccess (Success 200) {String} service_type Type of the service [PROVIDE, REQUEST]
 * @apiSuccess (Success 200) {Integer} creator_id ID of the creator if created by a user
 * @apiSuccess (Success 200) {String} provider_name Name of the creator if created by a user
 * @apiSuccess (Success 200) {Integer} crowdfunding_id ID of the crowdfunding if created by a crowdfunding
 * @apiSuccess (Success 200) {String} crowdfunding_title Title of the crowdfunding if created by a crowdfunding
 *
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {get} /services/:id - Get service by ID
 * @apiName GetServiceByID
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiDescription Get service info by ID
 *
 * @apiParam (RequestParams) {Integer} id ID of the service
 *
 * @apiExample Syntax
 * GET: /api/services/<ID>
 * @apiExample Example
 * GET: /api/services/5
 *
 * @apiSuccess (Success 200) {Integer} service_id ID of the service
 * @apiSuccess (Success 200) {String} title Title of the service
 * @apiSuccess (Success 200) {String} description Description of the service
 * @apiSuccess (Success 200) {String} category Category of the service [BUSINESS, ARTS, ...]
 * @apiSuccess (Success 200) {String} location Geographic coordinated of the service
 * @apiSuccess (Success 200) {Integer} acceptable_radius Maximum distance from location where the service can be done
 * @apiSuccess (Success 200) {Integer} mygrant_value Number of hours the service will take
 * @apiSuccess (Success 200) {Date} date_created Date the service was created
 * @apiSuccess (Success 200) {String} service_type Type of the service [PROVIDE, REQUEST]
 * @apiSuccess (Success 200) {Integer} creator_id ID of the creator if created by a user
 * @apiSuccess (Success 200) {String} provider_name Name of the creator if created by a user
 * @apiSuccess (Success 200) {Integer} crowdfunding_id ID of the crowdfunding if created by a crowdfunding
 * @apiSuccess (Success 200) {String} crowdfunding_title Title of the crowdfunding if created by a crowdfunding
 *
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:id', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {put} /services/ - Create service
 * @apiName CreateService
 * @apiGroup Service
 * @apiPermission authenticated user
 *
 * @apiDescription Create a new service
 *
 * @apiParam (RequestBody) {String} title Title of the service
 * @apiParam (RequestBody) {String} description Description of the service (Optional)
 * @apiParam (RequestBody) {String} category Category of the service [BUSINESS, ARTS, ...]
 * @apiParam (RequestBody) {String} location Geographic coordinated of the service (Optional)
 * @apiParam (RequestBody) {Double} latitude Latitude coordinates of the service (Optional)
 * @apiParam (RequestBody) {Double} longitude Longitude- coordinates of the service (Optional)
 * @apiParam (RequestBody) {Integer} acceptable_radius Maximum distance from location where the service can be done (Optional)
 * @apiParam (RequestBody) {Integer} mygrant_value Number of hours the service will take
 * @apiParam (RequestBody) {String} service_type Type of the service [PROVIDE, REQUEST]
 * @apiParam (RequestBody) {Integer} creator_id ID of the creator if created by a user (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding if created by a crowdfunding (XOR creator_id)
 * @apiParam (RequestBody) {Boolean} repeatable If the service can be done more than one time (Optional)
 *
 * @apiExample Syntax
 * PUT: /api/services
 * @apiExample Example
 * PUT: /api/services
 * body: {
 *      title: 'A new title',
 *      description: 'A new description',
 *      category: 'FUN',
 *      location: '353 st',
 *      acceptable_radius: '2540',
 *      mygrant_value: '50',
 *      service_type: 'REQUEST',
 *      creator_id: '4'
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/', function(req, res) {
    res.sendStatus(200);
});
/**
 * @api {put} /services/:id - Edit service
 * @apiName EditService
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Edit a service by its ID
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to update
 * @apiParam (RequestBody) {String} title Title of the service (Optional)
 * @apiParam (RequestBody) {String} description Description of the service (Optional)
 * @apiParam (RequestBody) {String} category Category of the service [BUSINESS, ARTS, ...] (Optional)
 * @apiParam (RequestBody) {String} location Geographic coordinated of the service (Optional)
 * @apiParam (RequestBody) {Integer} acceptable_radius Maximum distance from location where the service can be done (Optional)
 * @apiParam (RequestBody) {Integer} mygrant_value Number of hours the service will take (Optional)
 * @apiParam (RequestBody) {String} service_type Type of the service [PROVIDE, REQUEST] (Optional)
 * @apiParam (RequestBody) {Integer} creator_id ID of the creator if created by a user (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding if created by a crowdfunding (XOR creator_id)
 * @apiParam (RequestBody) {Boolean} repeatable If the service can be done more than one time (Optional)
 *
 * @apiExample Syntax
 * PUT: /api/services/<ID>
 * @apiExample Example
 * PUT: /api/services/5
 * body: {
 *      title: 'An edited title',
 *      description: 'An edit description',
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/:id', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {delete} /services/:id - Delete service
 * @apiName DeleteService
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Delete a service by its ID
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to delete
 *
 * @apiExample Syntax
 * DELETE: /api/services/<ID>
 * @apiExample Example
 * DELETE: /api/services/5
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:id', function(req, res) {
    res.sendStatus(200);
});


//
//
// IMAGES
//
//


/**
 * @api {get} /services/:id/images - Get service images' urls
 * @apiName GetServiceImages
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiDescription Get images of a service
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get images of
 *
 * @apiExample Syntax
 * GET: /api/services/<ID>/images
 * @apiExample Example
 * GET: /api/services/5/images
 *
 * @apiSuccess (Success 200) images List of images of the service {service_id, image_url}
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:id/images', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {put} /services/:id/images - Create service image
 * @apiName CreateServiceImage
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Upload image and add it to the service's images
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get images of
 * @apiParam (RequestFiles) {File} image Image file to upload
 *
 * @apiExample Syntax
 * PUT: /api/services/<ID>/images
 * @apiExample Example
 * PUT: /api/services/5/images
 * files.image?
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/:id/images', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {delete} /services/:id/images/:image - Delete service image
 * @apiName DeleteServiceImage
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Delete image of a service by its URL
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get images of
 * @apiParam (RequestParam) {String} image URL of the image to delete
 *
 * @apiExample Syntax
 * DELETE: /api/services/<ID>/images/<IMAGE_URL>
 * @apiExample Example
 * DELETE: /api/services/5/images/http://dummyimage.com/965x531.png/dddddd/000000
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:id/images/:image', function(req, res) {
    res.sendStatus(200);
});

//
//
// OFFERS
//
//


/**
 * @api {get} /services/:id/offers - Get service offers
 * @apiName GetServiceOffers
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Get list of offers made to a service by a user or crowdfunding
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get offers of
 *
 * @apiExample Syntax
 * GET: /api/services/<ID>/offers
 * @apiExample Example
 * GET: /api/services/5/offers
 *
 * @apiSuccess (Success 200) requesters List of the users making the offers {type, requester_id, requester_name}
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:id/offers', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {post} /services/:id/offers - Make service offer
 * @apiName MakeServiceOffer
 * @apiGroup Service
 * @apiPermission authenticated user
 *
 * @apiDescription Create offer to a service
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to make offer to (service can't have deleted=true)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding making the offer (crowdfunding must be RECRUTING) (XOR partner_id)
 * @apiParam (RequestBody) {Integer} partner_id ID of the user making the offer (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Timestamp} date_propsosed Proposed date for the service (Optional)
 *
 * @apiExample Syntax
 * POST: /api/services/<ID>/offers
 * @apiExample Example 1
 * [When the offer is being made in the name of a the logged in user]
 * POST: /api/services/5/offers
 * @apiExample Example 2
 * [When the offer is being made in the name of a crowdfunding]
 * POST: /api/services/5/offers
 * body: {
 *  partner_id: 10,
 *  data_proposed: "2018-10-10 03:03:03+01"
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/:id/offers', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {post} /services/:id/offers/accept - Accept service offer
 * @apiName AcceptServiceOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Accept service offer
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to offer to accept (service can't have deleted=true)
 * @apiParam (RequestBody) {Integer} partner_id ID of the user that made the offer (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding that made the offer (XOR partner_id)
 *
 * @apiExample Syntax
 * POST: /api/services/<ID>/offers/accept
 * @apiExample Example 1
 * [When the offer was made by a user]
 * POST: /api/services/5/offers/accept
 * body: {
 *      partner_id: 10,
 * }
 * @apiExample Example 2
 * [When the offer was made by a crowdfunding]
 * POST: /api/services/5/offers/accept
 * body: {
 *      crowdfunding_id: 10,
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 403) Forbidden You do not have permission to offer the specified service.
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/:id/offers/accept', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {delete} /services/:id/offers/decline - Decline service offer
 * @apiName DeclineServiceOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Removes service offer
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to offer to accept
 * @apiParam (RequestBody) {Integer} partner_id ID of the user that made the offer (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding that made the offer (XOR partner_id)
 *
 * @apiExample Syntax
 * POST: /api/services/<ID>/offers/decline
 * @apiExample Example 1
 * [When the offer was made by a user]
 * POST: /api/services/5/offers/decline
 * body: {
 *      partner_id: 10,
 * }
 * @apiExample Example 2
 * [When the offer was made by a crowdfunding]
 * POST: /api/services/5/offers/decline
 * body: {
 *      crowdfunding_id: 10,
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:id/offers/decline', function(req, res) {
    res.sendStatus(200);
});


//
//
// REVIEW
//
//


/**
 * @api {put} /services/instance/:id - Rate a service
 * @apiName ReviewServiceInstance
 * @apiGroup Service
 * @apiPermission service creator/partner
 *
 * @apiDescription Adds rating given by participant to a service instance
 *
 * @apiParam (RequestParam) {Integer} id ID of the service instance to review
 * @apiParam (RequestBody) {Integer} rating Rating to be given to the service instance
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding reviewing a service (Only applicable to services provided to a crowdfunding)
 *
 * @apiExample Syntax
 * POST: /api/services/instance/<ID>
 * @apiExample Example 1
 * [When the participant doing the rating is a user]
 * POST: /api/services/instance/<ID>
 * body: {
 *      rating: 2
 * }
 * @apiExample Example 2
 * [When the participant doing the rating is a crowdfunding]
 * POST: /api/services/instance/<ID>
 * body: {
 *      crowdfunding_id: 10,
 *      rating: 2
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/instance/:id', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {get} /services/instance/:id Get the service instance requester
 * @apiName GetServiceInstanceRequester
 * @apiGroup Service
 * @apiPermission service creator
 * */
// TODO: finish api doc.
router.get('/:service_id/instance/partner', function(req, res) {
    res.sendStatus(200);
});

// TODO: finish api doc.
router.get('/:service_id/instance', function(req, res) {
    res.sendStatus(200);
});

// TODO: finish api doc
router.get('/:service_id/is_owner_or_partner', function(req, res) {
    res.sendStatus(200);
});

module.exports = router;
