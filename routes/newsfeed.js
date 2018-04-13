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
var sqlGetNewsfeed = getQuery('newsfeed/getNewsfeed');
var sqlGetUserfeed = getQuery('newsfeed/getUserfeed')
var sqlCreatePost = getQuery('newsfeed/createPost');
var sqlGetPost = getQuery('newsfeed/getPost');
var sqlEditPost = getQuery('newsfeed/editPost');
var sqlLikePost = getQuery('newsfeed/likePost');
var sqlUnlikePost = getQuery('newsfeed/unlikePost');


// Get all posts from friends
router.get('/', function(req, res) {
	var user_id = 2; //SESSION.id
	db.any(sqlGetNewsfeed, {user_id: 2})
	.then(data => {
		res.json({data});
	})
	.catch(error => {
		res.json({error});
	});
});

// Get all posts by user
router.get('/user/:id', function(req, res) {
	db.any(sqlGetUserfeed, {user_id: req.params.id})
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
	db.none(sqlCreatePost, {user_id: user_id, message: req.query.message, replied_post_id: null})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
});

// Get a post by id
router.get('/post/:id', function(req, res) {
	db.any(sqlGetPost, {post_id: req.params.id})
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
	db.none(sqlCreatePost, {user_id: user_id, message: req.query.message, replied_post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
});

// Edit a post
router.put('/post/:id/edit', function(req, res) {
	var user_id = 150; //SESSION.id
	db.none(sqlEditPost, {post_id: req.params.id, user_id: user_id, message: req.query.message})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
});

// Delete a post
router.delete('post/:id/delete', function(req, res) {
});

// Like a post
router.post('/post/:id/like', function(req, res) {
	var user_id = 1;
	db.none(sqlLikePost, {user_id: user_id, post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});

// Unlike a post
router.delete('/post/:id/unlike', function(req, res) {
	var user_id = 1;
	db.none(sqlUnlikePost, {user_id: user_id, post_id: req.params.id})
	.then(() => {
		res.sendStatus(200);
	})
	.catch(error => {
		res.json({error});
	});
	
});


module.exports = router;
