const Joi = require('joi');
const config = require('../config/config');

module.exports = {
    valid(req, res, next) {
        const schema = {
            title: Joi.string().regex(
                new RegExp(config.regex.line)
            ).required(),
            description: Joi.string().regex(
                new RegExp(config.regex.line)
            ).required(),
            category: Joi.string().required(),
            location: Joi.string().regex(
                new RegExp(config.regex.line)
            ),
            //latitude: Joi.required(),
            //longitude: Joi.required(),
            mygrant_target: Joi.number().min(1).required(),
            time_interval: Joi.number().min(1).required(),
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid crowdfunding data.'});
        else next();
    },

    edit(req, res, next) {
        const schema = {
            title: Joi.string().regex(
                new RegExp(config.regex.line)
            ).required(),
            description: Joi.string().regex(
                new RegExp(config.regex.line)
            ).required()
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid crowdfunding data.'});
        else next();
    },

    donate(req, res, next) {
        const schema = {
            amount: Joi.number().min(1).required()
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid donation data.'});
        else next();
    },

    rate(req, res, next) {
        const schema = {
            rating: Joi.number().min(config.rating.min).max(config.rating.max).required(),
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid rating data.'});
        else next();
    },

    serviceOffer(req, res, next) {
        const schema = {
            service_id: Joi.number().required()
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid service offer data.'});
        else next();
    },

    requestService(req, res, next) {
        const schema = {
            title: Joi.string().regex(
                new RegExp(config.regex.line)
            ).required(),
            description: Joi.string().regex(
                new RegExp(config.regex.line)
            ).required(),
            category: Joi.string().required(),
            location: Joi.string().regex(
                new RegExp(config.regex.line)
            ),
            mygrant_value: Joi.number().min(1).required(),
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid service request data.'});
        else next();
    },

    deleteRequestService(req, res, next) {
        const schema = {
            service_id: Joi.number().required()
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid service request data.'});
        else next();
    },

    serviceAccorded(req, res, next) {
        const schema = {
            service_id: Joi.number().min(1).required()
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid service accorded data.'});
        else next();
    },

    search(req, res, next) {
        const schema = {
            q: Joi.string(),
            page: Joi.number().integer().min(1),
            items: Joi.number().integer().min(10).max(100),
            order: Joi.string().alphanum(),
            asc: Joi.string(),
            lang: Joi.string(),
            desc: Joi.string(),
            cat: Joi.string(),
            balancemax: Joi.number().min(0),
            balancemin: Joi.number().min(0),
            targetmax: Joi.number().min(0),
            targetmin: Joi.number().min(0),
            datemax: Joi.date().timestamp(),
            datemin: Joi.date().timestamp(),
            distmax: Joi.number().min(0),
            status: Joi.string(),
        }

        const {error} = Joi.validate(req.params, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid search data.'});
        else next();
    }
}
