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
            location: Joi.string().regex(
                new RegExp(config.regex.line)
            ),
            mygrantTarget: Joi.number().required(),
            dateFinished: Joi.date().required(),
            creator_id: Joi.number().required()
        }

        const {error} = Joi.validate(req.body, schema, config.joiOptions);

        if(error) {
            res.status(400).send({error: 'Invalid public space data.'});
            console.log(error);
        }
        else next();
    }
}
