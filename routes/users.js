var express = require('express');
var router = express.Router();
var db = require('../config/database');

const appSecret = require('../config/config').secret;
const expressJwt = require('express-jwt');
const authenticate = expressJwt({ secret: appSecret });

// Get user by id
router.get('/:id', function(req, res) {

    const query = `
        SELECT users.id as user_id, date_joined, full_name, city, country.name AS country, level, high_level, verified, image_url,
        FROM users
        JOIN country
        ON country.id=users.country_id
        WHERE users.id = $(id);`;

    db.one(query, { id: req.params.id })
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
 * @apiSuccess (Success 200) OK
 *
 */
router.get('/', authenticate, function(req, res) {
    res.status(200).json(req.user);
});

/**
 * @api {get} /users/mygrant_balalnce Get mygrant balance
 * @apiName GetMygrantBalance
 * @apiGroup User
 * @apiPermission authenticated user
 *
 * @apiSuccess (Success 200) {Integer} mygrant_balance Current amount of mygrants owned by the user.
 *
 * @apiError (Error 500) InternalServerError
 */
router.get('/mygrant_balance', function(req, res) {
    let userId = req.user.id;
    let query =
        `SELECT mygrant_balance
        FROM users
        WHERE users.id = $(user_id);`;

    db.one(query, {
        user_id: userId
    }).then(data => {
        res.status(200).json({data});
    }).catch(error => {
        console.log(error);
        res.status(500).json({error});
    })
});

// Get friends
router.get('/:id/friends', function(req, res) {
    const query = `
		SELECT users.id, users.full_name, image.filename AS image_path, users.verified
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
		ON users.id=friends.user_id
		LEFT JOIN image
		ON users.image_id=image.id`;
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
		SELECT users.id, users.full_name, image.filename AS image_path, users.verified
		FROM users
		JOIN blocked
		ON users.id=blocked.target_id
		LEFT JOIN image
		ON users.image_id=image.id
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

// Set location (Country, region, city) info
router.post('/set_location', authenticate, function(req, res) {
    const query =
        `UPDATE users SET country_id = $(country), city = $(city), region = $(region), latitude = $(latitude), longitude = $(longitude)
        WHERE id = $(id)`;

    db.none(query, {
        city: req.body.city,
        country: req.body.country,
        id: req.user.id,
        region: req.body.region,
        latitude: req.body.hasOwnProperty('latitude') ? req.body.latitude : null,
        longitude: req.body.hasOwnProperty('longitude') ? req.body.longitude : null,
    })
        .then(() => {
            res.sendStatus(200);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

router.get('/provided_services', authenticate, function(req, res) {
    let userId = req.user.id;
    const query =
        `SELECT service.id as service_id, service.title as service_title
        FROM service
        INNER JOIN crowdfunding ON crowdfunding.id = service.crowdfunding_id
        INNER JOIN users ON users.id = crowdfunding.creator_id
        WHERE users.id = $(user_id)
        ORDER BY crowdfunding.id;`;

    db.manyOrNone(query, {
        user_id: userId
    }).then(data => {
        res.status(200).json({data});
    }).catch(error => {
        console.log(error);
        res.status(500).json({error});
    })
});

router.get('/crowdfundings', authenticate, function(req, res) {
    let userId = req.user.id;
    const query =
        `SELECT *
        FROM crowdfunding
        WHERE crowdfunding.creator_id = $(user_id);`;

    db.manyOrNone(query, {
        user_id: userId
    }).then(data => {
        res.status(200).json({data});
    }).catch(error => {
        console.log(error);
        res.status(500).json({error});
    })
})

// Get all crowdfundings from a user.
router.get('/crowdfundings', authenticate, function(req, res) {
    let userId = req.user.id;
    const query =
        `SELECT *
        FROM crowdfunding
        WHERE crowdfunding.creator_id = $(user_id);`;

    db.manyOrNone(query, {
        user_id: userId
    }).then(data => {
        res.status(200).json({data});
    }).catch(error => {
        console.log(error);
        res.status(500).json({error});
    })
});

module.exports = router;
