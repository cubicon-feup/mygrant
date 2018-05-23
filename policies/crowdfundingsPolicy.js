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
            latitude: Joi.number().min(-90.0).max(90.0),
            longitude: Joi.number().min(-180.0).max(180.0),
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
            from: Joi.number().min(1).required().less(parseInt(req.params.to)),
            to: Joi.number().min(2).required(),
            sorting_method: Joi.string(),
            category: Joi.string(),
            location: Joi.string(),
            keywords: Joi.string(),
            status: Joi.string()
        }

        const {error} = Joi.validate(req.params, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid search data.'});
        else next();
    },

    pagesNumber(req, res, next) {
        const schema = {
            from: Joi.number().min(1).required().less(parseInt(req.params.to)),
            to: Joi.number().min(2).required()
        }

        const {error} = Joi.validate(req.params, schema, config.joiOptions);

        if(error)
            res.status(400).send({error: 'Invalid pages number data.'});
        else next();
    }
}
