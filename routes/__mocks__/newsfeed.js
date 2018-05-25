var express = require('express');
var router = express.Router();


//
//
// NEWSFEED
//
//

/**
 * @api {get} /newsfeed/ 01 - Get newsfeed
 * @apiName GetNewsfeed
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Returns a list of posts made by friends of the logged in user
 *
 * @apiExample Syntax
 * GET: /api/newsfeed
 *
 * @apiSuccess (Success 200) {Integer} post_id ID of the post
 * @apiSuccess (Success 200) {String} post_message Content of the post
 * @apiSuccess (Success 200) {Date} post_date_posted Date a post was created
 * @apiSuccess (Success 200) {Integer} post_in_reply_to ID of the post this is replying to
 * @apiSuccess (Success 200) {Integer} post_n_likes Number of likes on the post
 * @apiSuccess (Success 200) {Integer} post_n_replies Number of replies on the post
 * @apiSuccess (Success 200) {Integer} post_n_images Number of images on the post
 * @apiSuccess (Success 200) {String} post_image URL of the first image of the post
 * @apiSuccess (Success 200) {Integer} post_n_edits Number of edits on the post
 * @apiSuccess (Success 200) {Integer} sender_id ID of the creator of the post
 * @apiSuccess (Success 200) {String} sender_full_name Name of the creator of the post
 * @apiSuccess (Success 200) {String} sender_image_url URL of the image of the creator of the post
 *
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {get} /newsfeed/user/:id 02 - Get userfeed
 * @apiName GetUserfeed
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Returns a list of posts made by a user
 *
 * @apiParam (RequestParam) {Integer} id ID of the user to see feed of
 *
 * @apiExample Syntax
 * GET: /api/newsfeed/user/<ID>
 * @apiExample Example
 * GET: /api/newsfeed/user/5
 *
 * @apiSuccess (Success 200) {Integer} post_id ID of the post
 * @apiSuccess (Success 200) {String} post_message Content of the post
 * @apiSuccess (Success 200) {Date} post_date_posted Date a post was created
 * @apiSuccess (Success 200) {Integer} post_in_reply_to ID of the post this is replying to
 * @apiSuccess (Success 200) {Integer} post_n_likes Number of likes on the post
 * @apiSuccess (Success 200) {Integer} post_n_replies Number of replies on the post
 * @apiSuccess (Success 200) {Integer} post_n_images Number of images on the post
 * @apiSuccess (Success 200) {String} post_image URL of the first image of the post
 * @apiSuccess (Success 200) {Integer} post_n_edits Number of edits on the post
 * @apiSuccess (Success 200) {Integer} sender_id ID of the creator of the post
 * @apiSuccess (Success 200) {String} sender_full_name Name of the creator of the post
 * @apiSuccess (Success 200) {String} sender_image_url URL of the image of the creator of the post
 *
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/user/:id', function(req, res) {
    res.sendStatus(200);
});



/**
 * @api {post} /newsfeed 03 - Create post
 * @apiName CreatePost
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Create a microblogging post
 *
 * @apiParam (RequestBody) {String} message Content of the post
 * @apiParam (RequestBody) {Integer} in_reply_to ID of the message this one is replying to (Optional)
 *
 * @apiExample Syntax
 * POST: /api/newsfeed
 * @apiExample Example
 * POST: /api/newsfeed
 * body: {
 *      message: 'A new post',
 *      in_reply_to: 5
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/', function(req, res) {
    res.sendStatus(200);
});



/**
 * @api {get} /newsfeed/:id 04 - Get post
 * @apiName GetPost
 * @apiGroup Newsfeed
 * @apiPermission visitor
 *
 * @apiDescription Returns a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the desired post
 *
 * @apiExample Syntax
 * GET: /api/newsfeed/<ID>
 * @apiExample Example
 * GET: /api/newsfeed/5
 *
 * @apiSuccess (Success 200) {Integer} post_id ID of the post
 * @apiSuccess (Success 200) {String} post_message Content of the post
 * @apiSuccess (Success 200) {Date} post_date_posted Date a post was created
 * @apiSuccess (Success 200) {Integer} post_in_reply_to ID of the post this is replying to
 * @apiSuccess (Success 200) {Integer} post_n_likes Number of likes on the post
 * @apiSuccess (Success 200) {Integer} post_n_replies Number of replies on the post
 * @apiSuccess (Success 200) {Integer} post_n_images Number of images on the post
 * @apiSuccess (Success 200) {String} post_image URL of the first image of the post
 * @apiSuccess (Success 200) {Integer} post_n_edits Number of edits on the post
 * @apiSuccess (Success 200) {Integer} sender_id ID of the creator of the post
 * @apiSuccess (Success 200) {String} sender_full_name Name of the creator of the post
 * @apiSuccess (Success 200) {String} sender_image_url URL of the image of the creator of the post
 *
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.get('/:id', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {put} /newsfeed/:id 05 - Edit post
 * @apiName EditPost
 * @apiGroup Newsfeed
 * @apiPermission post creator
 *
 * @apiDescription Edits the content of a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to edit
 * @apiParam (RequestBody) {String} message Content of the post
 *
 * @apiExample Syntax
 * PUT: /api/newsfeed/<ID>
 * @apiExample Example
 * PUT: /api/newsfeed/1
 * body: {
 *      message: 'This is an edit'
 * }
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.put('/:id', function(req, res) {
    res.sendStatus(200);
});



/**
 * @api {delete} /newsfeed/:id 06 - Delete post
 * @apiName DeletePost
 * @apiGroup Newsfeed
 * @apiPermission post creator
 *
 * @apiDescription Deletes a microblogging
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to delete
 *
 * @apiExample Syntax
 * DELETE: /api/newsfeed/<ID>
 * @apiExample Example
 * DELETE: /api/newsfeed/1
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:id', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {post} /newsfeed/:id/like 07 - Like post
 * @apiName LikePost
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Likes a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to like
 *
 * @apiExample Syntax
 * POST: /api/newsfeed/<ID>/like
 * @apiExample Example
 * POST: /api/newsfeed/1/like
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.post('/:id/like', function(req, res) {
    res.sendStatus(200);
});



/**
 * @api {delete} /newsfeed/:id/like 08 - Unlike post
 * @apiName UnlikePost
 * @apiGroup Newsfeed
 * @apiPermission authenticated user
 *
 * @apiDescription Unlikes a microblogging post
 *
 * @apiParam (RequestParam) {Integer} id ID of the post to unlike
 *
 * @apiExample Syntax
 * DELETE: /api/newsfeed/<ID>/like
 * @apiExample Example
 * DELETE: /api/newsfeed/1/like
 *
 * @apiSuccess (Success 200) OK
 * @apiError (Error 500) InternalServerError Database Query Failed
 */
router.delete('/:id/like', function(req, res) {
    res.sendStatus(200);
});



module.exports = router;
