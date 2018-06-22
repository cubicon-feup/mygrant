var express = require('express');
var router = express.Router();

/**
 * @api {get} /posts/:id/comments get the posts made in reply to this post
 * @apiName getComments
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id/comments', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {get} /posts/:id get this post's info
 * @apiName getPost
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {post} /posts/:id/comment post a new post
 * @apiName PostComment
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.post('/:id/comment', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {post} /posts/:id/like like a post
 * @apiName LikePost
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.post('/:id/like', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {delete} /posts/:id/like unlike a post
 * @apiName UnlikePost
 * @apiGroup Post
 *
 * @apiSuccess (Success 204)
 *
 */
router.delete('/:id/like', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {post} /posts/:id/edit edit a post
 * @apiName EditPost
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.post('/:id/edit', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {post} /posts/:id/delete delete a post
 * @apiName DeletePost
 * @apiGroup Post
 *
 * @apiSuccess (Success 204)
 *
 */
router.delete('/:id/delete', function(req, res) {
    res.sendStatus(200);
});

module.exports = router;
