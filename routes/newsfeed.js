var express = require('express');
var router = express.Router();
var db = require('../config/database');

//
//
// NEWSFEED
//
//

// Get all posts from friends
router.get('/', function(req, res) {
	var user_id = 2; //SESSION.id
	query = `
		SELECT post.id AS post_id, message AS post_message, date_posted AS post_date_posted, in_reply_to AS post_in_reply_to, COUNT(like_post.user_id) AS post_n_likes, COUNT(post_image.image_id) AS post_n_images, MIN(post_image_image.filename) AS post_image, array_length(post.edit_history, 1) AS post_n_edits, post.sender_id AS sender_id, users.full_name AS sender_full_name, user_image.filename AS sender_image_url
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
		LEFT JOIN image user_image
		ON users.image_id=user_image.id
		LEFT JOIN like_post
		ON post.id=like_post.post_id
		LEFT JOIN post_image
		ON post.id=post_image.post_id
		LEFT JOIN image post_image_image
		ON post_image.image_id=post_image_image.id
		GROUP BY post.id, users.full_name, user_image.filename
		ORDER BY date_posted DESC`;
	db.any(query, {user_id: 2})
	.then(data => {
		res.json({data});
	})
	.catch(error => {
		res.json({error});
	});
});

// Get all posts by user
router.get('/user/:id', function(req, res) {
	const query = `
		SELECT post.id AS post_id, message AS post_message, date_posted AS post_date_posted, in_reply_to AS post_in_reply_to, COUNT(like_post.user_id) AS post_n_likes, COUNT(post_image.image_id) AS post_n_images, MIN(post_image_image.filename) AS post_image, array_length(post.edit_history, 1) AS post_n_edits, post.sender_id AS sender_id, users.full_name AS sender_full_name, user_image.filename AS sender_image_url
		FROM post
		JOIN users
		ON post.sender_id=users.id
		LEFT JOIN image user_image
		ON users.image_id=user_image.id
		LEFT JOIN like_post
		ON post.id=like_post.post_id
		LEFT JOIN post_image
		ON post.id=post_image.post_id
		LEFT JOIN image post_image_image
		ON post_image.image_id=post_image_image.id
		WHERE post.sender_id=$(user_id)
		GROUP BY post.id, users.full_name, user_image.filename
		ORDER BY date_posted DESC`;
	db.any(query, {user_id: req.params.id})
	.then(data => {
		res.json({data});
	})
	.catch(error => {
		res.json({error});
	});
});

// Create a post (missing images)
router.post('/post', function(req, res) {
	var user_id = 2; //SESSION.id
	const query = `
		INSERT INTO post(sender_id, message, in_reply_to)
		VALUES ($(user_id), $(message), $(replied_post_id))`;
	db.none(query, {user_id: user_id, message: req.query.message, replied_post_id: null})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
});

// Get a post by id
router.get('/post/:id', function(req, res) {
	const query = `
		SELECT post.id AS post_id, message AS post_message, date_posted AS post_date_posted, in_reply_to AS post_in_reply_to, COUNT(like_post.user_id) AS post_n_likes, COUNT(post_image.image_id) AS post_n_images, MIN(post_image_image.filename) AS post_image, array_length(post.edit_history, 1) AS post_n_edits, post.sender_id AS sender_id, users.full_name AS sender_full_name, user_image.filename AS sender_image_url
		FROM post
		JOIN users
		ON post.sender_id=users.id
		LEFT JOIN image user_image
		ON users.image_id=user_image.id
		LEFT JOIN like_post
		ON post.id=like_post.post_id
		LEFT JOIN post_image
		ON post.id=post_image.post_id
		LEFT JOIN image post_image_image
		ON post_image.image_id=post_image_image.id
		WHERE post.id=$(post_id)
		GROUP BY post.id, users.full_name, user_image.filename`;
	db.any(query, {post_id: req.params.id})
	.then(data => {
		res.json({data});
	})
	.catch(error => {
		res.json({error});
	});
});

// Reply to a post (missing images)
router.post('/post/:id/reply', function(req, res) {
	var user_id = 2; //SESSION.id
	const query = `
		INSERT INTO post(sender_id, message, in_reply_to)
		VALUES ($(user_id), $(message), $(replied_post_id))`;
	db.none(sqlCreatePost, {user_id: user_id, message: req.query.message, replied_post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
});

// Edit a post
router.put('/post/:id', function(req, res) {
	var user_id = 150; //SESSION.id
	const query = `
		UPDATE post
		SET edit_history=array_append(edit_history, message), message=$(message)
		WHERE id=$(post_id) AND sender_id=$(user_id)`;
	db.none(query, {post_id: req.params.id, user_id: user_id, message: req.query.message})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
});

// Delete a post
router.delete('post/:id', function(req, res) {
});

// Like a post
router.post('/post/:id/like', function(req, res) {
	var user_id = 1;
	const query = `
		INSERT INTO like_post(user_id, post_id)
		VALUES ($(user_id), $(post_id))`;
	db.none(query, {user_id: user_id, post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});

// Unlike a post
router.delete('/post/:id/like', function(req, res) {
	var user_id = 1;
	const query = `
		DELETE FROM like_post
		WHERE user_id=$(user_id) AND post_id=$(post_id)`;
	db.none(query, {user_id: user_id, post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});


module.exports = router;
