var schedule = require('node-schedule');
var db = require('./config/database');

module.exports.scheduleJob = (crowdfundingId, date) => {
    job = schedule.scheduleJob(date, function() {
        updateCrowdfundingState(crowdfundingId);
    });

    function updateCrowdfundingState(crowdfundingId) {
        let query =
            `SELECT mygrant_balance, mygrant_target
            FROM crowdfunding
            WHERE id = $(crowdfunding_id);`;
    
        db.one(query, {
            crowdfunding_id: crowdfundingId
        }).then(data => {
            let mygrantBalance = data.mygrant_balance;
            let mygrantTarget = data.mygrant_target
            let newStatus;
            if(mygrantBalance >= mygrantTarget)
                newStatus = 'RECRUITING';
            else newStatus = 'FINISHED';
            query =
                `UPDATE crowdfunding
                SET status = '${newStatus}'
                WHERE id = $(crowdfunding_id);`;
            
            db.none(query, {
                crowdfunding_id: crowdfundingId
            }).then(() => {
                console.log("Cronjob successfully updated the crowdfunding state.")
            }).catch(error => {
                console.error("Error: Cronjob couldn't update the crowdfunding state.")
                console.error(error);
            })
        })
    }
};