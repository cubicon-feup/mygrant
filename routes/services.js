var express = require('express');
var router = express.Router();
var db = require('../config/database');


//
//
// SERVICES
//
//


/**
 * [GET SERVICES LIST]
 * description:
 *      Get a list of services, by page, containing up to N items.
 *      The maximum of items/page is 50.
 * syntax:
 *      /api/services?page=<PAGE>&items=<ITEMS>
 * example:
 *      /api/services?page=3
 *      /api/services?page=1&items=25
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
        SELECT service.id, service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name as provider_name
        FROM service
        INNER JOIN users on users.id = service.creator_id
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
 * [GET NUMBER OF PAGES OF SERVICES LIST]
 * description:
 *      Returns the number of pages (with each page having up to N items)
 * syntax:
 *      /api/services/num-pages?items=<ITEMS>
 * example:
 *      /api/services/num-pages?items=30
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
    const query = `SELECT COUNT(id) as npages from service;`;
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
 * [SEARCH FOR SERVICES]
 * description:
 *      Search among services' titles and descriptions using the given query text
 * syntax:
 *      /api/services/search?q=...
 * optional parameters:
 *     limit: maximum number of results (Default is 50)
 *     lang: 'portuguese' | 'english' (Default is english)
 *     desc: yes | no . Searches in description also (Default is yes)
 *     cat: restricts results to given category
 *     type: REQUEST | PROVIDE . restricts results to a given service_type
 *     mygmax: Max bound for mygrant_value
 *     mygmin: Min bound for mygrant_value
 *     datemax: Max bound for created_date
 *     datemin: Min bound for created_date
 * examples:
 *      /api/services/search?q=support+tangible+extranet
 *      /api/services/search?q=tangible services&desc=no
 *      /api/services/search?q=support paradigms&lang=english&limit=10&cat=fun&type=request
 *      /api/services/search?q=support paradigms&lang=english&limit=100&mygmax=50&mygmin=30&datemin=2018-01-01
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
        SELECT service.id AS service_id, service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.id AS user_id, users.full_name AS provider_name,
        ts_rank_cd(to_tsvector($(lang), service.title `+(search_desc?`|| '. ' || service.description`:``)+` || '. ' || users.full_name),
        to_tsquery($(lang), $(q))) AS search_score
        FROM service INNER JOIN users ON users.id = service.creator_id
        WHERE true`
        +(cat ? ` AND category = $(cat)` : ``)
        +(type ? ` AND service_type = $(type)` : ``)
        +(mygmax ? ` AND mygrant_value <= $(mygmax)` : ``)
        +(mygmin ? ` AND mygrant_value >= $(mygmin)` : ``)
        +(datemax ? ` AND date_created <= $(datemax)` : ``)
        +(datemin ? ` AND date_created >= $(datemin)` : ``)
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


// TODO documentation
// Get service by id
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
        SELECT service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name as provider_name
        FROM service
        INNER JOIN users on users.id = service.creator_id
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


// TODO documentation
// Put (create) service.
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
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        INSERT INTO service (title, description, category, location, acceptable_radius, mygrant_value, service_type, creator_id, crowdfunding_id)
        VALUES ($(title), $(description), $(category), $(location), $(acceptable_radius), $(mygrant_value), $(service_type), $(creator_id), $(crowdfunding_id))`;
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
            crowdfunding_id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});



// TODO documentation
// Put (update) service.
router.put('/:id', function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
        // optionals:
        var title = req.body.hasOwnProperty('title') ? req.body.title : null;
        var description = req.body.hasOwnProperty('description') ? req.body.description : null;
        var category = req.body.hasOwnProperty('category') ? req.body.category : null;
        var location = req.body.hasOwnProperty('location') ? req.body.location : null;
        var acceptable_radius = req.body.hasOwnProperty('acceptable_radius') ? req.body.acceptable_radius : null;
        var mygrant_value = req.body.hasOwnProperty('mygrant_value') ? req.body.mygrant_value : null;
        var service_type = req.body.hasOwnProperty('service_type') ? req.body.service_type : null;
        var acceptable_radius = req.body.hasOwnProperty('acceptable_radius') ? req.body.acceptable_radius : null;
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
            acceptable_radius ? 'acceptable_radius=$(acceptable_radius)' : null,
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
        "acceptable_radius": acceptable_radius,
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


// TODO documentation
// Delete service.
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
        DELETE FROM service
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


// TODO documentation
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
        SELECT image.id, image.filename
        FROM image
        INNER JOIN service_image ON service_image.image_id = image.id
        WHERE service_image.service_id = $(id)`;
    // place query
    db.any(query, {
            id
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


// TODO documentation
// TODO save file to amazon s3
// Add image.
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
        WITH rows AS (
        INSERT INTO image (filename) VALUES ($(filename)) RETURNING id
        )
        INSERT INTO service_image (service_id, image_id)
        SELECT $(service_id), id FROM rows`;
    // place query
    db.any(query, {
            filename,
            service_id
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


// TODO delete file from amazon s3
// Delete image.
router.delete('/:id/images/:image', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var image_id = req.params.image;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        DELETE FROM service_image
        WHERE service_id=$(service_id) AND image_id=$(image_id);
        DELETE FROM image 
        WHERE id=$(image_id)`;
    // place query
    db.none(query, {
            service_id,
            image_id
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


// Get list of offers.
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
        SELECT users.id as requester_id, users.full_name as requester_name
        FROM users
        INNER JOIN service_offer ON service_offer.candidate_id = users.id
        INNER JOIN service ON service_offer.service_id = service.id
        WHERE service_offer.service_id = $(service_id)`;
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


// Get specific offer.
router.get('/:id/offers/:candidate', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var candidate_id = req.params.candidate;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    const query = `
        SELECT users.id as requester_id, users.full_name as requester_name
        FROM users
        INNER JOIN service_offer ON service_offer.candidate_id = users.id
        INNER JOIN service ON service_offer.service_id = service.id
        WHERE service_offer.service_id = $(service_id) AND service_offer.candidate_id = $(candidate_id)`;
    // place query
    db.any(query, {
            service_id,
            candidate_id
        })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});


// Pick an offer.
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
    // TODO: fix db constraint error
    const query = ` 
        INSERT INTO service_instance (service_id, partner_id, crowdfunding_id, date_scheduled)
        VALUES ($(service_id), $(partner_id), $(crowdfunding_id), $(date_scheduled));`;
    // place query
    db.none(query, {
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


// Remove offer. //TODO changed from delte to post
router.post('/:id/offers/decline', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var candidate_id = req.params.candidate;
    } catch (err) {
        res.status(400).json({
            'error': err.toString()
        });
        return;
    }
    // define query
    // TODO: fix db constraint error for services of type REQUEST
    const query = `
        DELETE FROM service_offer
        WHERE service_offer.service_id = $(service_id) AND service_offer.candidate_id = $(candidate_id)`;
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