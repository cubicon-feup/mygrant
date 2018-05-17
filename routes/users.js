var express = require('express');
var router = express.Router();
var db = require('../config/database');
const appSecret = require('../config/config').secret;
const expressJwt = require('express-jwt');

const authenticate = expressJwt({ secret: appSecret });

// Get user by id
router.get('/:id', function(req, res) {
    try {
        var id = req.params.id;
    } catch (err) {
        res.status(400).json({ error: err.toString() });

        return;
    }
    const query = `
	    SELECT users.id as user_id, date_joined, full_name, bio, city, country.name AS country, level, high_level, verified, image_url
		FROM users
		JOIN country
		ON users.country_id = country.id
		WHERE users.id = $(id);`;
    db
        .one(query, { id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});

// Get friends
router.get('/:id/friends', function(req, res) {
    const query = `
		SELECT users.id, users.full_name, users.image_url, users.verified
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
router.post('/add_friend', function(req, res) {
    var user_id = 1;
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
router.delete('/add_friend', function(req, res) {
    var user_id = 1;
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
router.post('/block_user', function(req, res) {
    var user_id = 1;
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
router.delete('/block_user', function(req, res) {
    var user_id = 1;
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
router.post('/loan', function(req, res) {
	var sender_id = 1;
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
router.post('/donation', function(req, res) {
	var sender_id = 1;
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

module.exports = router;
