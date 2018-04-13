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
var sqlGetNewsfeed = getQuery('getNewsfeed');
var sqlGetUserfeed = getQuery('getUserfeed')
var sqlCreatePost = getQuery('createPost');
var sqlGetPost = getQuery('getPost');
var sqlEditPost = getQuery('editPost');


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
router.put('/post', function(req, res) {
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
router.put('/post/:id/reply', function(req, res) {
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

/*
// Get list of all services
router.get('/', function(req, res) {
  res.json({ teste: 'lista de servicos' });
});

// Search service by various parameters
// filters: by name, by date, by distance, by popularity, by user
router.get('/search', function(req, res) {
	res.json(req.query); // print out the params
	// TODO
});

// Get service by id
router.get('/:id', function(req, res) {
	// TODO
  res.json({ teste: req.params.id });
});

// Put (create) service.
router.put('/', function(req, res) {
	// TODO
});

// Put (update) service.
router.put('/:id', function(req, res) {
	// TODO
});

// Delete service.
router.delete('/:id', function(req, res) {
	// TODO
});

//
//
// IMAGES
//
//

// Get images.
router.get('/:id/images', function(req, res) {
	// TODO
});

// Add image.
router.put('/:id/images', function(req, res) {
	// TODO
});

// Delete image.
router.delete('/:id/images/:image', function(req, res) {
	// TODO
});

//
//
// OFFERS
//
//

// Get list of offers.
router.get('/:id/offers', function(req, res) {
	// TODO
});

// Get specific offer.
router.get('/:id/offers/:offer', function(req, res) {
	// TODO
});

// Pick an offer.
router.post('/:id/offers/:offer', function(req, res) {
	// TODO
});

// Remove offer.
router.delete('/:id/offers/:offer', function(req, res) {
	// TODO
});
*/


module.exports = router;
