var express = require('express');
var router = express.Router();
var db = require('../config/database');
var image = require('../images/Image');
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

// IMAGES
// ===============================================================================


/**
 * @api {put} /users/change-image - Change user image
 * @apiName ChangeUserImage
 * @apiGroup user
 * @apiPermission user itself
 *
 * @apiDescription Upload image and replace current one with new
 *
 * @apiParam (RequestFiles) {File} file Image file of the image
 *
 * @apiExample Syntax
 * PUT: /api/users/change-image
 * files.image?
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 400) BadRequestError Invalid URL Parameters
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/change-image', authenticate, function(req, res) {
    try {
        // upload
        var filename = image.uploadImage(req, res, 'users/');
        if(filename === false){
            return;
        }
    } catch (err) {
        res.status(400).json(err);
        return;
    }
    // define query
    const query = `
        UPDATE users
        SET image_url = $(new_filename)
        WHERE id = $(user_id)
        RETURNING (SELECT image_url FROM users WHERE id = $(user_id)) AS old_filename`;
    // update db
    db.one(query, {
        user_id: req.user.id,
        new_filename: filename
    }).then(data => {
        // remove old image
        image.removeImage(req, res, 'users/'+data.old_filename, true);
    }).catch(error => {
        res.status(500).json(error);
    });
});

module.exports = router;
