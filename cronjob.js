var schedule = require('node-schedule');
var db = require('./config/database');

module.exports.scheduleJob = (crowdfundingId, date) => {
    //var date = new Date(2018, 3, 26, 5, 46, 30);
    job = schedule.scheduleJob(date, function() {
        right = closeCrowdfunding(crowdfundingId);
    });

    function closeCrowdfunding(crowdfundingId) {
        console.log("ID: " + crowdfundingId);
        console.log("I'am here.");
        let query =
            `UPDATE crowdfunding
            SET title = 'cone'
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