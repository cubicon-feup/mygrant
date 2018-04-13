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
// NEWSFEED
//
//

// Queries
var sqlAddFriend = getQuery('users/addFriend');
var sqlRemoveFriend = getQuery('users/removeFriend');
var sqlGetFriends = getQuery('users/getFriends');

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


module.exports = router;
