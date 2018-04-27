var schedule = require('node-schedule');

module.exports.scheduleJob = (date,query) => {
    db.none(query).then(() => {
        res.status(201).send('Sucessfully created a crowdfunding project.');
    }).catch(error => {
        res.status(500).json({error});
    });
};