var express = require('express');
var router = express.Router();
var pgp = require('pg-promise');
var db = require('../database');
var path = require('path');

// Creates a crowdfunding project.
router.post('/crowdfundings', function(req, res) {

});

// Gets a crowdfunding project.
router.get('/crowdfundings/:id', function(req, res) {

});

// Updates a crowdfunding project.
router.put('/crowdfundings/:id', function(req, res) {

});

// Deletes a crowdfunding project.
router.delete('/crowdfundings/:id', function(req, res) {

});

// Gets a crowdfunding project average rating.
router.get('/crowdfunding/:id/rating', function(req, res) {

});

// Get all the crowdfunding projects.
router.get('/crowdfundings', function(req, res) {
    
});

// User donates to crowdfunding project.
router.post('/crowdfundings/:id/donate', function(req, res) {

});

// Gets all crowdfunding project's donations.
router.get('/crowdfundings/:id/donations', function(req, res) {

});

// Rate a crowdfunding project.
router.get('/crowdfundings/:id/rate', function(req, res) {

});

// Service creator offers a service to the crowdfunding creator.
router.post('/crowdfunding/:id/service_offer', function(req, res) {

});

// Deletes a service offer from the available offers.
router.delete('/crowdfundings/:id/service_offer', function(req, res) {

});