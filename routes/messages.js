const express = require('express');
const router = express.Router();
const db = require('../config/database');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const transporter = nodemailer.createTransport(config.transporterOptions);

/**
 * @api {post} /messages/ Send a new message.
 * @apiName SendMessage
 * @apiGroup Messages
 * @apiPermission authenticated user
 * 
 * @apiParam (RequestBody) {Integer} sender_id Sender's unique id.
 * @apiParam (RequestBody) {Integer} receiver_id Receiver's unique id.
 * @apiParam (RequestBody) {String} content Message to send.
 * 
 * @apiSuccess (Success 201) message Successfully sent a message.
 * 
 * @apiError (Error 500) InternalServerError Couldn't send the message.
 */
router.post('/', function(req, res) {
    let senderId = req.body.sender_id;
    let receiverId = req.body.receiver_id;
    let content = req.body.content;
    let query =
        `INSERT INTO message (sender_id, receiver_id, date_sent, content)
        VALUES ($(sender_id), $(receiver_id), now(), $(content));`;

    db.none(query, {
        sender_id: senderId,
        receiver_id: receiverId,
        content: content
    }).then(() => {
        query =
            `SELECT receiver.full_name as receiver_name, receiver.email as receiver_email, sender.full_name as sender_name
            FROM users as receiver, users as sender
            WHERE receiver.id = $(receiver_id)
                AND sender.id = $(sender_id);`;

        db.one(query, {
            receiver_id: receiverId,
            sender_id: senderId
        }).then(data => {
            let receiverName = data.receiver_name;  // FIXME: Not being used right now.
            let receiverEmail = data.email;
            let senderName = data.sender_name;

            let mailOptions = {
                from: config.messageNotificationOptions.from,
                to: receiverEmail,
                subject: config.messageNotificationOptions.subject,
                html: `
                    <!DOCTYPE html>
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
                                    You have a new message from <a href="#"><bold>${senderName}</bold></a>.
                                </p>
                                <a href="www.google.com"><button class="btn">Check message</button></a>
                            </div>
                        </body>
                    </html>
                    `
            };
            transporter.sendMail(mailOptions);
            res.status(201).json({message: 'Successfully sent a message.'});
        }).catch(error => {
            // We don't need to inform the sender that the mail message failed.
            res.status(201).json({message: 'Successfully sent a message.'});
        });
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t send the message.'});
    });
});

/**
 * @api {get} /messages/:other_user Get messages between users.
 * @apiName GetMessages
 * @apiGroup Messages
 * @apiPermission authenticated user
 * 
 * @apiParam (RequestParams) {Integer} other_user Other user unique id.
 * 
 * @apiSuccess (Success 200) sender_id User that sent a message.
 * @apiSuccess (Success 200) content Message content.
 * @apiSuccess (Success 200) date_sent Date the message was sent.
 * 
 * @apiError (Error 500) InternalServerError Couldn't get the messages.
 */
router.get('/:other_user', function(req, res) {
    let loggedUser = 1; //TODO: Use the session cookie id.
    let otherUser = req.params.other_user;
    let query =
        `SELECT message.sender_id, message.content, message.date_sent
        FROM message
        WHERE (
            sender_id = $(logged_user) AND
            receiver_id = $(other_user)
        ) OR (
            sender_id = $(other_user) AND
            receiver_id = $(logged_user)
        )
        ORDER BY date_sent`;

    db.many(query, {
        logged_user: loggedUser,
        other_user: otherUser
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get the messages.'});
    });
});

/**
 * @api {get} /messages/ Get topics for user.
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
    let loggedUser = 1; //TODO: Use the session cookie id.
    let query =
        `SELECT DISTINCT 
            CASE	WHEN sender_id = $(logged_user) THEN receiver_id
                ELSE sender_id
            END as other_user_id, users.full_name as other_user_full_name
        FROM message
        INNER JOIN users ON users.id = (
            CASE 	WHEN sender_id = $(logged_user) THEN receiver_id
                ELSE sender_id
            END)
        WHERE sender_id = $(logged_user) OR receiver_id = $(logged_user);`;

    db.many(query, {
        logged_user: loggedUser
    }).then(data => {
        res.status(200).send(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get message topics.'});
    });
});

module.exports = router;