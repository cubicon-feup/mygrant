var express = require('express');
var router = express.Router();
var db = require('../config/database');
var image = require('../images/Image');

const appSecret = require('../config/config').secret;
const expressJwt = require('express-jwt');

const authenticate = expressJwt({ secret: appSecret });

// Get user by id
router.get('/:id', expressJwt({credentialsRequired: false, secret: appSecret}), function(req, res) {
	try {
        var id = req.params.id;
		var logged_id = req.hasOwnProperty('user') && req.user.hasOwnProperty('id') ? req.user.id : null;
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
			users.id as user_id, date_joined, full_name, bio, city, country.name AS country, latitude, longitude, level, high_level, verified, image_url
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
            res.status(200).json({...data, authenticated: logged_id ? true : false});
        })
        .catch(error => {
            res.status(500).json(error.message);
        });
});

// Edit user
router.put('/', authenticate, function(req, res) {
	try {
		var user_id = req.user.id;
		var full_name = req.body.name;
		var bio = req.body.bio;
    } catch (err) {
        res.status(400).json({ error: err.toString() });
        return;
    }
	
	const query = `
		UPDATE users
		SET full_name=$(full_name), bio=$(bio)
		WHERE id=$(user_id)`;
		
	db.none(query, {user_id, full_name, bio})
	.then(() => res.sendStatus(200))
	.catch(error => {res.status(500).json(error.message)});
});

// Edit image
router.post('/image', authenticate, function(req, res) {
	try {
		var user_id = req.user.id;
		var filename = image.uploadImage(req, res, 'users/');
        if (filename === false){
            return;
        }
    } catch (err) {
        res.status(400).json({ error: err.toString() });
        return;
    }
	
	const query = `
		UPDATE users
		SET image_url=$(filename)
		WHERE id=$(user_id)`;
		
	db.none(query, {user_id, filename})
	.then(() => res.sendStatus(200))
	.catch(error => {res.status(500).json(error.message)});
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
router.post('/loan_request', authenticate, function(req, res) {
	var sender_id = req.user.id;
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
router.delete('/loan_request', authenticate, function(req, res) {
	var sender_id = req.user.id;
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
router.post('/donation_request', authenticate, function(req, res) {
	var sender_id = req.user.id;
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
router.delete('/donation_request', authenticate, function(req, res) {
	var sender_id = req.user.id;
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
			SELECT value AS rating
			FROM rating
			WHERE user_id=$(user_id)
	`;
	
	db.one(query, { user_id: req.params.id })
		.then(data => {
            res.status(200).json(data);
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
