var express = require('express');
var router = express.Router();
var db = require('../config/database');

const expressJwt = require('express-jwt');
const appSecret = require('../config/config').secret;
const authenticate = expressJwt({ secret: appSecret });

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
router.put('/', authenticate, function(req, res) {
    let senderId = req.user.id;
    let message = req.body.message;

    let crowdfundingId = req.body.hasOwnProperty('crowdfunding_id') ? req.body.crowdfunding_id : null;
    let serviceId = req.body.hasOwnProperty('service_id') ? req.body.service_id : null;
    let serviceOrCrowdfundingId;
    let serviceOrCrowdfunding;
    if((crowdfundingId != null && serviceId != null) || (crowdfundingId == null && serviceId == null)) {
        res.status(400).json({error: 'Can only insert a comment either on a service or a crowdfunding.'})
        return;
    } else if (crowdfundingId != null) {
        serviceOrCrowdfunding = 'crowdfunding_id';
        serviceOrCrowdfundingId = crowdfundingId
    } else {
        serviceOrCrowdfunding = 'service_id';
        serviceOrCrowdfundingId = serviceId;
    }

    let inReplyTo = req.body.hasOwnProperty('in_reply_to') ? req.body.in_reply_to : null;
    let query =
        `INSERT INTO comment (sender_id, message, ${serviceOrCrowdfunding}, date_posted, in_reply_to)
        VALUES ($(sender_id), $(message), $(service_or_crowdfunding_id), NOW(), $(in_reply_to))
        RETURNING id, date_posted;`;

    db.one(query, {
        sender_id: senderId,
        message: message,
        service_or_crowdfunding_id: serviceOrCrowdfundingId,
        in_reply_to: inReplyTo
    }).then(data => {
        res.status(201).json(data);
    }).catch(error => {
        res.status(500).json(error);
    })
});

router.get('/', function(req, res) {
    let crowdfundingId = req.query.hasOwnProperty('crowdfunding_id') ? req.query.crowdfunding_id : null;
    let serviceId = req.query.hasOwnProperty('service_id') ? req.query.service_id : null;
    let serviceOrCrowdfundingId;
    let serviceOrCrowdfunding;
    if((crowdfundingId != null && serviceId != null) || (crowdfundingId == null && serviceId == null)) {
        res.status(400).json({error: 'Can only insert a comment either on a service or a crowdfunding.'})
        return;
    } else if (crowdfundingId != null) {
        serviceOrCrowdfunding = 'crowdfunding_id';
        serviceOrCrowdfundingId = crowdfundingId
    } else {
        serviceOrCrowdfunding = 'service_id';
        serviceOrCrowdfundingId = serviceId;
    }

    let query =
        `SELECT comment.sender_id as user_id, users.full_name as user_name, comment.id as comment_id, comment.message, date_posted, in_reply_to
        FROM comment
        INNER JOIN users ON users.id = comment.sender_id
        WHERE comment.${serviceOrCrowdfunding} = $(service_or_crowdfunding_id)
        ORDER BY date_posted;`;

    db.manyOrNone(query, {
        service_or_crowdfunding_id: serviceOrCrowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
})

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
    let crowdfundingId = req.query.hasOwnProperty('crowdfunding_id') ? req.query.crowdfunding_id : null;
    let serviceId = req.query.hasOwnProperty('service_id') ? req.query.service_id : null;
    let serviceOrCrowdfundingId;
    let serviceOrCrowdfunding;
    if((crowdfundingId != null && serviceId != null) || (crowdfundingId == null && serviceId == null)) {
        res.status(400).json({error: 'Can only insert a comment either on a service or a crowdfunding.'})
        return;
    } else if (crowdfundingId != null) {
        serviceOrCrowdfunding = 'crowdfunding_id';
        serviceOrCrowdfundingId = crowdfundingId
    } else {
        serviceOrCrowdfunding = 'service_id';
        serviceOrCrowdfundingId = serviceId;
    }

    let query =
        `SELECT comment.sender_id as user_id, users.full_name as user_name, comment.id as comment_id, comment.message, date_posted, in_reply_to
        FROM comment
        INNER JOIN users ON users.id = comment.sender_id
        WHERE comment.${serviceOrCrowdfunding} = $(service_or_crowdfunding_id)
            AND comment.in_reply_to IS NULL
        ORDER BY date_posted;`;

    db.manyOrNone(query, {
        service_or_crowdfunding_id: serviceOrCrowdfundingId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
})

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
    let commentId = req.params.comment_id;
    let query =
        `SELECT comment.sender_id as user_id, users.full_name as user_name, comment.id as comment_id, comment.message, date_posted, in_reply_to
        FROM comment
        INNER JOIN users ON users.id = comment.sender_id
        WHERE comment.in_reply_to = $(comment_id)
        ORDER BY date_posted;`;

    db.manyOrNone(query, {
        comment_id: commentId
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    })
})

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
router.put('/:comment_id', authenticate, function(req, res) {
    let senderId = req.user.id;
    let commentId = req.params.comment_id;
    let message = req.body.message;
    let query =
        `UPDATE comment
        SET message = $(message)
        WHERE id = $(comment_id)
            AND sender_id = $(sender_id);`;

    db.none(query, {
        message: message,
        comment_id: commentId,
        sender_id: senderId
    }).then(() => {
        res.sendStatus(200);
    }).catch(error => {
        res.status(500).json({error});
    })
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
router.delete('/:comment_id', authenticate, function(req, res) {
    let senderId = req.user.id;
    let commentId = req.params.comment_id;
    let query =
        `DELETE FROM comment
        WHERE id = $(comment_id)
            AND sender_id = $(sender_id);`;

    db.none(query, {
        comment_id: commentId,
        sender_id: senderId
    }).then(() => {
        res.sendStatus(200);
    }).catch(error => {
        res.status(500).json(error);
    })
});

module.exports = router;
