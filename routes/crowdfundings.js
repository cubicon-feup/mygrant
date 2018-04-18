var express = require('express');
var router = express.Router();
var db = require('../config/database');
var image = require('../images/Image');

// CROWDFUNDING.
// ===============================================================================

// Creates a crowdfunding project.
router.post('/', function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var category = req.body.category;
    var location = req.body.location;
    var mygrantTarget = req.body.mygrant_target;
    var dateFinished = req.body.date_finished;
    var creatorId = req.body.creator_id;
    var query = 
        `INSERT INTO crowdfunding (title, description, category, location, mygrant_target, date_created, date_finished, status, creator_id)
        VALUES ($(title), $(description), 'BUSINESS'::service_categories, $(location), $(mygrant_target), now(), now() + interval '1 week', 'COLLECTING'::crowdfunding_statuses, $(creator_id));`;
    
    db.none(query, {
        title: title,
        description: description,
        location: location,
        mygrant_target: mygrantTarget,
        creator_id: creatorId
    }).then(() => {
        res.status(201).send('Sucessfully created a crowdfunding project.');
    }).catch(error => {
        res.status(500).json({error});
    });
});

// Gets a crowdfunding project.
router.get('/:id', function(req, res) {
    var id = req.params.id;
    var query = 
        `SELECT title, description, category, location, mygrant_target, date_created, date_finished, status, creator_id, users.full_name as creator_name
        FROM crowdfunding
        INNER JOIN users ON users.id = crowdfunding.creator_id
        WHERE crowdfunding.id = $(id);`;

    db.one(query, {
        id: id
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    });
});

// Updates a crowdfunding project.
router.put('/:id', function(req, res) {
    var id = req.params.id;
    var title = req.body.title;
    var description = req.body.description;
    var location = req.body.location;
    var query = 
        `UPDATE crowdfunding
        SET title = $(title),
            description = $(description),
            category = 'ARTS'::service_categories,
            location = $(location)
        WHERE id = $(id);`;

    db.none(query, {
        title: title,
        description: description,
        location: location,
        id: id
    }).then(() => {
        res.status(200).send('Successfully updated crowdfunding project.');
    }).catch(error => {
        res.status(500).json({error});
    });
});

// Deletes a crowdfunding project.
router.delete('/:id', function(req, res) {
    var id = req.params.id;
    var query = 
        `DELETE FROM crowdfunding
        WHERE id = $(id);`;

    db.none(query, {
        id: id
    }).then(() => {
        res.status(200).send('Sucessfully deleted crowdfunding project.');
    }).catch(error => {
        res.status(500).json({error});
    });
});

// Gets a crowdfunding project average rating.
router.get('/:id/rating', function(req, res) {
    var id = req.params.id;
    var query = 
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

// Get all the crowdfunding projects.
router.get('/', function(req, res) {
    var query =
        `SELECT title, category, location, mygrant_target, status, users.full_name as creator_name
        FROM crowdfunding
        INNER JOIN users ON users.id = crowdfunding.creator_id;`;
    
    db.many(query)
    .then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    });
});

// User donates to crowdfunding project.
router.post('/:id/donations', function(req, res) {
    var crowdfundingId = req.params.id;
    var donatorId = req.body.donator_id;
    var amount = req.body.amount;
    var query = 
        `INSERT INTO crowdfunding_donation (crowdfunding_id, donator_id, amount, date_sent)
        VALUES ($(crowdfunding_id), $(donator_id), $(amount), now());`;
    
    db.none(query, {
        crowdfunding_id: crowdfundingId,
        donator_id: donatorId,
        amount: amount
    }).then(() => {
        res.status(201).send('Successfully donated to crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    });
});

// Gets all crowdfunding project's donations.
router.get('/:id/donations', function(req, res) {
    var crowdfundingId = req.params.id;
    var query = 
        `SELECT users.id as donator_id, full_name as donator_name, amount
        FROM crowdfunding_donation
        INNER JOIN users ON users.id = crowdfunding_donation.donator_id
        WHERE crowdfunding_id = $(crowdfunding_id);`;

    db.many(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Rate a crowdfunding project.
router.put('/:id/rate', function(req, res) {
    var id = req.params.id;
    var rating = req.body.rating;
    var crowdfundingId = req.body.crowdfunding_id;
    var donatorId = req.body.donator_id;
    var query =
        `UPDATE crowdfunding_donation
        SET rating = $(rating)
        WHERE crowdfunding_id = $(crowdfunding_id)
            AND donator_id = $(donator_id);`;
    
    db.none(query, {
        rating: rating,
        crowdfunding_id: crowdfundingId,
        donator_id: donatorId
    }).then(() => {
        res.status(200).send('Successfully rated the crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    });
});

router.post('/:id/image', function(req, res) {
    let uploaded = image.uploadImage(req, res);
    if(uploaded) {
        
    }
})

// SERVICES OFFERS.
// ===============================================================================

// Service creator offers a service to the crowdfunding creator.
router.post('/:id/services_offers', function(req, res) {
    var crowdfundingId = req.params.id;
    var serviceId = req.body.service_id;
    var query = 
        `INSERT INTO crowdfunding_offer (service_id, crowdfunding_id)
        VALUES ($(service_id), $(crowdfunding_id));`;
    
    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(201).send('Successfully offered a service to the crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Gets all the service offers for the crowdfunding.
router.get('/:id/services_offers', function(req, res) {
    var crowdfundingId = req.params.id;
    var query = 
        `SELECT service.id as service_id, service.title as service_title, service.category as service_category, service.service_type
        FROM service
        INNER JOIN crowdfunding_offer ON crowdfunding_offer.service_id = service.id
        WHERE crowdfunding_offer.crowdfunding_id = $(crowdfunding_id);`;

    db.many(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Deletes a service offer from the available offers.
router.delete('/:id/services_offers', function(req, res) {
    var crowdfundingId = req.params.id;
    var serviceId = req.body.service_id;
    var query = 
        `DELETE FROM crowdfunding_offer
        WHERE service_id = $(service_id)
            AND crowdfunding_id = $(crowdfunding_id);`;
    
    db.none(query, {
        service_id: serviceId,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(200).send('Successfully deleted the service offer.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// SERVICE REQUESTED.
// ===============================================================================

// Create a new service request for the crowdfunding.
router.post('/:id/services_requested', function(req, res) {
    var crowdfundingId = req.params.id;    
    var title = req.body.title;
    var description = req.body.description;
    var category = req.body.category;
    var location = req.body.location;
    var acceptableRadius = req.body.acceptable_radius;
    var mygrantValue = req.body.mygrant_value;
    var query = 
        `INSERT INTO service (title, description, category, location, acceptable_radius, mygrant_value, date_created, service_type, crowdfunding_id)
        VALUES ($(title), $(description), $(category), $(location), $(acceptable_radius), $(mygrant_value), now(), 'REQUEST', $(crowdfunding_id));`;

    db.none(query, {
        title: title,
        description: description,
        category: category,
        location: location,
        acceptable_radius: acceptableRadius,
        mygrant_value: mygrantValue,
        crowdfunding_id: crowdfundingId
    }).then(() => {
        res.status(201).send('Successfully created a new service request for the crowdfunding.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Get all services requested for the crowdfunding.
router.get('/:id/services_requested', function(req, res) {
    var crowdfundingId = req.params.id;
    var query = 
        `SELECT title, mygrant_value, category
        FROM service
        WHERE service.crowdfunding_id = 1;`;
    
    db.many(query, {
        crowdfunding_id: crowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
});

// Deletes a service request from the services that the crowdfunding creator is looking to get. 
router.delete('/:id/services_requested', function(req, res) {
    var serviceId = req.body.service_id;
    var query = 
        `DELETE FROM service
        WHERE id = $(service_id)`;
    
    db.none(query, {
        service_id: serviceId
    }).then(() => {
        res.status(200).send('Successfully removed the service.');
    }).catch(error => {
        res.status(500).json({error});
    })
});

// SERVICES ACCORDED
// ===============================================================================

// Select a service from the available offered ones. This service is then instantiated as an agreed service.
// FIXME: giving an error when trying out in Postman.
router.post('/:id/services', function(req, res) {
    var crowdfundingId = req.params.id;
    var serviceId = req.body.service_id;
    var partnerId = req.body.partner_id;
    //var dateScheduled = req.body.date_scheduled;    // Format: 'yyyy-mm-dd hh:m:ss'.
    var query = 
        `INSERT INTO service_instance (service_id, partner_id, crowdfunding_id, date_agreed, date_scheduled)
        VALUES ($(service_id), $(partner_id), $(crowdfunding_id), now(), now() + interval '1 week');`;
    
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
router.get('/:id/services', function(req, res) {
    var crowdfundingId = req.params.id;
    var query = 
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
router.delete('/:id/services', function(req, res) {
    var crowdfundingId = req.params.id;
    var serviceId = req.body.service_id;
    var query = 
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