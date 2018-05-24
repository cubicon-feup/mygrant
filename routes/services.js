var express = require('express');
var router = express.Router();
var db = require('../config/database');
var image = require('../images/Image');

const expressJwt = require('express-jwt');
const appSecret = require('../config/config').secret;
const authenticate = expressJwt({ secret: appSecret });
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
 * @apiParam (RequestQueryParams) {String} q Search query; seraches among titles and descriptions (Optional)
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
router.get('/', function(req, res) { // check for valid input
    try {
        var q = req.query.hasOwnProperty('q') ? req.query.q.split(' ').join(' | ') : null;
        // paging
        var itemsPerPage = req.query.hasOwnProperty('items') && req.query.items < 50 ? req.query.items : 50;
        const page = req.query.hasOwnProperty('page') && req.query.page > 1 ? req.query.page : 1;
        var offset = (page - 1) * itemsPerPage;
        // order by:
        var order = req.query.hasOwnProperty('order') ? req.query.order.replace(/[|&;$%@"<>()+,]/g, "") : req.query.hasOwnProperty('q') ? 'search_score' : 'title';
        // ascending / descending
        var asc = req.query.hasOwnProperty('asc') ? req.query.asc == 'true' : true;
        // filters:
        var crowdfunding_only = req.query.hasOwnProperty('owner') && req.query.owner=="crowdfundings";
        var invidivuals_only = req.query.hasOwnProperty('owner') && req.query.owner=="individuals";
        var lang = req.query.hasOwnProperty('lang') ? req.query.lang : 'english'; // lang can either be 'english' or 'portuguese':
        var inc_descr = req.query.hasOwnProperty('inc_descr') ? req.query.inc_descr != 'no' : true;
        var cat = req.query.hasOwnProperty('cat') ? req.query.cat.toUpperCase() : false;
        var type = req.query.hasOwnProperty('type') ? req.query.type.toUpperCase() : false;
        var mygmax = req.query.hasOwnProperty('mygmax') ? req.query.mygmax : false;
        var mygmin = req.query.hasOwnProperty('mygmin') ? req.query.mygmin : false;
        var datemax = req.query.hasOwnProperty('datemax') ? req.query.datemax : false;
        var datemin = req.query.hasOwnProperty('datemin') ? req.query.datemin : false;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // define first query
    const query_latlon = `SELECT latitude, longitude FROM users WHERE id=$(user_id)`;
    db.one(query_latlon, {user_id: req.user.id})
        .then(data => {
            const latitude_ref = data.latitude; 
            const longitude_ref = data.longitude;
            
            // define query
            const query = `
                SELECT *
                FROM (
                SELECT service.id AS service_id, service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name AS provider_name, service.crowdfunding_id, crowdfunding.title as crowdfunding_title,
                2 * 3961 * asin(sqrt((sin(radians((service.latitude - $(latitude_ref)) / 2))) ^ 2 + cos(radians($(latitude_ref))) * cos(radians(service.latitude)) * (sin(radians((service.longitude - $(longitude_ref)) / 2))) ^ 2)) AS distance
                ${q ? `, ts_rank_cd(to_tsvector($(lang), service.title ${inc_descr ? '|| \'. \' || service.description' : ''} || '. ' || service.location || '. ' || users.full_name),
                to_tsquery($(lang), $(q))) AS search_score` : ``}
                FROM service
                LEFT JOIN users on users.id = service.creator_id
                LEFT JOIN crowdfunding on crowdfunding.id = service.crowdfunding_id
                WHERE service.deleted = false
                ${crowdfunding_only ? ' AND service.crowdfunding_id IS NOT NULL' : ''}
                ${invidivuals_only ? ' AND service.creator_id IS NOT NULL' : ''}
                ${cat ? ' AND service.category = $(cat)' : ''}
                ${type ? ' AND service.service_type = $(type)' : ''}
                ${mygmax ? ' AND service.mygrant_value <= $(mygmax)' : ''}
                ${mygmin ? ' AND service.mygrant_value >= $(mygmin)' : ''}
                ${datemax ? ' AND service.date_created <= $(datemax)' : ''}
                ${datemin ? ' AND service.date_created >= $(datemin)' : ''}
                ) s 
                ${q ? 'WHERE search_score > 0' : ''}
                ORDER BY ${order} ${asc ? 'ASC' : 'DESC'}
                LIMIT $(itemsPerPage) OFFSET $(offset);`;
            // distance based on: http://daynebatten.com/2015/09/latitude-longitude-distance-sql/
            // graphical representation of LatLong: http://www.learner.org/jnorth/images/graphics/mclass/Lat_Long.gif

            // place query
            db.any(query, {
                    q,
                    itemsPerPage,
                    offset,
                    lang,
                    cat,
                    type,
                    mygmax,
                    mygmin,
                    datemax,
                    datemin,
                    order,
                    latitude_ref,
                    longitude_ref
                })
                .then(data => {
                    res.status(200).json(data);
                })
                .catch(error => {
                    res.status(500).json(error);
                });
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {get} /services/search-count - Get number of results and pages of a services search
 * @apiName GetServicesNumPages
 * @apiGroup Service
 * @apiPermission visitor
 *
 * @apiDescription Returns the number of pages of a services search
 *
 * @apiParam (RequestQueryParams) {String} q Search query; seraches among titles and descriptions (Optional)
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
 * GET: /api/services/search-count?q=<QUERY>
 * @apiExample Example 1
 * GET: /api/services/search-count?q=support+tangible+extranet
 * @apiExample Example 2
 * GET: /api/services/search-count?q=tangible services&desc=no
 * @apiExample Example 3
 * GET: /api/services/search-count?q=support paradigms&lang=english&limit=10&cat=fun&type=request
 * @apiExample Example 4
 * GET: /api/services/search-count?q=support paradigms&lang=english&limit=100&mygmax=50&mygmin=30&datemin=2018-01-01
 * @apiExample Example 5
 * GET: /api/services/search-count?q=service&order=distance&asc=false
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
router.get(['/num-pages', '/search-count', '/count', '/npages'], function(req, res) {
    try {
        var q = req.query.hasOwnProperty('q') ? req.query.q.split(' ').join(' | ') : null;
        // paging
        var itemsPerPage = req.query.hasOwnProperty('items') && req.query.items < 50 ? req.query.items : 50;
        const page = req.query.hasOwnProperty('page') && req.query.page > 1 ? req.query.page : 1;
        var offset = (page - 1) * itemsPerPage;
        // order by:
        var order = req.query.hasOwnProperty('order') ? req.query.order.replace(/[|&;$%@"<>()+,]/g, "") : req.query.hasOwnProperty('q') ? 'search_score' : 'title';
        // ascending / descending
        var asc = req.query.hasOwnProperty('asc') ? req.query.asc == 'true' : true;
        // filters:
        var crowdfunding_only = req.query.hasOwnProperty('owner') && req.query.owner=="crowdfundings";
        var invidivuals_only = req.query.hasOwnProperty('owner') && req.query.owner=="individuals";
        var lang = req.query.hasOwnProperty('lang') ? req.query.lang : 'english'; // lang can either be 'english' or 'portuguese':
        var inc_descr = req.query.hasOwnProperty('inc_descr') ? req.query.inc_descr != 'no' : true;
        var cat = req.query.hasOwnProperty('cat') ? req.query.cat.toUpperCase() : false;
        var type = req.query.hasOwnProperty('type') ? req.query.type.toUpperCase() : false;
        var mygmax = req.query.hasOwnProperty('mygmax') ? req.query.mygmax : false;
        var mygmin = req.query.hasOwnProperty('mygmin') ? req.query.mygmin : false;
        var datemax = req.query.hasOwnProperty('datemax') ? req.query.datemax : false;
        var datemin = req.query.hasOwnProperty('datemin') ? req.query.datemin : false;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // define query
    const query = `
        SELECT COUNT(*) as COUNT
        FROM (
        SELECT service.id
        ${q ? `, ts_rank_cd(to_tsvector($(lang), service.title ${inc_descr ? '|| \'. \' || service.description' : ''} || '. ' || service.location || '. ' || users.full_name),
        to_tsquery($(lang), $(q))) AS search_score` : ``}
        FROM service
        LEFT JOIN users on users.id = service.creator_id
        LEFT JOIN crowdfunding on crowdfunding.id = service.crowdfunding_id
        WHERE service.deleted = false
        ${crowdfunding_only ? ' AND service.crowdfunding_id IS NOT NULL' : ''}
        ${invidivuals_only ? ' AND service.creator_id IS NOT NULL' : ''}
        ${cat ? ' AND service.category = $(cat)' : ''}
        ${type ? ' AND service.service_type = $(type)' : ''}
        ${mygmax ? ' AND service.mygrant_value <= $(mygmax)' : ''}
        ${mygmin ? ' AND service.mygrant_value >= $(mygmin)' : ''}
        ${datemax ? ' AND service.date_created <= $(datemax)' : ''}
        ${datemin ? ' AND service.date_created >= $(datemin)' : ''}
        ) s 
        ${q ? 'WHERE search_score > 0' : ''}`;
    // distance based on: http://daynebatten.com/2015/09/latitude-longitude-distance-sql/
    // graphical representation of LatLong: http://www.learner.org/jnorth/images/graphics/mclass/Lat_Long.gif

    // place query
    db.one(query, {
            q,
            lang,
            cat,
            type,
            mygmax,
            mygmin,
            datemax,
            datemin,
            order
        })
        .then(data => {
            res.status(200).json({
                'results': data.count,
                'pages': Math.ceil(data.count / itemsPerPage)
            });
        })
        .catch(error => {
            res.status(500).json(error);
        });
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
    // check for valid input
    try {
        var id = req.params.id;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });

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
    db.one(query, { id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });

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
router.put('/', authenticate, function(req, res) {
    // check for valid input
    try {
        var title = req.body.title;
        var description = req.body.description;
        var category = req.body.category;
        var location = req.body.location;
        var acceptable_radius = req.body.acceptable_radius;
        var mygrant_value = req.body.mygrant_value;
        var service_type = req.body.service_type;
        var creator_id = req.body.hasOwnProperty('creator_id') ? req.body.creator_id : null;
        var crowdfunding_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
        var repeatable = req.body.hasOwnProperty('repeatable') ? req.body.repeatable : false;
        var latitude = req.body.hasOwnProperty('latitude') ? req.body.latitude : null;
        var longitude = req.body.hasOwnProperty('longitude') ? req.body.longitude : null;
        if (creator_id == null && crowdfunding_id == null) {
            throw new Error('Missing either creator_id or crowdfunding_id');
        }
        if (creator_id != null && crowdfunding_id != null) {
            throw new Error('EITHER creator_id OR crowdfunding_id must be selected, not both.');
        }
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });

        return;
    }
    // define query
    const query = `
        INSERT INTO service (title, description, category, location, latitude, longitude, acceptable_radius, mygrant_value, service_type, creator_id, crowdfunding_id, repeatable)
        VALUES ($(title), $(description), $(category), $(location), $(latitude), $(longitude), $(acceptable_radius), $(mygrant_value), $(service_type), $(creator_id), $(crowdfunding_id), $(repeatable))
        RETURNING id;`;
    // place query
    db.one(query, {
            title,
            description,
            category,
            location,
            acceptable_radius,
            mygrant_value,
            service_type,
            creator_id,
            crowdfunding_id,
            repeatable,
            latitude,
            longitude
        })
        .then((data) => {
            res.status(200).send(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
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
router.put('/:id', authenticate, function(req, res) {
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
        var latitude = req.body.hasOwnProperty('latitude') ? req.body.latitude : null;
        var longitude = req.body.hasOwnProperty('longitude') ? req.body.longitude : null;
    } catch (err) {
        res.sendStatus(400).json({ 'error': err.toString() });

        return;
    }
    // define query
    const query =
        `UPDATE service SET ${
         [
            title ? 'title=$(title)' : null,
            description ? 'description=$(description)' : null,
            category ? 'category=$(category)' : null,
            location ? 'location=$(location)' : null,
            acceptable_radius ? 'acceptable_radius=$(acceptable_radius)' : null,
            mygrant_value ? 'mygrant_value=$(mygrant_value)' : null,
            service_type ? 'service_type=$(service_type)' : null,
            latitude ? 'latitude=$(latitude)' : null,
            longitude ? 'longitude=$(longitude)' : null
        ].filter(Boolean).join(', ')
        } WHERE id=$(id)`;
    // place query
    db.none(query, {
            id,
            title,
            description,
            category,
            location,
            acceptable_radius,
            mygrant_value,
            service_type,
            repeatable,
            latitude,
            longitude
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
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
router.delete('/:id', authenticate, function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });

        return;
    }
    // define query
    const query = `
        UPDATE service
        SET deleted=true
        WHERE id=$(id)`;
    // place query
    db.none(query, { id })
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
    // check for valid input
    try {
        var id = req.params.id;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // define query
    const query = `
        SELECT service_image.service_id, service_image.image_url
        FROM service_image
        WHERE service_image.service_id = $(id)`;
    // place query
    db.any(query, { id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
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
router.put('/:id/images', authenticate, function(req, res) {
    // get id
    try {
        var service_id = req.params.id;
        // get filename
        var filename = image.uploadImage(req, res, 'services/');
        if(filename === false){
            return;
        }
    } catch (err) {
        res.status(400).json(err);
        return;
    }
    // define query
    const query = `
        INSERT INTO service_image (service_id, image_url)
        VALUES ($(service_id), $(filename))`;
    db.none(query, {
        service_id,
        filename
    });
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
router.delete('/:id/images/:image', authenticate, function(req, res) {
    // get id
    try {
        var service_id = req.params.id;
        // get filename
        var image_url = req.params.image;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // define query //TODO: must be restricted to user
    const query = `
        DELETE FROM service_image 
        WHERE service_id=$(service_id) AND image_url=$(image_url);`;
    db.none(query, {
            service_id,
            image_url
        })
        .then(data => {
            image.removeImage(req, res, 'services/'+image_url);
        })
        .catch(error => {
            res.status(500).send(error);
        });
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
 * @apiSuccess (Success 200) requesters List of the users making the offers {type, requester_id, requester_name, date_proposed}
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:id/offers', authenticate, function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });

        return;
    }
    // define query
    const query = `
        SELECT *
        FROM (SELECT 'user' as type, users.id as requester_id, users.full_name as requester_name, date_proposed
            FROM users
            INNER JOIN service_offer ON service_offer.candidate_id = users.id
            INNER JOIN service ON service_offer.service_id = service.id
            WHERE service_offer.service_id = $(service_id)
            UNION
            SELECT 'crowdfunding' as type, crowdfunding.id as requester_id, crowdfunding.title as requester_name, date_proposed
            FROM crowdfunding
            INNER JOIN crowdfunding_offer ON crowdfunding_offer.crowdfunding_id = crowdfunding.id
            INNER JOIN service ON crowdfunding_offer.service_id = service.id
            WHERE crowdfunding_offer.service_id = $(service_id)) s`;
    // place query
    db.any(query, { service_id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


/**
 * @api {get} /services/:id/offers/:type/:candidate - Get specific offer
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
router.get('/:id/offers/:type/:candidate', authenticate, function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var type = req.params.type;
        if (type !== 'user' && type !== 'crowdfunding') {
            throw 'Invalid offer type';
        }
        var candidate_id = req.params.candidate;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });

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
    } else {
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
router.post('/:id/offers', authenticate, function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var partner_id = req.body.hasOwnProperty('partner_id') ? req.body.partner_id : null;
        var crowdfunding_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
        var date_proposed = req.body.hasOwnProperty('date_proposed') ? req.body.date_proposed : null;
        if (partner_id == null && crowdfunding_id == null) {
            throw new Error('Missing either partner_id or crowdfunding_id');
        }
        if (partner_id != null && crowdfunding_id != null) {
            throw new Error('EITHER partner_id OR crowdfunding_id must be selected, not both.');
        }
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }

    // TODO: dont allow offers on deleted services -> make this constraint in db
    let query;
    if (crowdfunding_id != null) {
        query = `
            INSERT INTO crowdfunding_offer (service_id, crowdfunding_id, date_proposed)
            SELECT $(service_id), $(crowdfunding_id), $(date_proposed)
            WHERE EXISTS (SELECT * FROM service WHERE service.id=$(service_id) AND deleted=false)
            RETURNING service_id;`;
    } else {
        query = `
            INSERT INTO service_offer (service_id, candidate_id, date_proposed)
            SELECT $(service_id), $(partner_id), $(date_proposed)
            WHERE EXISTS (SELECT * FROM service WHERE service.id=$(service_id) AND deleted=false)
            RETURNING service_id;`;
    }

    db.one(query, {
            service_id,
            partner_id,
            crowdfunding_id,
            date_proposed
        })
        .then(data => {
            if (data.service_id) {
                res.sendStatus(200);
            } else {
                res.status(404).json('Service not found');
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
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
router.post('/:id/offers/accept', authenticate, function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var date_scheduled = req.body.date_scheduled;
        var partner_id = req.body.hasOwnProperty('partner_id') ? req.body.partner_id : null;
        var crowdfunding_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
        if (partner_id == null && crowdfunding_id == null) {
            throw new Error('Missing either partner_id or crowdfunding_id');
        }
        if (partner_id != null && crowdfunding_id != null) {
            throw new Error('EITHER partner_id OR crowdfunding_id must be selected, not both.');
        }
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // 
    // TODO: don't allow offers on deleted services -> make this constraint in db
    // TODO: only allow instances to be created when an offer exists -> make this constraint in db
    // ...

    // check if req.user.id is service creator 
    const creator_id = req.user.id;
    const query_check_creator = `
        SELECT 1 AS exists WHERE EXISTS (
            SELECT service.creator_id
            FROM service
            WHERE service.id=$(service_id) AND service.creator_id=$(creator_id)
        ) OR EXISTS (
            SELECT crowdfunding.creator_id
            FROM service
            INNER JOIN crowdfunding 
            ON crowdfunding.id=service.crowdfunding_id
            WHERE service.id=$(service_id) AND crowdfunding.creator_id=$(creator_id)
        )`;
    db.any(query_check_creator, {
            service_id,
            creator_id
        })
        .then((data) => {
            console.log(data);
            if (data.length == 0){
                res.status(403).send('Current user is not the service owner!');
                return;
            }

            // define query
            let query;
            if (req.body.hasOwnProperty('crowdfunding_id')){
                // crowdfunding_offer -> service_instance
                query = ` 
                    INSERT INTO service_instance (service_id, partner_id, crowdfunding_id, date_scheduled)
                    SELECT service.id, null, crowdfunding_offer.crowdfunding_id, crowdfunding_offer.date_proposed 
                    FROM crowdfunding_offer
                    LEFT JOIN service
                    ON service.id = crowdfunding_offer.service_id 
                    WHERE service.id=$(service_id) AND crowdfunding_offer.crowdfunding_id=$(crowdfunding_id) AND service.deleted=false
                    RETURNING service_id;`;
            }
            else {
                // service_offer -> service_instance
                query = ` 
                    INSERT INTO service_instance (service_id, partner_id, crowdfunding_id, date_scheduled)
                    SELECT service.id, service_offer.candidate_id, null, service_offer.date_proposed 
                    FROM service_offer
                    LEFT JOIN service
                    ON service.id = service_offer.service_id 
                    WHERE service.id=$(service_id) AND service_offer.candidate_id=$(partner_id) AND service.deleted=false
                    RETURNING service_id;`; 
            }
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
                    console.log(error);
                    res.status(500).json(error);
                });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
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
router.delete('/:id/offers/decline', authenticate, function(req, res) {
    // check for valid input
    console.log(req.params, req.body)
    try {
        var service_id = req.params.id;
        var partner_id = req.body.hasOwnProperty('partner_id') ? req.body.partner_id : null;
        var crowdfunding_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
        if (partner_id == null && crowdfunding_id == null)
            throw new Error('Missing candidate. Requires any of partner_id or crowdfunding_id.');
        if (partner_id != null && crowdfunding_id != null)
            throw new Error('EITHER partner_id OR crowdfunding_id must be selected, not both.');
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
        return;
    }
    // define query
    let query;
    if (crowdfunding_id != null) {
        query = `
            DELETE FROM crowdfunding_offer
            WHERE crowdfunding_offer.service_id = $(service_id) AND crowdfunding_offer.crowdfunding_id = $(crowdfunding_id)`;
    } else {
        query = `
            DELETE FROM service_offer
            WHERE service_offer.service_id = $(service_id) AND service_offer.candidate_id = $(partner_id)`;
    }

    // place query
    db.none(query, {
            service_id,
            partner_id,
            crowdfunding_id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });
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
router.put('/instance/:id', authenticate, function(req, res) {
    // check for valid input
    try {
        var service_instance_id = req.params.id;
        var candidate_id = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : req.user.id;
        var rating = req.body.rating;
    } catch (err) {
        res.status(400).json({ 'error': err.toString() });
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
    } else {
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
    db.oneOrNone(query, {
            service_instance_id,
            candidate_id,
            rating
        })
        .then(data => {
            res.status(200).send(data);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json(error);
        });

});

/**
 * @api {get} /services/instance/:id Get the service instance requester
 * @apiName GetServiceInstanceRequester
 * @apiGroup Service
 * @apiPermission service creator
 * */
// TODO: finish api doc.
router.get('/:service_id/instance/partner', authenticate, function(req, res) {
    let serviceId = req.params.service_id;
    let query =
        `SELECT users.id as requester_id, users.full_name as requester_name
        FROM users
        INNER JOIN service_instance ON service_instance.partner_id = users.id
        WHERE service_instance.service_id = $(service_id);`;

    db.one(query, {
        service_id: serviceId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    });
});

// TODO: finish api doc.
router.get('/:service_id/instance', authenticate, function(req, res) {
    let serviceId = req.params.service_id;
    let query =
        `SELECT partner_id, users.full_name as partner_name, date_scheduled, creator_rating, partner_rating, service_instance.id as service_instance_id
        FROM service_instance
        INNER JOIN service ON service.id = service_instance.service_id
        INNER JOIN users ON users.id = partner_id
        WHERE service_instance.service_id = $(service_id);`;

    db.oneOrNone(query, {
        service_id: serviceId
    }).then(data => {
        res.status(200).json(data);
        console.log(data);
    }).catch(error => {
        res.status(500).json({error});
    })
})

// TODO: finish api doc
// TODO: are we using this route???
router.get('/:service_id/is_owner_or_partner', authenticate, function(req, res) {
    let userId = req.user.id;
    let serviceId = req.params.service_id;
    let query =
        `SELECT service_instance.partner_id, crowdfunding.creator_id
        FROM service_instance
        INNER JOIN service ON service.id = service_instance.service_id
        INNER JOIN crowdfunding ON crowdfunding.id = service.crowdfunding_id
        WHERE service_instance.service_id = $(service_id);`;

    db.oneOrNone(query, {
        service_id: serviceId
    }).then(data => {
        if(userId === data.creator_id)
            res.status(200).json({type: 'creator'});
        else if(userId === data.partner_id)
            res.status(200).json({type: 'partner'});
        else res.status(200).json({type: 'none'});
    }).catch(error => {
        res.status(500).json({error});
    })
})

module.exports = router;