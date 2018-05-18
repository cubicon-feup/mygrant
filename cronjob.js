var schedule = require('node-schedule');
var db = require('./config/database');

module.exports.scheduleJob = (crowdfundingId, date) => {
    job = schedule.scheduleJob(date, function() {
        right = closeCrowdfunding(crowdfundingId);
    });

    function closeCrowdfunding(crowdfundingId) {
        // TODO: if the project didn't get all the mygrants needed, go immediatly for 'FINISHED'.

        let query =
            `UPDATE crowdfunding
            SET status = 'RECRUITING'
            WHERE id = $(crowdfunding_id);`;
        
        db.none(query, {
            crowdfunding_id: crowdfundingId
        }).then(() => {
            return true;
        }).catch(error => {
            return false;
        });
    }
};