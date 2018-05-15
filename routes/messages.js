const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const transporter = nodemailer.createTransport(config.transporterOptions);
const appSecret = require('../config/config').secret;
const expressJwt = require('express-jwt');

const authenticate = expressJwt({ secret: appSecret });

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
router.post('/', authenticate, function(req, res) {
    const senderId = req.user.id;
    const receiverId = req.body.receiver_id;
    const { content } = req.body;

    let query =
        `INSERT INTO message (sender_id, receiver_id, content)
        VALUES ($(senderId), $(receiverId), $(content));`;

    db.none(query, {
        content,
        receiverId,
        senderId
    }).then(() => {
        query =
            `SELECT receiver.full_name as receiver_name, receiver.email as receiver_email, sender.full_name as sender_name
            FROM users as receiver, users as sender
            WHERE receiver.id = $(receiverId)
                AND sender.id = $(senderId);`;

        db.one(query, {
            receiverId,
            senderId
        }).then(data => {
            const receiverName = data.receiver_name;
            const receiverEmail = data.email;
            const senderName = data.sender_name;

            const html =
                `<!DOCTYPE html>
                    <html>
                        <head>
                            <style>
                                .btn {
                                    background-color: #4CAF50;
                                    border: none;
                                    color: white;
                                    padding: 15px 25px;
                                    text-align: center;
                                    font-size: 16px;
                                    cursor: pointer;
                                }
                                .btn:hover {
                                    background-color: green
                                }

                            </style>
                        </head>
                        <body>
                            <div>
                                <h2>
                                    New Message Notification
                                </h2>
                                <p>
                                    Hi, ${receiverName}!
                                    You have a new message from <a href="#"><bold>${senderName}</bold></a>.
                                </p>
                                <a href="www.google.com"><button class="btn">Check message</button></a>
                            </div>
                        </body>
                    </html>`;

            const mailOptions = {
                from: config.messageNotificationOptions.from,
                html,
                subject: config.messageNotificationOptions.subject,
                to: receiverEmail
            };

            transporter.sendMail(mailOptions);
            res.status(201).json({ message: 'Successfully sent a message.' });
        })
            .catch(() => {
            // We don't need to inform the sender that the mail message failed.
            res.status(201).json({ message: 'Successfully sent a message.' });
        });
    })
        .catch(() => {
        res.status(500).json({ error: 'Couldn\'t send the message.' });
    });
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
router.get('/:other_user/', authenticate, function(req, res) {
    const loggedUser = req.user.id;
    const offset = req.query.page * 20;
    const otherUser = req.params.other_user;

    const query =
        `SELECT m.sender_id, m.content, m.date_sent
        FROM ( SELECT * FROM message
            WHERE (
                sender_id = $(loggedUser) AND
                receiver_id = $(otherUser)
            ) OR (
                sender_id = $(otherUser) AND
                receiver_id = $(loggedUser)
            )
            ORDER BY date_sent DESC
            LIMIT 20 OFFSET $(offset)
        ) m ORDER BY m.date_sent ASC
    `;

    db.manyOrNone(query, {
        loggedUser,
        offset,
        otherUser
    })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(() => {
            res.status(500).json({ error: 'Couldn\'t get the messages.' });
        });
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
router.get('/', authenticate, function(req, res) {
    const loggedUser = req.user.id;

    // Select all the users that the user has sent to or received messages from
    const query =
        `SELECT CASE WHEN mt.sender_id = $(loggedUser) then receiver_id else sender_id end as other_user_id, full_name as other_user_full_name, 
        content, date_sent, image_url
            FROM (
                message m INNER JOIN (
                    SELECT CASE WHEN sender_id = $(loggedUser) then receiver_id else sender_id end as other_user_id_max , max(date_sent) as maxDate
                    FROM message
                    WHERE sender_id = $(loggedUser) OR receiver_id = $(loggedUser)
                    GROUP by other_user_id_max
                ) t on t.other_user_id_max = ( CASE WHEN m.sender_id = $(loggedUser) then m.receiver_id else m.sender_id end) and m.date_sent = t.maxDate
            ) mt INNER JOIN (
                SELECT * FROM users
            ) u on u.id = ( CASE WHEN mt.sender_id = $(loggedUser) then mt.receiver_id else mt.sender_id end)`;


    db.many(query, { loggedUser }).then(data => {
        res.status(200).send(data);
    })
        .catch(() => {
        res.status(500).json({ error: 'Couldn\'t get message topics.' });
    });
});

module.exports = router;
