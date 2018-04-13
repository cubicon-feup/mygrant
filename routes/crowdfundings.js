var express = require('express');
var router = express.Router();
var db = require('../config/database');

// Creates a crowdfunding project.
router.post('/', function(req, res) {

});

// Gets a crowdfunding project.
router.get('/:id', function(req, res) {

});

// Updates a crowdfunding project.
router.put('/:id', function(req, res) {

});

// Deletes a crowdfunding project.
router.delete('/:id', function(req, res) {

});

// Gets a crowdfunding project average rating.
router.get('/:id/rating', function(req, res) {

});

// Get all the crowdfunding projects.
router.get('/', function(req, res) {
    
});

// User donates to crowdfunding project.
router.post('/:id/donate', function(req, res) {

});

// Gets all crowdfunding project's donations.
router.get('/:id/donations', function(req, res) {

});

// Rate a crowdfunding project.
router.get('/:id/rate', function(req, res) {

});

// Service creator offers a service to the crowdfunding creator.
router.post('/:id/service_offer', function(req, res) {

});

// Deletes a service offer from the available offers.
router.delete('/:id/service_offer', function(req, res) {

});

module.exports = router;