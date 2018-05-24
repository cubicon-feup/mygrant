var express = require('express');
var router = express.Router();
var db = require('../config/database');
const appSecret = require('../config/config').secret;
const expressJwt = require('express-jwt');

const authenticate = expressJwt({ secret: appSecret });

// Get user by id
router.get('/:id', function(req, res) {

    const query = `
        SELECT users.id as user_id, date_joined, full_name, latitude, longitude, level, high_level, verified, image_url,
        FROM users
        WHERE users.id = $(id);`;

    db.one(query, { id: req.params.id })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error => {
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

/**
 * @api {get} /users/:id/posts get the posts made by this user
 * @apiName getPosts
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id/posts', authenticate, function(req, res) {
    const offset = req.query.page * 20;

    const query = `
        SELECT id, message, in_reply_to, coalesce(n_replies, 0) AS n_replies, coalesce(n_likes, 0) AS n_likes,
        date_posted, full_name, image_url, coalesce(liked, 0) as liked, sender_id FROM 
        (SELECT id, sender_id, in_reply_to, message, date_posted FROM post WHERE sender_id = $(userId)) a
        LEFT JOIN ( SELECT in_reply_to AS op_id, count(*) AS n_replies FROM post GROUP BY op_id) b ON b.op_id = a.id
        LEFT JOIN ( SELECT post_id, count(*) AS n_likes FROM like_post GROUP BY post_id ) c ON a.id = c.post_id
        JOIN (SELECT users.id AS user_id, full_name, image_url FROM users) d ON a.sender_id = d.user_id
        LEFT JOIN (SELECT COUNT(*) AS liked, post_id from like_post where user_id = $(thisUser) group by post_id) e on a.id = e.post_id
    ORDER BY date_posted DESC LIMIT 20 OFFSET $(offset)`;

    db.manyOrNone(query,
        {
            offset,
            thisUser: req.user.id,
            userId: req.params.id
        })
        .then(posts => {
            res.status(200).json({ posts });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

/**
 * @api {get} /users/:id/postcount get the number of posts made by this user
 * @apiName getPosts
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id/postcount', authenticate, function(req, res) {

    const query = 'SELECT count(*) as n_posts FROM post WHERE sender_id = $(userId)';

    db.one(query, { userId: req.params.id })
        .then(number => {
            res.status(200).json(number);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

/**
 * @api {post} /users/:id/posts post a new post
 * @apiName PostPost
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 *
 */
router.post('/:id/posts', authenticate, function(req, res) {

    const query = 'INSERT INTO post(sender_id, message) VALUES ($(userId), $(content))';

    // Check that the user that made the request is trying to post to his blog
    if (req.user.id === parseInt(req.params.id, 10)) {
        db.none(query, {
            content: req.body.content,
            userId: req.user.id
        })
            .then(() => res.sendStatus(201))
            .catch(() => res.sendStatus(500));
    } else {
        res.sendStatus(401);
    }
});

/**
 * @api {get} /users/getfeed get the posts made by this user and their friends
 * @apiName getFeed
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 * */
router.get('/:id/getfeed', authenticate, function(req, res) {
    const offset = req.query.page * 20;

    const query = `
        SELECT DISTINCT id, message, in_reply_to, coalesce(n_replies, 0) AS n_replies, coalesce(n_likes, 0) AS n_likes,
        date_posted, full_name, image_url, coalesce(liked, 0) as liked, sender_id
        FROM
            (
                SELECT user1_id as user_id from friend where user2_id = $(thisUser) 
                UNION SELECT user2_id as user_id FROM friend WHERE user1_id = $(thisUser)
                UNION SELECT $(thisUser) as user_id
            ) friends
            JOIN (SELECT id, sender_id, in_reply_to, message, date_posted FROM post) a on (user_id = sender_id or user_id = $(thisUser))
            LEFT JOIN ( SELECT in_reply_to AS op_id, count(*) AS n_replies FROM post GROUP BY op_id) b ON b.op_id = a.id
            LEFT JOIN ( SELECT post_id, count(*) AS n_likes FROM like_post GROUP BY post_id ) c ON a.id = c.post_id
            JOIN (SELECT users.id AS user_id, full_name, image_url FROM users) d ON a.sender_id = d.user_id
            LEFT JOIN (SELECT COUNT(*) AS liked, post_id FROM like_post WHERE user_id = $(thisUser) group by post_id) e on a.id = e.post_id
        ORDER BY date_posted DESC LIMIT 20 OFFSET $(offset);`;

    db.manyOrNone(query,
        {
            offset,
            thisUser: req.user.id
        })
        .then(posts => {
            res.status(200).json({ posts });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = router;
