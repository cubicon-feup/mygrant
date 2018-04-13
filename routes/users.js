var express = require('express');
var router = express.Router();
var pgp = require('pg-promise');
var db = require('../database');
var path = require('path');

function getQuery(filename) {
	var fullPath = path.join(__dirname, '../database/queries/'+filename+'.sql');
	return new pgp.QueryFile(fullPath, {minify: true});
};

//
//
// USERS
//
//

// Queries
var sqlGetFriends = getQuery('users/getFriends');
var sqlAddFriend = getQuery('users/addFriend');
var sqlRemoveFriend = getQuery('users/removeFriend');

var sqlGetBlocked = getQuery('users/getBlocked');
var sqlBlockUser = getQuery('users/blockUser');
var sqlUnblockUser = getQuery('users/unblockUser');


// Get friends
router.get('/:id/friends', function(req, res) {
	db.any(sqlGetFriends, {user_id: req.params.id})
	.then(data => {
		res.json({data});
	})
	.catch(error => {
		res.json({error});
	});
});

// Add friend
router.post('/friends/add/:id', function(req, res) {
	var user_id = 1; //SESSION.id
	db.none(sqlAddFriend, {user1_id: user_id, user2_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});

// Remove friend
router.delete('/friends/remove/:id', function(req, res) {
	var user_id = 1; //SESSION.id
	db.none(sqlRemoveFriend, {user1_id: user_id, user2_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});

// Get blocked users
router.get('/:id/blocked', function(req, res) {
	db.any(sqlGetBlocked, {user_id: req.params.id})
	.then(data => {
		res.json({data});
	})
	.catch(error => {
		res.json({error});
	});
});

// Block user
router.post('/blocked/block/:id', function(req, res) {
	var user_id = 1; //SESSION.id
	db.none(sqlBlockUser, {blocker_id: user_id, target_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});

// Unblock user
router.delete('/blocked/unblock/:id', function(req, res) {
	var user_id = 1; //SESSION.id
	db.none(sqlUnblockUser, {blocker_id: user_id, target_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});

// Gets all the user's crowdfunding projects.
router.get('/user/:id/crowdfundings', function(req, res) {

});


module.exports = router;
