const express = require('express');
const router = express.Router();


/**
 * @api {post} /messages/ Send a new message.
 * @apiName SendMessage
 * @apiGroup Messages
 * @apiPermission authenticated user
 *
 * @apiParam (RequestBody) {Integer} receiver_id Receiver's unique id.
 * @apiParam (RequestBody) {String} content Message to send.
 *
 * @apiSuccess (Success 201) message Successfully sent a message.
 *
 * @apiError (Error 500) InternalServerError Couldn't send the message.
 */
router.post('/',function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {get} /messages/:other_user Get messages between users.
 * @apiName GetMessages
 * @apiGroup Messages
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParams) {Integer} other_user Other user unique id.
 * @apiParam (RequestParams) {Integer} page current page.
 *
 * @apiSuccess (Success 200) sender_id User that sent a message.
 * @apiSuccess (Success 200) content Message content.
 * @apiSuccess (Success 200) date_sent Date the message was sent.
 *
 * @apiError (Error 500) InternalServerError Couldn't get the messages.
 */
router.get('/:other_user/', function(req, res) {
    res.sendStatus(200);
});


/**
 * @api {get} /messages/ Get topics for user. Returns an array of users that the logged user has conversations with, the last message sent between them, as well as the
 * other user's id, name and picture
 * @apiName GetTopics
 * @apiGroup Messages
 * @apiPermission authenticated user
 *
 * @apiSuccess (Success 200) other_user_id User id with a conversation topic.
 * @apiSuccess (Success 200) other_user_full_name User name with a conversation topic.
 *
 * @apiError (Error 500) InternalServerError Couldn't get message topics.
 */
router.get('/', function(req, res) {
    res.sendStatus(200);
});


module.exports = router;
