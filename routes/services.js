var express = require('express');
var router = express.Router();
var db = require('../config/database');


//
//
// SERVICES
//
//


/**
 * @api {get} /services/ 01 - Get service list
 * @apiName GetServices
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiDescription Get a list of active services, by page, containing up to N items. The maximum of items/page is 50.
 *
 * @apiParam (RequestQueryParams) {Integer} page page number to return (Optional)
 * @apiParam (RequestQueryParams) {Integer} items number of items per page default/max: 50 (Optional)
 *
 * @apiExample Syntax
 * GET: /api/services?page=<PAGE>&items=<ITEMS>
 * @apiExample Example 1
 * GET: /api/services?page=3
 * @apiExample Example 2
 * GET: /api/services?page=1&items=25
 *
 * @apiSuccess (Success 200) {Integer} id ID of the service
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
    // TODO apply sorting (by field), asc, desc.
    // ORDER BY n ASC
    let itemsPerPage = 50;
    try {
        // itemPerPage
        if (req.query.hasOwnProperty('items') && req.query.items < 50)
            itemsPerPage = req.query.items;
        // offset
        const page = req.query.hasOwnProperty('page') ? req.query.page : 1;
        var offset = (page - 1) * itemsPerPage;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        SELECT service.id, service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name as provider_name, service.crowdfunding_id, crowdfunding.title as crowdfunding_title
        FROM service
        LEFT JOIN users on users.id = service.creator_id
        LEFT JOIN crowdfunding on crowdfunding.id = service.crowdfunding_id
        WHERE service.deleted = false
        LIMIT $(itemsPerPage) OFFSET $(offset)`;
    // place query
    db.any(query, {
            "itemsPerPage": itemsPerPage,
            "offset": offset
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {get} /services/num-pages 02 - Get number of pages of service list
 * @apiName GetServicesNumPages
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiDescription Returns the number of pages of active services (with each page having up to N items)
 *
 * @apiParam (RequestQueryParams) {Integer} Items number of items per page default/max: 50 (Optional)
 *
 * @apiExample Syntax
 * GET: /api/services/num-pages?items=<ITEMS>
 * @apiExample Example
 * GET: /api/services/num-pages?items=30
 *
 * @apiSuccess (Success 200) {Integer} n Returns only the integer of the number of pages (No JSON key: value)
 *
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/num-pages', function(req, res) {
    let itemsPerPage = 50;
    try {
        // itemPerPage
        if (req.query.hasOwnProperty('items') && req.query.items < 50)
            itemsPerPage = req.query.items;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `SELECT COUNT(id) as npages from service WHERE service.deleted = false;`;
    // place query
    db.one(query, {})
        .then(data => {
            res.status(200).json(Math.ceil(data.npages / itemsPerPage));
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {get} /services/search 03 - Search for services
 * @apiName SearchService
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiDescription Search among active services' titles and descriptions using the given query text
 *
 * @apiParam (RequestQueryParams) {String} q Search query (Required)
 * @apiParam (RequestQueryParams) {Integer} limit Maximum number of results default: 50 (Optional)
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
 * GET: /api/services/search?q=<QUERY>
 * @apiExample Example 1
 * GET: /api/services/search?q=support+tangible+extranet
 * @apiExample Example 2
 * GET: /api/services/search?q=tangible services&desc=no
 * @apiExample Example 3
 * GET: /api/services/search?q=support paradigms&lang=english&limit=10&cat=fun&type=request
 * @apiExample Example 4
 * GET: /api/services/search?q=support paradigms&lang=english&limit=100&mygmax=50&mygmin=30&datemin=2018-01-01
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
router.get(['/search'], function(req, res) { // check for valid input
    try {
        var q = req.query.q.split(" ").join(" | ");
        var limit = req.query.hasOwnProperty('limit') ? req.query.limit : 50;
        // lang can either be 'english' or 'portuguese':
        var lang = req.query.hasOwnProperty('lang') ? req.query.lang : 'english';
        var search_desc = req.query.hasOwnProperty('desc') ? req.query.desc!='no' : true;
        var cat = req.query.hasOwnProperty('cat') ? req.query.cat.toUpperCase() : false;
        //var loc = req.query.hasOwnProperty('loc') ? req.query.loc : null;
        var type = req.query.hasOwnProperty('type') ? req.query.type.toUpperCase() : false;
        var mygmax = req.query.hasOwnProperty('mygmax') ? req.query.mygmax : false;
        var mygmin = req.query.hasOwnProperty('mygmin') ? req.query.mygmin : false;
        var datemax = req.query.hasOwnProperty('datemax') ? req.query.datemax : false;
        var datemin = req.query.hasOwnProperty('datemin') ? req.query.datemin : false;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        SELECT *
        FROM (
        SELECT service.id AS service_id, service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name AS provider_name, service.crowdfunding_id, crowdfunding.title as crowdfunding_title,
        ts_rank_cd(to_tsvector($(lang), service.title `+(search_desc?`|| '. ' || service.description`:``)+` || '. ' || users.full_name),
        to_tsquery($(lang), $(q))) AS search_score
        FROM service
        LEFT JOIN users on users.id = service.creator_id
        LEFT JOIN crowdfunding on crowdfunding.id = service.crowdfunding_id
        WHERE service.deleted = false`
        +(cat ? ` AND service.category = $(cat)` : ``)
        +(type ? ` AND service.service_type = $(type)` : ``)
        +(mygmax ? ` AND service.mygrant_value <= $(mygmax)` : ``)
        +(mygmin ? ` AND service.mygrant_value >= $(mygmin)` : ``)
        +(datemax ? ` AND service.date_created <= $(datemax)` : ``)
        +(datemin ? ` AND service.date_created >= $(datemin)` : ``)
        +`) s
        WHERE search_score > 0
        ORDER BY search_score DESC
        LIMIT $(limit);`;

    // place query
    db.any(query, {
            "q": q,
            "lang": lang,
            "limit": limit,
            "cat": cat,
            "type": type,
            "mygmax": mygmax,
            "mygmin": mygmin,
            "datemax": datemax,
            "datemin": datemin
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {get} /services/:id 04 - Get service by ID
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
    // check for valid input
    try {
        var id = req.params.id;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        SELECT service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name as provider_name, service.crowdfunding_id, crowdfunding.title as crowdfunding_title
        FROM service
        LEFT JOIN users on users.id = service.creator_id
        LEFT JOIN crowdfunding on crowdfunding.id = service.crowdfunding_id
        WHERE service.id = $(id)`;
    // place query
    db.one(query, {
            id
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });

});


/**
 * @api {put} /services/ 05 - Create service
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
 * @apiParam (RequestBody) {Integer} acceptable_radius Maximum distance from location where the service can be done (Optional)
 * @apiParam (RequestBody) {Integer} mygrant_value Number of hours the service will take
 * @apiParam (RequestBody) {String} service_type Type of the service [PROVIDE, REQUEST]
 * @apiParam (RequestBody) {Integer} creator_id ID of the creator if created by a user (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding if created by a crowdfunding (XOR creator_id)
 * @apiParam (RequestBody) {Boolean} repeatable If the service can be done more than one time
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
    // check for valid input
    try {
        var title = req.body.title;
        var description = req.body.description;
        var category = req.body.category;
        var location = req.body.location;
        var acceptable_radius = req.body.acceptable_radius;
        var mygrant_value = req.body.mygrant_value;
        var service_type = req.body.service_type;
        // check either for provider or crowdfunder
        var creator_id = req.body.hasOwnProperty('creator_id') ? req.body.creator_id : null;
        var crowdfunding_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
        var repeatable = req.body.hasOwnProperty('repeatable') ? req.body.repeatable : false;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        INSERT INTO service (title, description, category, location, acceptable_radius, mygrant_value, service_type, creator_id, crowdfunding_id, repeatable)
        VALUES ($(title), $(description), $(category), $(location), $(acceptable_radius), $(mygrant_value), $(service_type), $(creator_id), $(crowdfunding_id), $(repeatable))`;
    // place query
    db.none(query, {
            title,
            description,
            category,
            location,
            acceptable_radius,
            mygrant_value,
            service_type,
            creator_id,
            crowdfunding_id,
            repeatable
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {put} /services/:id 06 - Edit service
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
    // check for valid input
    try {
        var id = req.params.id;
        var acceptable_radius = req.body.hasOwnProperty('acceptable_radius') ? req.body.acceptable_radius : null;
        var repeatable = req.body.hasOwnProperty('repeatable') ? req.body.repeatable : null;
        // optionals:
        var title = req.body.hasOwnProperty('title') ? req.body.title : null;
        var description = req.body.hasOwnProperty('description') ? req.body.description : null;
        var category = req.body.hasOwnProperty('category') ? req.body.category : null;
        var location = req.body.hasOwnProperty('location') ? req.body.location : null;
        var mygrant_value = req.body.hasOwnProperty('mygrant_value') ? req.body.mygrant_value : null;
        var service_type = req.body.hasOwnProperty('service_type') ? req.body.service_type : null;
        var repeatable = req.body.hasOwnProperty('repeatable') ? req.body.repeatable : null;
    } catch (err) {
        res.sendStatus(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = 'UPDATE service SET '
        + [
            title ? 'title=$(title)' : null,
            description ? 'description=$(description)' : null,
            category ? 'category=$(category)' : null,
            location ? 'location=$(location)' : null,
            acceptable_radius ? 'acceptable_radius=$(acceptable_radius)' : null,
            mygrant_value ? 'mygrant_value=$(mygrant_value)' : null,
            service_type ? 'service_type=$(service_type)' : null,
            repeatable ? 'repeatable=$(repeatable)' : null,
        ].filter(Boolean).join(', ')
        +' WHERE id=$(id)';
    // place query
    db.none(query, {
        "id": id,
        "title": title,
        "description": description,
        "category": category,
        "location": location,
        "acceptable_radius": acceptable_radius,
        "mygrant_value": mygrant_value,
        "service_type": service_type,
        "repeatable"; repeatable,
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {delete} /services/:id 07 - Delete service
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
    // check for valid input
    try {
        var id = req.params.id;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        UPDATE service
        SET deleted=true
        WHERE id=$(id)`;
    // place query
    db.none(query, {
            id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


//
//
// IMAGES
//
//


/**
 * @api {get} /services/:id/images 08 - Get service images
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
// TODO Get images from amazon s3
router.get('/:id/images', function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        SELECT service_image.service_id, service_image.image_url
        FROM service_image
        WHERE service_image.service_id = $(id)`;
    // place query
    db.any(query, {
            id
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});


/**
 * @api {put} /services/:id/images 09 - Create service image
 * @apiName CreateServiceImage
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Upload image and add it to the service's images
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get images of
 * @apiParam (RequestFiles) {File} file Image file of the image
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
// TODO save file to amazon s3
router.put('/:id/images', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var filename = 'TODO';
        // TODO: save filename from req.files.image?? and pass filename onwards
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        INSERT INTO service_image (service_id, image_url)
        VALUES ($(service_id), $(filename))`;
    // place query
    db.any(query, {
            filename,
            service_id
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});


/**
 * @api {delete} /services/:id/images/:image 10 - Delete service image
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
// TODO delete file from amazon s3
router.delete('/:id/images/:image', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var image_url = req.params.image;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        DELETE FROM service_image
        WHERE service_id=$(service_id) AND image_url=$(image_url);`;
    // place query
    db.none(query, {
            service_id,
            image_url
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


//
//
// OFFERS
//
//


/**
 * @api {get} /services/:id/offers 11 - Get service offers
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
    // check for valid input
    try {
        var service_id = req.params.id;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        SELECT *
        FROM (SELECT 'user' as type, users.id as requester_id, users.full_name as requester_name
            FROM users
            INNER JOIN service_offer ON service_offer.candidate_id = users.id
            INNER JOIN service ON service_offer.service_id = service.id
            WHERE service_offer.service_id = $(service_id)
            UNION
            SELECT 'crowdfunding' as type, crowdfunding.id as requester_id, crowdfunding.title as requester_name
            FROM crowdfunding
            INNER JOIN crowdfunding_offer ON crowdfunding_offer.crowdfunding_id = crowdfunding.id
            INNER JOIN service ON crowdfunding_offer.service_id = service.id
            WHERE crowdfunding_offer.service_id = $(service_id)) s`;
    // place query
    db.any(query, {
        service_id
    })
    .then(data => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


/**
 * @api {get} /services/:id/offers/:type/:candidate 12 - Get specific offer
 * @apiName GetServiceSpecificOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Get offer made to a service by a user or crowdfunding
 *
 * @apiParam (RequestParam) {Integer} id ID of the service of the offer
 * @apiParam (RequestParam) {String} type Depends if the offer was made by a crowdfunding or by a user ('crowdfunding, 'user')
 * @apiParam (RequestParam) {Integer} candidate ID of the candidate that made the offer
 *
 * @apiExample Syntax
 * GET: /api/services/<ID>/offers/<TYPE>/<CANDIDATE>
 * @apiExample Example 1
 * GET: /api/services/5/offers/user/10
 * @apiExample Example 2
 * GET: /api/services/5/offers/crowdfunding/10
 *
 * @apiSuccess (Success 200) requester Users making the offers {requester_id, requester_name}
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:id/offers/:type/:candidate', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var type = req.params.type;
        if (type !== 'user' && type !== 'crowdfunding') {
            throw 'Invalid offer type';
        }
        var candidate_id = req.params.candidate;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    let query;
    if (type === 'user') {
        query = `
            SELECT users.id as requester_id, users.full_name as requester_name
            FROM users
            INNER JOIN service_offer ON service_offer.candidate_id = users.id
            INNER JOIN service ON service_offer.service_id = service.id
            WHERE service_offer.service_id = $(service_id) AND service_offer.candidate_id = $(candidate_id)`;
    }
    else {
        query = `
            SELECT crowdfunding.id as requester_id, crowdfunding.title as requester_name
            FROM crowdfunding
            INNER JOIN crowdfunding_offer ON crowdfunding_offer.crowdfunding_id = crowdfunding.id
            INNER JOIN service ON crowdfunding_offer.service_id = service.id
            WHERE crowdfunding_offer.service_id = $(service_id) AND crowdfunding_offer.crowdfunding_id = $(candidate_id)`;
    }


    // place query
    db.any(query, {
        service_id,
        candidate_id
    })
    .then(data => {
        res.status(200)
            .json(data);
    })
    .catch(error => {
        res.status(500)
            .json(error.message);
    });
});


/**
 * @api {post} /services/:id/offers 13 - Make service offer
 * @apiName MakeServiceOffer
 * @apiGroup Service
 * @apiPermission authenticated user
 *
 * @apiDescription Create offer to a service
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to make offer to (service can't have deleted=true)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding making the offer (Optional)
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
 *      crowdfunding_id: 10,
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/:id/offers', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var candidate_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : 8; // TODO SESSION ID
        // TODO never must have partner + crowdfunding at same time
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }

    // TODO dont allow offers on deleted services -> make this constraint in db
    let query;
    if (req.body.hasOwnProperty('crowdfunding_id')) {
        query = `
            INSERT INTO crowdfunding_offer (service_id, crowdfunding_id)
            SELECT $(service_id), $(candidate_id)
            WHERE EXISTS (SELECT * FROM service WHERE service.id=$(service_id) AND deleted=false)
            RETURNING service_id;`;
    }
    else {
        query = `
            INSERT INTO service_offer (service_id, candidate_id)
            SELECT $(service_id), $(candidate_id)
            WHERE EXISTS (SELECT * FROM service WHERE service.id=$(service_id) AND deleted=false)
            RETURNING service_id;`;
    }

    db.one(query, {
        service_id,
        candidate_id
    })
    .then(data => {
        if (data.service_id) {
            res.sendStatus(200);
        }
        else {
            res.status(404).json('Service not found');
        }
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


/**
 * @api {post} /services/:id/offers/accept 14 - Accept service offer
 * @apiName AcceptServiceOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Accept service offer
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to offer to accept (service can't have deleted=true)
 * @apiParam (RequestBody) {Integer} partner_id ID of the user that made the offer (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding that made the offer (XOR partner_id)
 * @apiParam (RequestBody) {Date} date_scheduled Date the service is goind to be provided
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
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/:id/offers/accept', function(req, res) {
    // check for valid input
    try {
        // TODO check if SESSION USER is service creator
        var service_id = req.params.id;
        var partner_id = req.body.hasOwnProperty('partner_id') ? req.body.partner_id : null;
        var crowdfunding_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
        // TODO never must have partner + crowdfunding at same time
        var date_scheduled = req.body.date_scheduled;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    // TODO don't allow offers on deleted services -> make this constraint in db
    // TODO only allow instances to be created when an offer exists -> make this constraint in db
    const query = ` 
        INSERT INTO service_instance (service_id, partner_id, crowdfunding_id, date_scheduled)
        SELECT $(service_id), $(partner_id), $(crowdfunding_id), $(date_scheduled)
        WHERE EXISTS (SELECT * FROM service WHERE service.id=$(service_id) AND deleted=false)
        RETURNING service_id;`;
    // place query
    db.one(query, {
        service_id,
        partner_id,
        crowdfunding_id,
        date_scheduled
    })
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


/**
 * @api {post} /services/:id/offers/decline 15 - Decline service offer
 * @apiName DeclineServiceOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiDescription Removes service offer
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to offer to accept
 * @apiParam (RequestBody) {Integer} partner_id ID of the user that made the offer (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding that made the offer (XOR partner_id)
 * @apiParam (RequestBody) {Date} date_scheduled Date the service is goind to be provided
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
//TODO changed from delte to post
router.post('/:id/offers/decline', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var candidate_id = req.body.hasOwnProperty('partner_id') ? req.body.partner_id : req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
        // TODO never must have partner + crowdfunding at same time
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    let query;
    if (req.body.hasOwnProperty('crowdfunding_id')) {
        query = `
            DELETE FROM crowdfunding_offer
            WHERE crowdfunding_offer.service_id = $(service_id) AND crowdfunding_offer.crowdfunding_id = $(candidate_id)`;
    }
    else {
        query = `
            DELETE FROM service_offer
            WHERE service_offer.service_id = $(service_id) AND service_offer.candidate_id = $(candidate_id)`;
    }

    // place query
    db.none(query, {
        service_id,
        candidate_id
    })
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


//
//
// REVIEW
//
//


/**
 * @api {put} /services/instance/:id 16 - Rate a service
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
 * POST: /api/instance/<ID>
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
    // check for valid input
    try {
        var service_instance_id = req.params.id;
        var candidate_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : 404; // TODO SESSION ID
        var rating = req.body.rating;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    let query;
    if (req.body.hasOwnProperty('crowdfunding_id')) {
        query =
            `WITH partner AS (
                UPDATE service_instance
                SET partner_rating=$(rating)
                WHERE id=$(service_instance_id)
                AND crowdfunding_id=$(candidate_id)
                RETURNING id
            ),
            creator AS (
                UPDATE service_instance
                SET creator_rating=$(rating)
                WHERE id=$(service_instance_id)
                AND EXISTS (
                    SELECT *
                    FROM service
                    JOIN service_instance
                    ON service.id=service_instance.service_id
                    WHERE service_instance.id=$(service_instance_id)
                    AND service.crowdfunding_id=$(candidate_id))
                RETURNING id
            )
            SELECT * FROM partner
            UNION
            SELECT * FROM creator`;
    }
    else {
        query =
            `WITH partner AS (
                UPDATE service_instance
                SET partner_rating=$(rating)
                WHERE id=$(service_instance_id)
                AND partner_id=$(candidate_id)
                RETURNING id
            ),
            creator AS (
                UPDATE service_instance
                SET creator_rating=$(rating)
                WHERE id=$(service_instance_id)
                AND EXISTS (
                    SELECT *
                    FROM service
                    JOIN service_instance
                    ON service.id=service_instance.service_id
                    WHERE service_instance.id=$(service_instance_id)
                    AND service.creator_id=$(candidate_id))
                RETURNING id
            )
            SELECT * FROM partner
            UNION
            SELECT * FROM creator`;
    }
    // place query
    db.one(query, {
        service_instance_id,
        candidate_id,
        rating
    })
    .then(data => {
        res.status(200);
    })
    .catch(error => {
        res.status(500).json(error);
    });

});


module.exports = router;