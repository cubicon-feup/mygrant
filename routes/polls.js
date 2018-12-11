var express = require('express');
var router = express.Router();
var db = require('../config/database');
const cronJob = require('../cronjob');


const expressJwt = require('express-jwt');
const appSecret = require('../config/config').secret;
const authenticate = expressJwt({ secret: appSecret });

/**
 * @api {get} /polls/ Get all polls
 * @apiName GetAllPolls
 * @apiGroup Poll
 *
 * @apiSuccess (Success 200) {Integer} id Poll id.
 * @apiSuccess (Success 200) {String} question Poll question.
 * @apiSuccess (Success 200) {Boolean} free_text Free text poll status.
 * @apiSuccess (Success 200) {String} options Poll possible answers.
 * @apiSuccess (Success 200) {Integer} id_creator Id of poll creator.
 *
 * @apiError (Error 500) InternalServerError Couldn't get polls.
 */
router.get('/', function(req, res) {
    let query =
        `SELECT id, question, free_text, options, id_creator, creator_name, deleted
        FROM polls
        WHERE deleted = false`;

    db.manyOrNone(query).then(data => {
        res.status(200).json(data);
    }).catch(() => {
        res.status(500).json({ error: 'Couldn\'t get polls.' });
    });
});

/**
 * @api {post} /polls/ Create poll
 * @apiName CreatePoll
 * @apiGroup Poll
 * @apiPermission authenticated user
 *
 * @apiParam (RequestBody) {String} question Poll question.
 * @apiParam (RequestBody) {Boolean} free_text Poll answers are free text.
 *
 * @apiSuccess (Success 201) {Integer} id Newly created poll id.
 *
 * @apiError (Error 500) InternalServerError Couldn't create a poll.
 */
router.post('/', authenticate, function(req, res) {
    if (req.body.options != undefined) {
        var answers = req.body.options.join('|||');
    }
    var time_interval = req.body.time_interval;
    if (isNaN(time_interval)) {
        time_interval = 7;
    } else {
        if (time_interval < 1) {
            time_interval = 7;
        }
        if (time_interval > 365) {
            time_interval = 7;
        }

        if (!Number.isInteger(time_interval)) {
            time_interval = parseInt(time_interval);
        }
    }

    let query =
        `INSERT INTO polls(id_creator, question, free_text, options, creator_name, closed, deleted, date_created, date_finished)
        VALUES ($(id_creator), $(question), $(free_text), $(options), $(creator_name), $(closed), $(deleted), NOW(), NOW() +  '$(time_interval) days')
        RETURNING id, date_finished;`;

    db.one(query, {
        id_creator: req.user.id,
        question: req.body.question,
        free_text: req.body.free_text,
        options: answers,
        creator_name: req.body.creator_name,
        closed: false,
        deleted: false,
        time_interval
    }).then(data => {
        let poll_id = data.id;
        let dateFinished = new Date(data.date_finished);
        cronJob.scheduleJobPoll(poll_id, dateFinished);
        res.status(201).send({ id: poll_id });
    }).catch(() => {
            res.status(500).json('Error creating poll.');
    });
});

/**
 * @api {get} /polls/:poll_id Get poll
 * @apiName GetPoll
 * @apiGroup Poll
 *
 * @apiParam (RequestParam) {Integer} poll_id Poll id.
 *
 * @apiSuccess (Success 200) {String} question Poll question.
 * @apiSuccess (Success 200) {Boolean} free_text Free text poll status.
 * @apiSuccess (Success 200) {String} options Poll possible answers.
 *
 * @apiError (Error 500) InternalServerError Could't get the poll.
 */
router.get('/:poll_id', function(req, res) {
    let id = req.params.poll_id;
    let query =
        `SELECT question, free_text, options, id_creator, closed, deleted, date_finished
        FROM polls
        WHERE polls.id = $(id) AND deleted = false ;`;

    db.oneOrNone(query, {
        id
    }).then(data => {
        res.status(200).json(data);
    }).catch(() => {
        res.status(500).json({ error: 'Couldn\'t get the poll.' });
    });
});

/**
 * @api {put} /polls/:poll_id Put poll
 * @apiName PutPoll
 * @apiGroup Poll
 *
 * @apiParam (RequestParam) {Integer} poll_id Poll id.
 *
 * @apiParam (RequestBody) {String} options New poll options.
 *
 * @apiSuccess (Success 200) {String} message Update success message.
 *
 * @apiError (Error 500) InternalServerError Could't get the poll.
 */
router.put('/:poll_id', function(req, res) {
    let id = req.params.poll_id;
    let query =
        `SELECT options
        FROM polls
        WHERE polls.id = $(id) AND deleted = false ;`;

    db.oneOrNone(query, {
        id
    }).then(data => {

        var answers = data.options;

        var can_update = true;

        if (answers != null) {
            var arr_answers = answers.split('|||');

            var options = req.body.options;

            var arr_options = options.split('|||');

            for (var i = 0; i < arr_answers.length; i++) {
                if (arr_answers[i] != arr_options[i]) {
                    can_update = false;
                }

            }
        }

        if (can_update) {
            let id = req.params.poll_id;
            let query =
                `UPDATE public.polls
                SET options = $(options)
                WHERE polls.id = $(id) AND deleted = false ;`;

            db.none(query, {
                id,
                options: req.body.options
            }).then(data => {
                res.status(200).json(data);
            }).catch(() => {
                res.status(500).json({ error: 'Couldn\'t update the poll.' });
            });
        } else {
            res.status(500).json({ error: 'Couldn\'t update the poll.' });
        }
    }).catch(() => {
        res.status(500).json({ error: 'Couldn\'t get the poll.' });
    });

});

/**
 * @api {get} /polls/:poll_id/answers Get poll answers
 * @apiName GetPollAnswers
 * @apiGroup Poll
 *
 * @apiParam (RequestParam) {Integer} poll_id Poll id.
 *
 * @apiSuccess (Success 200) {Integer} id_user Id of user that answered.
 * @apiSuccess (Success 200) {String} answer Answer of the user.
 *
 * @apiError (Error 500) InternalServerError Could't get the poll.
 */
router.get('/:poll_id/answers', function(req, res) {
    let queryPollisNotDeleted =
    `SELECT deleted
    FROM public.polls
    WHERE id = $(id_poll) AND deleted = true`;

    db.none(queryPollisNotDeleted, {
        id_poll: req.params.poll_id
    }).then(() => {

        let id = req.params.poll_id;
        let query =
            `SELECT id_user, answer
            FROM polls_answers
            WHERE id_poll = $(id);`;

        db.manyOrNone(query, {
            id
        }).then(data => {
            res.status(200).json(data);
        }).catch(() => {
            res.status(500).json('Coudln\'t get poll answers');
        });
    }).catch(() => {
        res.status(500).json('Poll is closed.');
    });
});

/**
 * @api {post} /polls/:poll_id/answers Create poll asnwer
 * @apiName CreatePollAnswer
 * @apiGroup Poll
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} poll_id Poll id.
 *
 * @apiParam (RequestUser) {Integer} user_id Id of user that answered.
 *
 * @apiParam (RequestBody) {String} answer Poll answer.
 *
 * @apiSuccess (Success 201) {String} message Sucessfully added poll answer.
 *
 * @apiError (Error 500) InternalServerError Error adding answer.
 */
router.post('/:poll_id/answers', authenticate, function(req, res) {

    let queryUserHasVoted =
        `SELECT answer
        FROM public.polls_answers
        WHERE id_poll = $(id_poll)
        AND id_user = $(id_user);`;

    db.none(queryUserHasVoted, {
        id_poll: req.params.poll_id,
        id_user: req.user.id
    }).then(() => {
        let queryAnswerExists =
        `SELECT options,closed,deleted
        FROM public.polls
        WHERE id = $(id_poll) AND deleted = false;`;

        db.one(queryAnswerExists, {
            id_poll: req.params.poll_id
        }).then(data => {
            var options = data.options.split('|||');

            if (data.closed) {
                res.status(500).json('Poll is closed.');
            } else if (options.includes(req.body.answer)) {
                    let query =
                    `INSERT INTO polls_answers(id_poll, id_user, answer)
                    VALUES ($(id_poll), $(id_user), $(answer));`;

                    db.none(query, {
                        id_poll: req.params.poll_id,
                        id_user: req.user.id,
                        answer: req.body.answer
                    }).then(() => {
                        res.status(201).send('Sucessfully added poll answer.');
                    }).catch(() => {
                        res.status(500).json('Error adding asnwer.');
                    });
                }
        }).catch(() => {
            res.status(500).json('Answer does not exist in this poll./Poll is closed.');
        });

    }).catch(() => {
        res.status(403).json('User has Voted');
    });

});

/**
 * @api {post} /polls/:poll_id/close Close poll
 * @apiName ClosePoll
 * @apiGroup Poll
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} poll_id Poll id.
 *
 * @apiParam (RequestUser) {Integer} user_id Id of user that wants to close his poll.
 *
 * @apiParam (RequestBody) {Boolean} closed Poll closed state.
 *
 * @apiSuccess (Success 201) {String} message Poll updated.
 *
 * @apiError (Error 500) InternalServerError Couldn't change poll state.
 */
router.post('/:poll_id/close', authenticate, function(req, res) {

    let queryUserIsPollCreator =
        `SELECT id_creator
        FROM public.polls
        WHERE id = $(id_poll)`;

    db.one(queryUserIsPollCreator, {
        id_poll: req.params.poll_id
    }).then(data => {

        if (data.id_creator == req.user.id) {
            let queryAnswerExists =
            `UPDATE public.polls
            SET closed=$(closed)
            WHERE id = $(id_poll);`;

            db.none(queryAnswerExists, {
                closed: req.body.closed,
                id_poll: req.params.poll_id
            }).then(() => {
                res.status(201).json('Poll updated.');
            }).catch(() => {
                res.status(500).json('Couldn\'t change poll state');
            });

        } else {
            res.status(500).json('Invalid action.');
        }

    }).catch(() => {
        res.status(403).json('User has no polls created');
    });

});

/**
 * @api {post} /polls/:poll_id/delete Delete poll
 * @apiName DeletePoll
 * @apiGroup Poll
 * @apiPermission authenticated user
 *
 * @apiParam (RequestParam) {Integer} poll_id Poll id.
 *
 * @apiParam (RequestUser) {Integer} user_id Id of user that wants to delete the poll.
 *
 * @apiParam (RequestBody) {Boolean} deleted Poll deleted state.
 *
 * @apiSuccess (Success 201) {String} message Poll updated.
 *
 * @apiError (Error 500) InternalServerError Couldn't change poll state.
 */
router.post('/:poll_id/delete', authenticate, function(req, res) {

    let queryUserIsPollCreator =
        `SELECT id_creator
        FROM public.polls
        WHERE id = $(id_poll)`;

    db.one(queryUserIsPollCreator, {
        id_poll: req.params.poll_id
    }).then(data => {

        if (data.id_creator == req.user.id) {
            let queryAnswerExists =
            `UPDATE public.polls
            SET deleted = $(deleted)
            WHERE id = $(id_poll);`;

            db.none(queryAnswerExists, {
                deleted: req.body.deleted,
                id_poll: req.params.poll_id
            }).then(() => {
                res.status(201).json('Poll updated.');
            }).catch(() => {
                res.status(500).json('Couldn\'t change poll state');
            });

        } else {
            res.status(500).json('Invalid action.');
        }

    }).catch(() => {
        res.status(403).json('User has no polls created');
    });

});

module.exports = router;
