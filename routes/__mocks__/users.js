var express = require('express');
var router = express.Router();



// Get user by id
router.get('/:id', function(req, res) {

    let data = {
        sender_id : 1,
        content : 'Content text',
        date_sent : '12/12/2018'
    };
    res.status(200).json({...data, authenticated: true});
});

// Edit user
router.put('/', function(req, res) {

    res.sendStatus(200);

});

// Edit image
router.post('/image', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {get} /users/get_from_token get the authenticated user that is identified by a JWT
 * @apiName getFromToken
 * @apiGroup User
 * @apiPermission authenticated user
 *
 * @apiSuccess (Success 200) OK
 *
 */
router.get('/', function(req, res) {
    res.sendStatus(200);
});
// Get friends
router.get('/:id/friends', function(req, res) {
    res.sendStatus(200);
});

// Add friend
router.post('/add_friend', function(req, res) {
    res.sendStatus(200);
});

// Remove friend
router.delete('/add_friend', function(req, res) {
    res.sendStatus(200);
});

// Make friend request
router.post('/friend_request', function(req, res) {
    res.sendStatus(200);
});

// Remove friend request
router.delete('/friend_request', function(req, res) {
    res.sendStatus(200);
});

// Get blocked users
router.get('/:id/blocked',function(req, res) {
    res.sendStatus(200);
});

// Block user
router.post('/block_user', function(req, res) {
    res.sendStatus(200);
});
// Unblock user
router.delete('/block_user', function(req, res) {
    res.sendStatus(200);
});

// Make loan request
router.post('/loan_request', function(req, res) {
    res.sendStatus(200);
});

// Remove loan request
router.delete('/loan_request', function(req, res) {
    res.sendStatus(200);
});

// Make loan
router.post('/loan', function(req, res) {
    res.sendStatus(200);
});

// Make donation request
router.post('/donation_request', function(req, res) {
    res.sendStatus(200);
});

// Delete donation request
router.delete('/donation_request', function(req, res) {
    res.sendStatus(200);
});

// Make donation
router.post('/donation', function(req, res) {
    res.sendStatus(200);
});

// Set location (Country, region, city) info
router.post('/set_location', function(req, res) {
    res.sendStatus(200);
});
// Get services provided by user
router.get('/:id/provides', function(req, res) {
    res.sendStatus(200);
});
/**
 * @api {get} /users/:id/posts get the posts made by this user
 * @apiName getPosts
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id/posts', function(req, res) {
    res.sendStatus(200);
});

// Get services required by user
router.get('/:id/requests', function(req, res) {
    res.sendStatus(200);
});
/**
 * @api {get} /users/:id/postcount get the number of posts made by this user
 * @apiName getPosts
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id/postcount', function(req, res) {
    res.sendStatus(200);
});
// Get crowdfundings created by user
router.get('/:id/crowdfundings', function(req, res) {
    res.sendStatus(200);
});

// Get user rating
router.get('/:id/rating', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {post} /users/:id/posts post a new post
 * @apiName PostPost
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 *
 */
router.post('/:id/posts', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {get} /users/getfeed get the posts made by this user and their friends
 * @apiName getFeed
 * @apiGroup User
 *
 * @apiSuccess (Success 200)
 * */
router.get('/:id/getfeed', function(req, res) {
    res.sendStatus(200);
});

module.exports = router;
