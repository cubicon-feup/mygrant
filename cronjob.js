var schedule = require('node-schedule');
var db = require('./config/database');

module.exports.scheduleJob = (crowdfundingId, date) => {
    job = schedule.scheduleJob(date, function() {
        updateCrowdfundingState(crowdfundingId);
    });

    function updateCrowdfundingState(crowdfundingId) {
        let query =
			`UPDATE crowdfunding
			SET status = 'FINISHED'
			WHERE id = $(crowdfunding_id);`;
		
		db.none(query, {
			crowdfunding_id: crowdfundingId
		}).then(() => {
			res.sendStatus(200);
		}).catch(error => {
			res.status(500).json({error});
		})
    }
};