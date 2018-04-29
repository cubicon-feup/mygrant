var express = require('express');
var router = express.Router();
var db = require('../config/database');


//
//
// SERVICES
//
//


/**
 * @api {get} /services/ Get every active service
 * @apiName GetServices
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiParam (RequestQueryParams) {Integer} page page number to return (Optional)
 * @apiParam (RequestQueryParams) {Integer} items number of items per page default/max: 50 (Optional)
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
 * @api {get} /services/num-pages Get number of pages of active service list
 * @apiName GetServicesNumPages
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiParam (RequestQueryParams) {Integer} Items number of items per page default/max: 50 (Optional)
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
 * @api {get} /services/search Search among active services' titles and descriptions using the given query text
 * @apiName SearchService
 * @apiGroup Service
 * @apiPermission visitor
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
 * @api {get} /services/:id Get service info by ID
 * @apiName GetServiceByID
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiParam (RequestParams) {Integer} id ID of the service
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
 * @api {put} / Create Service
 * @apiName CreateService
 * @apiGroup Service
 * @apiPermission authenticated user
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
 * @api {put} /:id Edit Service
 * @apiName EditService
 * @apiGroup Service
 * @apiPermission service creator
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
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/:id', function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
    } catch (err) {
        res.sendStatus(400).json({
            'error': err.toString()
        });
        return;
    }

    // define initial query & query object
    let query = 'UPDATE service SET'; // edit_history=array_append(edit_history, message), message=$(message)
    const query_obj = {
        'id': req.params.id
    };

    // does the client want to change the title?
    if (req.body.hasOwnProperty('title')) {
        query += ' title=$(title),';
        query_obj.title = req.body.title;
    }

    // does the client want to change the description?
    if (req.body.hasOwnProperty('description')) {
        query += ' description=$(description),';
        query_obj.description = req.body.description;
    }

    // does the client want to change the category?
    if (req.body.hasOwnProperty('category')) {
        query += ' category=$(category),';
        query_obj.category = req.body.category;
    }

    // does the client want to change the location?
    if (req.body.hasOwnProperty('location')) {
        query += ' location=$(location),';
        query_obj.location = req.body.location;
    }

    // does the client want to change the acceptable_radius?
    if (req.body.hasOwnProperty('acceptable_radius')) {
        query += ' acceptable_radius=$(acceptable_radius),';
        query_obj.acceptable_radius = req.body.acceptable_radius;
    }

    // does the client want to change the mygrant_value?
    if (req.body.hasOwnProperty('mygrant_value')) {
        query += ' mygrant_value=$(mygrant_value),';
        query_obj.mygrant_value = req.body.mygrant_value;
    }

    // does the client want to change the service_type?
    if (req.body.hasOwnProperty('service_type')) {
        query += ' service_type=$(service_type),';
        query_obj.service_type = req.body.service_type;
    }

    // does the client want to change repeatable?
    if (req.body.hasOwnProperty('repeatable')) {
        query += ' repeatable=$(repeatable),';
        query_obj.service_type = req.body.service_type;
    }

    // check if query has changed at all
    if (query == 'UPDATE service SET') {
        // chop off last comma
        res.sendStatus(400).json({
            'error': 'No valid properties have been sent.'
        });
        return;
    }

    // complete last part of query
    query = query.substring(0, query.length - 1);
    query += ' WHERE id=$(id)';

    // place query
    db.none(query, query_obj)
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {delete} /:id Delete Service
 * @apiName DeleteService
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to delete
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
 * @api {get} /:id/images Get Service Images
 * @apiName GetServiceImages
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get images of
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
 * @api {put} /:id/images Create Service Image
 * @apiName CreateServiceImage
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get images of
 * @apiParam (RequestFiles) {File} file Image file of the image
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
 * @api {delete} /:id/images/:image Delete Service Image
 * @apiName DeleteServiceImage
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get images of
 * @apiParam (RequestParam) {String} image URL of the image to delete
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
 * @api {get} /:id/offers Get Service Offers
 * @apiName GetServiceOffers
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to get offers of
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
 * @api {get} /:id/offers/:type/:candidate Get Service Specific Offer
 * @apiName GetServiceSpecificOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiParam (RequestParam) {Integer} id ID of the service of the offer
 * @apiParam (RequestParam) {String} type Depends if the offer was made by a crowdfunding or by a user ('crowdfunding, 'user')
 * @apiParam (RequestParam) {Integer} candidate ID of the candidate that made the offer
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
 * @api {post} /:id/offers Make Service Offer
 * @apiName MakeServiceOffer
 * @apiGroup Service
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to make offer to (service can't have deleted=true)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding making the offer (Optional)
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
 * @api {post} /:id/offers/accept Accept Service Offer
 * @apiName AcceptServiceOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to offer to accept (service can't have deleted=true)
 * @apiParam (RequestBody) {Integer} partner_id ID of the user that made the offer (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding that made the offer (XOR partner_id)
 * @apiParam (RequestBody) {Date} date_scheduled Date the service is goind to be provided
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/:id/offers/accept', function(req, res) {
    // check for valid input
    try {
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
 * @api {post} /:id/offers/decline Decline Service Offer
 * @apiName DeclineServiceOffer
 * @apiGroup Service
 * @apiPermission service creator
 *
 * @apiParam (RequestParam) {Integer} id ID of the service to offer to accept
 * @apiParam (RequestBody) {Integer} partner_id ID of the user that made the offer (XOR crowdfunding_id)
 * @apiParam (RequestBody) {Integer} crowdfunding_id ID of the crowdfunding that made the offer (XOR partner_id)
 * @apiParam (RequestBody) {Date} date_scheduled Date the service is goind to be provided
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




module.exports = router;
