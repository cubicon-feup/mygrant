var express = require('express');
var router = express.Router();

/**
 * @api {put} /comments/ Create comment
 * @apiName CreateComment
 * @apiGroup CommentStandard
 * @apiPermission CommentStandard creator
 *
 * @apiParam (RequestBody) [Integer] crowdfunding_id Crowdfunding id that the comment belongs (XOR service_id).
 * @apiParam (RequestBody) [Integer] service_id Service id that the comment belongs (XOR crowdfudning_id).
 * @apiParam (RequestBody) {String} message Message to serve as comment.
 * @apiParam (RequestBody) {Integer} in_reply_to CommentStandard id that this new comment is replying to (can be null).
 *
 * @apiSuccess (Success 201) Created
 *
 * @apiError (Error 500) InternalServerError
 */
// FIXME: not working with POST method, had to use PUT.
// TODO: policy.
router.put('/', function(req, res) {
    res.sendStatus(200);
});

router.get('/', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {get} /comments/top_comments Get top comments (those that are not a reply)
 * @apiName GetTopComments
 * @apiGroup CommentStandard
 *
 * @apiParam (RequestQuery) [Integer] crowdfunding_id Crowdfunding id that the comment belongs (XOR service_id).
 * @apiParam (RequestQuery) [Integer] service_id Service id that the comment belongs (XOR crowdfudning_id).
 *
 * @apiSuccess (Success 200) {Integer} user_id User id that the comment belongs.
 * @apiSuccess (Success 200) {Integer} user_name User name that the comment belongs.
 * @apiSuccess (Success 200) {Integer} comment_id Comment id.
 * @apiSuccess (Success 200) {Integer} comment_message Message that the comment holds.
 * @apiSuccess (Success 200) {Integer} date_posted Date the coment was posted.
 * @apiSuccess (Success 200) {Integer} in_reply_to Comment id that the comment is replying (can be null).
 *
 * @apiError (Error 500) InternalServerError
 */
// TODO: policy.
router.get('/top_comments', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {get} /comments/:comment_id/nested_comments Get nested comments
 * @apiName GetNestedComments
 * @apiGroup CommentStandard
 * @apiPermission CommentStandard creator
 *
 * @apiParam (RequestParams) {Integer} comment_di Comment id to get the nested comments from.
 *
 * @apiSuccess (Success 200) {Integer} user_id User id that the comment belongs.
 * @apiSuccess (Success 200) {Integer} user_name User name that the comment belongs.
 * @apiSuccess (Success 200) {Integer} comment_id Comment id.
 * @apiSuccess (Success 200) {Integer} comment_message Message that the comment holds.
 * @apiSuccess (Success 200) {Integer} date_posted Date the coment was posted.
 * @apiSuccess (Success 200) {Integer} in_reply_to Comment id that the comment is replying (can be null).
 *
 * @apiError (Error 500) InternalServerError
 */
router.get('/:comment_id/nested_comments', function(req, res) {
    res.sendStatus(200);
});

/**
 * @api {put} /comments/:comment_id Update comment
 * @apiName UpdateComment
 * @apiGroup CommentStandard
 * @apiPermission CommentStandard creator
 *
 * @apiParam (RequestParam) {Integer} comment_id CommentStandard id to update.
 * @apiParam (RequestBody) {String} message Updated message to serve as comment.
 *
 * @apiSuccess (Success 200) OK
 *
 * @apiError (Error 500) InternalServerError Couldn't get pages number.
 */
// TODO: policy.
router.put('/:comment_id', function(req, res) {
    res.sendStatus(200);
});
/**
 * @api {delete} /comments/:comment_id Delete comment
 * @apiName DeleteComment
 * @apiGroup CommentStandard
 * @apiPermission CommentStandard creator
 *
 * @apiParam (RequestParam) {Integer} comment_id CommentStandard id to delete.
 *
 * @apiSuccess (Success 200) OK
 *
 * @apiError (Error 500) InternalServerError
 */
// TODO: policy.
router.delete('/:comment_id', function(req, res) {
    res.sendStatus(200);
});
module.exports = router;
