var express = require('express');
var router = express.Router();
var db = require('../config/database');
const appSecret = require('../config/config').secret;
const expressJwt = require('express-jwt');

const authenticate = expressJwt({ secret: appSecret });

// Get user by id
router.get('/:id', authenticate, function(req, res) {
	try {
        var id = req.params.id;
		var logged_id = req.user.id;
    } catch (err) {
        res.status(400).json({ error: err.toString() });
        return;
    }
    const query = `
	    SELECT
			users.id=$(logged_id) AS self,
			blocked.blocker_id IS NOT NULL AS blocked,
			friend.user1_id IS NOT NULL AS friend,
			friend_request_sent.sender_id IS NOT NULL AS friend_request_sent,
			friend_request_received.sender_id IS NOT NULL AS friend_request_received,
			loan_request.sender_id IS NOT NULL AS loan_request,
			donation_request.sender_id IS NOT NULL AS donation_request,
			users.id as user_id, date_joined, full_name, bio, city, country.name AS country, level, high_level, verified, image_url
		FROM users
		JOIN country
		ON users.country_id = country.id
		LEFT JOIN blocked
		ON (blocked.blocker_id=$(logged_id) AND blocked.target_id=users.id) OR (blocked.blocker_id=users.id AND blocked.target_id=$(logged_id))
		LEFT JOIN friend
		ON (friend.user1_id=$(logged_id) AND friend.user2_id=users.id) OR (friend.user1_id=users.id AND friend.user2_id=$(logged_id))
		LEFT JOIN friend_request AS friend_request_sent
		ON friend_request_sent.sender_id=$(logged_id) AND friend_request_sent.receiver_id=users.id
		LEFT JOIN friend_request AS friend_request_received
		ON friend_request_received.sender_id=users.id AND friend_request_received.receiver_id=$(logged_id)
		LEFT JOIN loan_request
		ON loan_request.sender_id=$(logged_id) AND loan_request.receiver_id=users.id
		LEFT JOIN donation_request
		ON donation_request.sender_id=$(logged_id) AND donation_request.receiver_id=users.id
		WHERE users.id = $(id)
		LIMIT 1;`;
    db
        .one(query, { id, logged_id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            console.log(error.message);
            res.status(500).json(error.message);
        });
});

/**
 * @api {get} /users/get_from_token get the authenticated user that is identified by a JWT
 * @apiName getFromToken
 * @apiGroup User
 * @apiPermission authenticated user
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/', authenticate, function(req, res) {
    res.status(200).json(req.user);
});

// Get friends
router.get('/:id/friends', function(req, res) {
    const query = `
		SELECT users.id, users.full_name AS name, users.image_url, users.verified
		FROM users
		JOIN (
			SELECT user1_id AS user_id
			FROM friend
			WHERE user2_id=$(user_id)
			UNION ALL
			SELECT user2_id
			FROM friend
			WHERE user1_id=$(user_id)
		) AS friends
		ON users.id=friends.user_id`;
    db
        .any(query, { user_id: req.params.id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Add friend
router.post('/add_friend', authenticate, function(req, res) {
    var user_id = req.user.id;
    const query = `
		INSERT INTO friend(user1_id, user2_id)
		VALUES ($(user1_id), $(user2_id))`;
    db
        .none(query, {
            user1_id: user_id,
            user2_id: req.body.id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Remove friend
router.delete('/add_friend', authenticate, function(req, res) {
    var user_id = req.user.id;
    const query = `
		DELETE FROM friend
		WHERE (user1_id=$(user1_id) AND user2_id=$(user2_id))
		OR (user1_id=$(user2_id) AND user2_id=$(user1_id))`;
    db
        .none(query, {
            user1_id: user_id,
            user2_id: req.body.id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Make friend request
router.post('/friend_request', authenticate, function(req, res) {
	var sender_id = req.user.id;
    const query = `
		INSERT INTO friend_request(sender_id, receiver_id)
		VALUES ($(sender_id), $(receiver_id))`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Remove friend request
router.delete('/friend_request', authenticate, function(req, res) {
	var sender_id = req.user.id;
    const query = `
		DELETE FROM friend_request
		WHERE sender_id = $(sender_id)
		AND receiver_id = $(receiver_id)`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Get blocked users
router.get('/:id/blocked', function(req, res) {
    const query = `
		SELECT users.id, users.full_name, users.image_url, users.verified
		FROM users
		JOIN blocked
		ON users.id=blocked.target_id
		WHERE blocked.blocker_id=$(user_id)`;
    db
        .any(query, { user_id: req.params.id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Block user
router.post('/block_user', authenticate, function(req, res) {
    var user_id = req.user.id;
    const query = `
		INSERT INTO blocked(blocker_id, target_id)
		VALUES ($(blocker_id), $(target_id))`;
    db
        .none(query, {
            blocker_id: user_id,
            target_id: req.body.id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Unblock user
router.delete('/block_user', authenticate, function(req, res) {
    var user_id = req.user.id;
    const query = `
		DELETE FROM blocked
		WHERE blocker_id=$(blocker_id) AND target_id=$(target_id)`;
    db
        .none(query, {
            blocker_id: user_id,
            target_id: req.body.id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Make loan request
router.post('/loan_request', function(req, res) {
	var sender_id = 1;
    const query = `
		INSERT INTO loan_request(sender_id, receiver_id, amount)
		VALUES ($(sender_id), $(receiver_id), $(amount))`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.user_id,
			amount: req.body.amount
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Remove loan request
router.delete('/loan_request', function(req, res) {
	var sender_id = 1;
    const query = `
		DELETE FROM loan_request
		WHERE sender_id = $(sender_id)
		AND receiver_id = $(receiver_id)`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.user_id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Make loan
router.post('/loan', authenticate, function(req, res) {
	var sender_id = req.user.id;
    const query = `
		INSERT INTO loan(sender_id, receiver_id, amount, date_max_repay)
		VALUES ($(sender_id), $(receiver_id), $(amount), $(date_max_repay))`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.user_id,
			amount: req.body.amount,
			date_max_repay: req.body.date_max_repay
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Make donation request
router.post('/donation_request', function(req, res) {
	var sender_id = 1;
    const query = `
		INSERT INTO donation_request(sender_id, receiver_id, amount)
		VALUES ($(sender_id), $(receiver_id), $(amount))`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.user_id,
			amount: req.body.amount
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Delete donation request
router.delete('/donation_request', function(req, res) {
	var sender_id = 1;
    const query = `
		DELETE FROM donation_request
		WHERE sender_id = $(sender_id)
		AND receiver_id = $(receiver_id)`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.user_id
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Make donation
router.post('/donation', authenticate, function(req, res) {
	var sender_id = req.user.id;
    const query = `
		INSERT INTO donation(sender_id, receiver_id, amount)
		VALUES ($(sender_id), $(receiver_id), $(amount))`;
    db
        .none(query, {
            sender_id: sender_id,
            receiver_id: req.body.user_id,
			amount: req.body.amount
        })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Set location (Country, region, city) info
router.post('/set_location', authenticate, function(req, res) {
    const query =
        `UPDATE users SET country_id = $(country), city = $(city), region = $(region) 
        WHERE id = $(id)`;

    db.none(query, {
        city: req.body.city,
        country: req.body.country,
        id: req.user.id,
        region: req.body.region
    })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Get services provided by user
router.get('/:id/provides', function(req, res) {
	const query =
		`SELECT service.id, service.title AS name, service_image.image_url
		FROM service
		LEFT JOIN service_image
		ON service.id=service_image.service_id
		WHERE service.creator_id=$(user_id)
		AND service.service_type='PROVIDE'
		AND service.deleted=false`;
		
	db.any(query, { user_id: req.params.id })
		.then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Get services required by user
router.get('/:id/requests', function(req, res) {
	const query =
		`SELECT service.id, service.title AS name, service_image.image_url
		FROM service
		LEFT JOIN service_image
		ON service.id=service_image.service_id
		WHERE service.creator_id=$(user_id)
		AND service.service_type='REQUEST'
		AND service.deleted=false`;
		
	db.any(query, { user_id: req.params.id })
		.then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Get crowdfundings created by user
router.get('/:id/crowdfundings', function(req, res) {
	const query =
		`SELECT crowdfunding.id, crowdfunding.title AS name, crowdfunding_image.image_url
		FROM crowdfunding
		LEFT JOIN crowdfunding_image
		ON crowdfunding.id=crowdfunding_image.crowdfunding_id
		WHERE crowdfunding.creator_id=$(user_id)
		AND crowdfunding.deleted=false`;
		
	db.any(query, { user_id: req.params.id })
		.then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

// Get user rating
router.get('/:id/rating', function(req, res) {
	/* service partner; service creator; crowdfunding service partner; crowdfunding service creator; crowdfunding owner*/
	const query = `
			SELECT AVG(rating) AS rating
			FROM (
				SELECT creator_rating AS rating
				FROM service_instance
				WHERE partner_id=$(user_id) AND service_instance.creator_rating IS NOT NULL
				
				UNION ALL
				
				SELECT partner_rating AS rating
				FROM service_instance
				JOIN service
				ON service_instance.service_id=service.id
				WHERE creator_id=$(user_id) AND service_instance.partner_rating IS NOT NULL
				
				UNION ALL
				
				SELECT creator_rating AS rating
				FROM service_instance
				JOIN crowdfunding
				ON service_instance.crowdfunding_id=crowdfunding.id
				WHERE crowdfunding.creator_id=$(user_id) AND service_instance.creator_rating IS NOT NULL
				
				UNION ALL
				
				SELECT partner_rating AS rating
				FROM service_instance
				JOIN service
				ON service_instance.service_id=service.id
				JOIN crowdfunding
				ON service.crowdfunding_id=crowdfunding.id
				WHERE crowdfunding.creator_id=$(user_id) AND service_instance.partner_rating IS NOT NULL
				
				UNION ALL
				
				SELECT rating AS rating
				FROM crowdfunding_donation
				JOIN crowdfunding
				ON crowdfunding_donation.crowdfunding_id=crowdfunding.id
				WHERE crowdfunding.creator_id=$(user_id) AND crowdfunding_donation.rating IS NOT NULL
			) ratings
	`;
	
	db.one(query, { user_id: req.params.id })
		.then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});



module.exports = router;
