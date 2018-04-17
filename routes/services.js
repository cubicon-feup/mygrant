var express = require('express');
var router = express.Router();
var db = require('../config/database');


//
//
// SERVICES
//
//


// Get list of all services
router.get('/', function(req, res) {
    const limit = 10;
    // define query
    const query = `
        SELECT service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name as provider_name
        FROM service
        INNER JOIN users on users.id = service.creator_id
        LIMIT $(limit)`;
    // place query
    db.any(query, {
        "limit": limit
    })
    .then(data => {
        res.status(200).json({data});
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


// Search service by various parameters
// filters: by name, by date, by distance, by popularity, by user
router.get(['/search/:q','/search'], function(req, res) 
{    // check for valid input
    try {
        var q = req.query.hasOwnProperty('q') ? req.query.q : req.params.q;
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
        return;
    }

    // define query
    const query = `
        SELECT service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name as provider_name
        FROM service
        INNER JOIN users on users.id = service.creator_id
        WHERE to_tsvector(service.title || '. ' || service.description || '. ' || service.location || '. ' || users.full_name) @@ to_tsquery($(q))`;

    // place query
    db.any(query, {
        "q": q
    })
    .then((data) => {
        res.status(200).json({data});
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


// Get service by id
router.get('/:id', function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
        return;
    }
    // define query
    const query = `
        SELECT service.title, service.description, service.category, service.location, service.acceptable_radius, service.mygrant_value, service.date_created, service.service_type, service.creator_id, users.full_name as provider_name
        FROM service
        INNER JOIN users on users.id = service.creator_id
        WHERE service.id = $(id)`;
    // place query
    db.none(query, {
        "id": id
    })
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


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
    }  
    catch(err) {
        res.sendStatus(400).json({"error": err.toString()});
        return;
    }
    // define query
    const query = `
        INSERT INTO service (title, description, category, location, acceptable_radius, mygrant_value, service_type, creator_id, crowdfunding_id)
        VALUES ($(title), $(description), $(category), $(location), $(acceptable_radius), $(mygrant_value), $(service_type), $(creator_id), $(crowdfunding_id))`;
    // place query
    db.none(query, {
        "title": title,
        "description": description,
        "category": category,
        "location": location,
        "acceptable_radius": acceptable_radius,
        "mygrant_value": mygrant_value,
        "service_type": service_type,
        "creator_id": creator_id,
        "crowdfunding_id": crowdfunding_id
    })
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


// Put (update) service.
router.put('/:id', function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
    }
    catch(err) {
        res.sendStatus(400).json({"error": err.toString()});
        return;
    }

    // define initial query & query object
    let query = `UPDATE service SET`; //edit_history=array_append(edit_history, message), message=$(message)
    let query_obj = {"id": req.params.id};

    // does the client want to change the title?
    if (req.body.hasOwnProperty('title')) 
        query += ` title=$(title),`;
        query_obj.title = req.body.title;

    // does the client want to change the description?
    if (req.body.hasOwnProperty('description')) 
        query += ` description=$(description),`;
        query_obj.description = req.body.description;

    // does the client want to change the category?
    if (req.body.hasOwnProperty('category')) 
        query += ` category=$(category),`;
        query_obj.category = req.body.category;

    // does the client want to change the location?
    if (req.body.hasOwnProperty('location')) 
        query += ` location=$(location),`;
        query_obj.location = req.body.location;

    // does the client want to change the acceptable_radius?
    if (req.body.hasOwnProperty('acceptable_radius')) 
        query += ` acceptable_radius=$(acceptable_radius),`;
        query_obj.acceptable_radius = req.body.acceptable_radius;

    // does the client want to change the mygrant_value?
    if (req.body.hasOwnProperty('mygrant_value')) 
        query += ` mygrant_value=$(mygrant_value),`;
        query_obj.mygrant_value = req.body.mygrant_value;

    // does the client want to change the service_type?
    if (req.body.hasOwnProperty('service_type')) 
        query += ` service_type=$(service_type),`;
        query_obj.service_type = req.body.service_type;

    // does the client want to change the creator_id?
    if (req.body.hasOwnProperty('creator_id')) 
        query += ` creator_id=$(creator_id),`;
        query_obj.creator_id = req.body.creator_id;

    // does the client want to change the crowdfunding_id?
    if (req.body.hasOwnProperty('crowdfunding_id')) 
        query += ` crowdfunding_id=$(crowdfunding_id),`;
        query_obj.crowdfunding_id = req.body.crowdfunding_id;

    // check if query has changed at all
    if (query == `UPDATE service SET`){
        // chop off last comma
        res.sendStatus(400).json({"error":"No valid properties have been sent."});
        return;
    }
    
    // complete last part of query
    query = query.substring(0, query.length - 1);
    query += ` WHERE id=$(id)`;

    // place query
    db.none(query, query_obj)
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


// Delete service.
router.delete('/:id', function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
        return;
    }
    // define query
    const query = `
        DELETE FROM service
        WHERE id=$(id)`;
    // place query
    db.none(query, {
        "id": id
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


// Get images.
router.get('/:id/images', function(req, res) {
    // check for valid input
    try {
        var id = req.params.id;
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
        return;
    }
    // define query
    const query = `
        SELECT image.filename
        FROM image
        INNER JOIN service_image ON service_image.image_id = image.id
        WHERE service_image.service_id = $(id)`;
    // place query
    db.any(query, {
        "id": id
    })
    .then((data) => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


// Add image.
router.put('/:id/images', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var filename = "TODO";
        //TODO: save filename from req.files.image?? and pass filename onwards
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
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
        "filename": filename
        "service_id": service_id
    })
    .then((data) => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


// Delete image.
router.delete('/:id/images/:image', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var image_id = req.params.image;
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
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
        "service_id": service_id
        "image_id": image_id
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
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
        return;
    }
    // define query
    const query = `
        SELECT users.id as requester_id, users.full_name as requester_name, 
        FROM users
        INNER JOIN service_offer ON service_offer.candidate_id = users.id
        INNER JOIN service ON service_offer.service_id = service.id
        WHERE service_offer.service_id = $(service_id)`;
    // place query
    db.any(query, {
        "service_id": service_id
    })
    .then((data) => {
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
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
        return;
    }
    // define query
    const query = `
        SELECT users.id as requester_id, users.full_name as requester_name, 
        FROM users
        INNER JOIN service_offer ON service_offer.candidate_id = users.id
        INNER JOIN service ON service_offer.service_id = service.id
        WHERE service_offer.service_id = $(service_id) AND service_offer.candidate_id = $(candidate_id)`;
        // service.id = $(service_id) is redundant
    // place query
    db.any(query, {
        "service_id": service_id,
        "candidate_id": candidate_id
    })
    .then((data) => {
        res.status(200).json(data);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


// Pick an offer.
router.post('/:id/offers/:candidate', function(req, res) {
    // TODO

});


// Remove offer.
router.delete('/:id/offers/:candidate', function(req, res) {
    // check for valid input
    try {
        var service_id = req.params.id;
        var candidate_id = req.params.candidate;
    }
    catch(err) {
        res.status(400).json({"error": err.toString()});
        return;
    }
    // define query
    const query = `
        DELETE FROM service_offer
        WHERE service_offer.service_id = $(service_id) AND service_offer.candidate_id = $(candidate_id)`;
    // place query
    db.none(query, {
        "service_id": service_id,
        "candidate_id": candidate_id
    })
    .then(() => {
        res.sendStatus(200);
    })
    .catch(error => {
        res.status(500).json(error);
    });
});


module.exports = router;
