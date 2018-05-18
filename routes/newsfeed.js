var express = require('express');
var router = express.Router();
var db = require('../config/database');

//
//
// NEWSFEED
//
//

/**
 * @api {get} /newsfeed/ 01 - Get newsfeed
 * @apiName GetNewsfeed
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Returns a list of posts made by friends of the logged in user
 *
 * @apiExample Syntax
 * GET: /api/newsfeed
 *
 * @apiSuccess (Success 200) {Integer} post_id ID of the post
 * @apiSuccess (Success 200) {String} post_message Content of the post
 * @apiSuccess (Success 200) {Date} post_date_posted Date a post was created
 * @apiSuccess (Success 200) {Integer} post_in_reply_to ID of the post this is replying to
 * @apiSuccess (Success 200) {Integer} post_n_likes Number of likes on the post
 * @apiSuccess (Success 200) {Integer} post_n_replies Number of replies on the post
 * @apiSuccess (Success 200) {Integer} post_n_images Number of images on the post
 * @apiSuccess (Success 200) {String} post_image URL of the first image of the post
 * @apiSuccess (Success 200) {Integer} post_n_edits Number of edits on the post
 * @apiSuccess (Success 200) {Integer} sender_id ID of the creator of the post
 * @apiSuccess (Success 200) {String} sender_full_name Name of the creator of the post
 * @apiSuccess (Success 200) {String} sender_image_url URL of the image of the creator of the post
 *
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/', function(req, res) {
	var user_id = 1; //SESSION.id
	query = `
		SELECT post.id AS post_id, post.message AS post_message, post.date_posted AS post_date_posted, post.in_reply_to AS post_in_reply_to, COUNT(distinct like_post.user_id) AS post_n_likes, COUNT(distinct replies.id) AS post_n_replies, COUNT(distinct post_image.image_url) AS post_n_images, MIN(post_image.image_url) AS post_image, array_length(post.edit_history, 1) AS post_n_edits, post.sender_id AS sender_id, users.full_name AS sender_full_name, users.image_url AS sender_image_url
		FROM post
		JOIN (
			SELECT user1_id AS user_id
			FROM friend
			WHERE user2_id=2
			UNION ALL
			SELECT user2_id
			FROM friend
			WHERE user1_id=2
		) AS friends
		ON post.sender_id=friends.user_id
		JOIN users
		ON friends.user_id=users.id
		LEFT JOIN like_post
		ON post.id=like_post.post_id
		LEFT JOIN post_image
		ON post.id=post_image.post_id
		LEFT JOIN post replies
		ON post.id=replies.in_reply_to
		GROUP BY post.id, users.full_name, users.image_url
		ORDER BY post.date_posted DESC`;
	db.any(query, {user_id: user_id})
	.then(data => {
		res.status(200).json(data);
	})
	.catch(error => {
		res.status(500).json(error.message);
	});
});

/**
 * @api {get} /newsfeed/user/:id 02 - Get userfeed
 * @apiName GetUserfeed
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Returns a list of posts made by a user
 *
 * @apiParam (RequestParam) {Integer} id ID of the user to see feed of
 *
 * @apiExample Syntax
 * GET: /api/newsfeed/user/<ID>
 * @apiExample Example
 * GET: /api/newsfeed/user/5
 *
 * @apiSuccess (Success 200) {Integer} post_id ID of the post
 * @apiSuccess (Success 200) {String} post_message Content of the post
 * @apiSuccess (Success 200) {Date} post_date_posted Date a post was created
 * @apiSuccess (Success 200) {Integer} post_in_reply_to ID of the post this is replying to
 * @apiSuccess (Success 200) {Integer} post_n_likes Number of likes on the post
 * @apiSuccess (Success 200) {Integer} post_n_replies Number of replies on the post
 * @apiSuccess (Success 200) {Integer} post_n_images Number of images on the post
 * @apiSuccess (Success 200) {String} post_image URL of the first image of the post
 * @apiSuccess (Success 200) {Integer} post_n_edits Number of edits on the post
 * @apiSuccess (Success 200) {Integer} sender_id ID of the creator of the post
 * @apiSuccess (Success 200) {String} sender_full_name Name of the creator of the post
 * @apiSuccess (Success 200) {String} sender_image_url URL of the image of the creator of the post
 *
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/user/:id', function(req, res) {
	const query = `
		SELECT post.id AS post_id, post.message AS post_message, post.date_posted AS post_date_posted, post.in_reply_to AS post_in_reply_to, COUNT(distinct like_post.user_id) AS post_n_likes, COUNT(distinct replies.id) AS post_n_replies, COUNT(distinct post_image.image_url) AS post_n_images, MIN(post_image.image_url) AS post_image, array_length(post.edit_history, 1) AS post_n_edits, post.sender_id AS sender_id, users.full_name AS sender_full_name, users.image_url AS sender_image_url
		FROM post
		JOIN users
		ON post.sender_id=users.id
		LEFT JOIN like_post
		ON post.id=like_post.post_id
		LEFT JOIN post_image
		ON post.id=post_image.post_id
		LEFT JOIN post replies
		ON post.id=replies.in_reply_to
		WHERE post.sender_id=$(user_id)
		GROUP BY post.id, users.full_name, users.image_url
		ORDER BY post.date_posted DESC`;
	db.any(query, {user_id: req.params.id})
	.then(data => {
		res.status(200).json(data);
	})
	.catch(error => {
		res.status(500).json(error);
	});
});

/**
 * @api {post} /newsfeed 03 - Create post
 * @apiName CreatePost
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Create a microblogging post
 *
 * @apiParam (RequestBody) {String} message Content of the post
 * @apiParam (RequestBody) {Integer} in_reply_to ID of the message this one is replying to (Optional)
 *
 * @apiExample Syntax
 * POST: /api/newsfeed
 * @apiExample Example
 * POST: /api/newsfeed
 * body: {
 *      message: 'A new post',
 *      in_reply_to: 5
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/', function(req, res) {
	var user_id = 1; //SESSION.id
	const query = `
		INSERT INTO post(sender_id, message, in_reply_to)
		VALUES ($(user_id), $(message), $(in_reply_to))`;
	db.none(query, {user_id: user_id, message: req.body.message, in_reply_to: req.body.in_reply_to})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.status(500).json(error);
	});
});

/**
 * @api {get} /newsfeed/:id 04 - Get post
 * @apiName GetPost
 * @apiGroup Newsfeed
 * @apiPermission visitor
 *
 * @apiDescription Returns a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the desired post
 *
 * @apiExample Syntax
 * GET: /api/newsfeed/<ID>
 * @apiExample Example
 * GET: /api/newsfeed/5
 *
 * @apiSuccess (Success 200) {Integer} post_id ID of the post
 * @apiSuccess (Success 200) {String} post_message Content of the post
 * @apiSuccess (Success 200) {Date} post_date_posted Date a post was created
 * @apiSuccess (Success 200) {Integer} post_in_reply_to ID of the post this is replying to
 * @apiSuccess (Success 200) {Integer} post_n_likes Number of likes on the post
 * @apiSuccess (Success 200) {Integer} post_n_replies Number of replies on the post
 * @apiSuccess (Success 200) {Integer} post_n_images Number of images on the post
 * @apiSuccess (Success 200) {String} post_image URL of the first image of the post
 * @apiSuccess (Success 200) {Integer} post_n_edits Number of edits on the post
 * @apiSuccess (Success 200) {Integer} sender_id ID of the creator of the post
 * @apiSuccess (Success 200) {String} sender_full_name Name of the creator of the post
 * @apiSuccess (Success 200) {String} sender_image_url URL of the image of the creator of the post
 *
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:id', function(req, res) {
	const query = `
		SELECT post.id AS post_id, post.message AS post_message, post.date_posted AS post_date_posted, post.in_reply_to AS post_in_reply_to, COUNT(distinct like_post.user_id) AS post_n_likes, COUNT(distinct replies.id) AS post_n_replies, COUNT(distinct post_image.image_url) AS post_n_images, MIN(post_image.image_url) AS post_image, array_length(post.edit_history, 1) AS post_n_edits, post.sender_id AS sender_id, users.full_name AS sender_full_name, users.image_url AS sender_image_url
		FROM post
		JOIN users
		ON post.sender_id=users.id
		LEFT JOIN like_post
		ON post.id=like_post.post_id
		LEFT JOIN post_image
		ON post.id=post_image.post_id
		LEFT JOIN post replies
		ON post.id=replies.in_reply_to
		WHERE post.id=$(post_id)
		GROUP BY post.id, users.full_name, users.image_url`;
	db.any(query, {post_id: req.params.id})
	.then(data => {
		res.status(200).json(data);
	})
	.catch(error => {
		res.status(500).json(error);
	});
});

/**
 * @api {put} /newsfeed/:id 05 - Edit post
 * @apiName EditPost
 * @apiGroup Newsfeed
 * @apiPermission post creator
 *
 * @apiDescription Edits the content of a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to edit
 * @apiParam (RequestBody) {String} message Content of the post
 *
 * @apiExample Syntax
 * PUT: /api/newsfeed/<ID>
 * @apiExample Example
 * PUT: /api/newsfeed/1
 * body: {
 *      message: 'This is an edit'
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/:id', function(req, res) {
	var user_id = 141; //SESSION.id
	const query = `
		UPDATE post
		SET message=$(message)
		WHERE id=$(post_id) AND sender_id=$(user_id)`;
	db.none(query, {post_id: req.params.id, user_id: user_id, message: req.body.message})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.sendStatus(500).json(error);
	});
});

/**
 * @api {delete} /newsfeed/:id 06 - Delete post
 * @apiName DeletePost
 * @apiGroup Newsfeed
 * @apiPermission post creator
 *
 * @apiDescription Deletes a microblogging
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to delete
 *
 * @apiExample Syntax
 * DELETE: /api/newsfeed/<ID>
 * @apiExample Example
 * DELETE: /api/newsfeed/1
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:id', function(req, res) {
	var user_id = 1; //SESSION.id
	const query = `
		DELETE FROM post
		WHERE id=$(post_id) AND sender_id=$(user_id)`;
	db.none(query, {post_id: req.params.id, user_id: user_id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.sendStatus(500).json({error});
	});
});

/**
 * @api {post} /newsfeed/:id/like 07 - Like post
 * @apiName LikePost
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Likes a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to like
 *
 * @apiExample Syntax
 * POST: /api/newsfeed/<ID>/like
 * @apiExample Example
 * POST: /api/newsfeed/1/like
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/:id/like', function(req, res) {
	var user_id = 1;
	const query = `
		INSERT INTO like_post(user_id, post_id)
		VALUES ($(user_id), $(post_id))`;
	db.none(query, {user_id: user_id, post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.sendStatus(500).json({error});
	});
	
});

/**
 * @api {delete} /newsfeed/:id/like 08 - Unlike post
 * @apiName UnlikePost
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Unlikes a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to unlike
 *
 * @apiExample Syntax
 * DELETE: /api/newsfeed/<ID>/like
 * @apiExample Example
 * DELETE: /api/newsfeed/1/like
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:id/like', function(req, res) {
	var user_id = 1;
	const query = `
		DELETE FROM like_post
		WHERE user_id=$(user_id) AND post_id=$(post_id)`;
	db.none(query, {user_id: user_id, post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.sendStatus(500).json({error});
	});
	
});


module.exports = router;
