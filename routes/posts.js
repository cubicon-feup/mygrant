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
router.get('/:id', function(req, res) {
    const query = `
        SELECT id, message, in_reply_to, coalesce(n_replies, 0) AS n_replies, coalesce(n_likes, 0) AS n_likes, date_posted, full_name, image_url FROM
            (SELECT id, sender_id, in_reply_to, message, date_posted FROM post WHERE id = $(postId)) a
            LEFT JOIN ( SELECT in_reply_to AS op_id, count(*) AS n_replies FROM post GROUP BY op_id) b ON b.op_id = a.id
            LEFT JOIN ( SELECT post_id, count(*) AS n_likes FROM like_post GROUP BY post_id ) c ON a.id = c.post_id
            JOIN (SELECT users.id AS user_id, full_name, image_url FROM users) d ON a.sender_id = d.user_id`;

    db.one(query, { postId: req.params.id })
        .then(post => {
            res.status(200).json({ post });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
});

module.exports = router;
