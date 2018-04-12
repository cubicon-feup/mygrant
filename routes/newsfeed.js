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

router.get('/', function(req, res) {
	var user_id = 2; //SESSION.id
	var sqlGetNewsfeed = getQuery('getNewsfeed');
	db.any(sqlGetNewsfeed, {user_id: 2})
	.then(data => {
		res.json({data});
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
