var express = require('express');
var router = express.Router();
var db = require('../config/database');
const appSecret = require('../config/config').secret;
const expressJwt = require('express-jwt');

const authenticate = expressJwt({ secret: appSecret });

/**
 * @api {get} /posts/:id/comments get the posts made in reply to this post
 * @apiName getComments
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id/comments', function(req, res) {
    const offset = req.query.page * 20;


    const query = `
        SELECT id, message, in_reply_to, coalesce(n_likes, 0) AS n_likes, date_posted, full_name, image_url FROM
            (SELECT id, sender_id, in_reply_to, message, date_posted FROM post WHERE in_reply_to = $(postId)) a
            LEFT JOIN ( SELECT post_id, count(*) AS n_likes FROM like_post GROUP BY post_id ) c ON a.id = c.post_id
            JOIN (SELECT users.id AS user_id, full_name, image_url FROM users) d ON a.sender_id = d.user_id
        ORDER BY date_posted DESC LIMIT 20 OFFSET $(offset);`;

    db.manyOrNone(query,
        {
            offset,
            postId: req.params.id
        })
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

/**
 * @api {get} /posts/:id get this post's info
 * @apiName getPost
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.get('/:id', authenticate, function(req, res) {
    const query = `
        SELECT id, message, in_reply_to, 
            coalesce(n_replies, 0) AS n_replies, coalesce(n_likes, 0) AS n_likes,
            date_posted, sender_id, full_name, image_url, coalesce(liked, 0) AS liked FROM
            (SELECT id, sender_id, in_reply_to, message, date_posted FROM post WHERE id = $(postId)) a
            LEFT JOIN ( SELECT in_reply_to AS op_id, count(*) AS n_replies FROM post GROUP BY op_id) b ON b.op_id = a.id
            LEFT JOIN ( SELECT post_id, count(*) AS n_likes FROM like_post GROUP BY post_id ) c ON a.id = c.post_id
            JOIN (SELECT users.id AS user_id, full_name, image_url FROM users) d ON a.sender_id = d.user_id
            LEFT JOIN (SELECT COUNT(*) AS liked, post_id from like_post where user_id = $(thisUser) group by post_id) e on a.id = e.post_id
    `;

    db.one(query, {
        postId: req.params.id,
        thisUser: req.user.id
    })
        .then(post => {
            res.status(200).json({ post });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

/**
 * @api {post} /posts/:id/comment post a new post
 * @apiName PostComment
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.post('/:id/comment', authenticate, function(req, res) {

    const query = 'INSERT INTO post(sender_id, message, in_reply_to) VALUES ($(userId), $(content), $(inReplyTo))';

    // Check that the user that made the request is trying to post to his blog
    db.none(query, {
        content: req.body.content,
        inReplyTo: req.params.id,
        userId: req.user.id
    })
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(500));
});

/**
 * @api {post} /posts/:id/like like a post
 * @apiName LikePost
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.post('/:id/like', authenticate, function(req, res) {

    const userId = req.user.id;
    const postId = req.params.id;

    const query = 'INSERT into like_post(user_id, post_id) VALUES ($(userId), $(postId))';

    db.none(query, {
        postId,
        userId
    })
        .then(() => res.sendStatus(201))
        .catch(() => res.sendStatus(500));
});

/**
 * @api {delete} /posts/:id/like unlike a post
 * @apiName UnlikePost
 * @apiGroup Post
 *
 * @apiSuccess (Success 200)
 *
 */
router.delete('/:id/like', authenticate, function(req, res) {

    const userId = req.user.id;
    const postId = req.params.id;

    const query = 'DELETE FROM like_post WHERE user_id = $(userId) AND post_id = $(postId)';

    db.none(query, {
        postId,
        userId
    })
        .then(() => res.sendStatus(204))
        .catch(error => res.sendStatus(500));
});

module.exports = router;
