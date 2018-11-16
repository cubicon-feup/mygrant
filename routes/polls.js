var express = require('express');
var router = express.Router();
var db = require('../config/database');


const expressJwt = require('express-jwt');
const appSecret = require('../config/config').secret;
const authenticate = expressJwt({ secret: appSecret });

router.get('/:poll_id', function(req, res) {
    let id = req.params.poll_id;
    let query =
        `SELECT question, free_text, options
        FROM polls
        WHERE polls.id = $(id);`;

    db.oneOrNone(query, {
        id: id
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get the poll.'});
    });
});


router.get('/', function(req, res) {
    let query =
        `SELECT id, question, free_text, options, id_creator
        FROM polls`;

    db.manyOrNone(query).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error: 'Couldn\'t get the poll.'});
    });
});


router.post('/', authenticate, function(req, res) {
    
    let query =
        `INSERT INTO polls(id_creator, question, free_text, options)
        VALUES ($(id_creator), $(question), $(free_text), $(options));`;

    db.one(query, {
        id_creator: req.user.id,
        question: req.body.name,
        free_text: req.body.free_text,
        options: req.body.options
    }).then(() => {
        res.status(201).send('Sucessfully added poll.');
    }).catch(error => {
            res.status(500).json({ error });
    });
});

router.get('/:poll_id/answers', function(req, res) {
    let id = req.params.poll_id;
    let query =
        `SELECT id_user, answer
        FROM polls_answers
        WHERE id_poll = $(id);`;

    db.manyOrNone(query, {
        id: id
    }).then(data => {
        res.status(200).json(data);
    }).catch(error => {
        res.status(500).json({error});
    });
});

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
        `SELECT options
        FROM public.polls
        WHERE id = $(id_poll);`

        db.one(queryAnswerExists, {
            id_poll: req.params.poll_id,
        }).then((data) => {
            var options = data['options'].split('|||');

            if (options.includes(req.body.answer)){
                let query =
                `INSERT INTO polls_answers(id_poll, id_user, answer)
                VALUES ($(id_poll), $(id_user), $(answer));`;
        
                db.none(query, {
                    id_poll: req.params.poll_id,
                    id_user: req.user.id,
                    answer: req.body.answer
                }).then(() => {
                    res.status(201).send('Sucessfully added poll answer.');
                }).catch(error => {
                        res.status(500).json('Error adding asnwer.');
                });
            }

        }).catch(error => {
            res.status(500).json('Answer does not exist in this poll.');
        });

    }).catch(error => {
        res.status(403).json('User has Voted');
    });

});


module.exports = router;
