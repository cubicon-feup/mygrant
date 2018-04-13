var express = require('express');
var router = express.Router();
var db = require('../config/database');

//
//
// USERS
//
//

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
	db.any(query, {user_id: req.params.id})
	.then(data => {
		res.status(200).json({data});
	})
	.catch(error => {
		res.status(500).json({error});
	});
});

// Add friend
router.post('/add_friend', function(req, res) {
	var user_id = 1; //SESSION.id
	const query = `
		INSERT INTO friend(user1_id, user2_id)
		VALUES ($(user1_id), $(user2_id))`;
	db.none(query, {user1_id: user_id, user2_id: req.query.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.status(500).json({error});
	});
	
});

// Remove friend
router.delete('/add_friend', function(req, res) {
	var user_id = 1; //SESSION.id
	const query = `
		DELETE FROM friend
		WHERE (user1_id=$(user1_id) AND user2_id=$(user2_id))
		OR (user1_id=$(user2_id) AND user2_id=$(user1_id))`;
	db.none(query, {user1_id: user_id, user2_id: req.query.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.status(500).json({error});
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
	db.any(query, {user_id: req.params.id})
	.then(data => {
		res.status(200).json({data});
	})
	.catch(error => {
		res.status(500).json({error});
	});
});

// Block user
router.post('/block_user', function(req, res) {
	var user_id = 1; //SESSION.id
	const query = `
		INSERT INTO blocked(blocker_id, target_id)
		VALUES ($(blocker_id), $(target_id))`;
	db.none(query, {blocker_id: user_id, target_id: req.query.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.status(500).json({error});
	});
	
});

// Unblock user
router.delete('/block_user', function(req, res) {
	var user_id = 1; //SESSION.id
	const query = `
		DELETE FROM blocked
		WHERE blocker_id=$(blocker_id) AND target_id=$(target_id)`;
	db.none(query, {blocker_id: user_id, target_id: req.query.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.status(500).json({error});
	});
	
});


module.exports = router;
