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


module.exports.scheduleJobPoll = (pollId, date) => {
    job = schedule.scheduleJob(date, function() {
        updatePollState(pollId);
    });

    function updatePollState(pollId) {
        query =
            `UPDATE polls
            SET closed = true
            WHERE id = $(poll_id);`;
        
        db.none(query, {
            poll_id: pollId
        }).then(() => {
            console.log("Cronjob successfully updated the poll state.")
        }).catch(error => {
            console.error("Error: Cronjob couldn't update the poll state.")
            console.error(error);
        })
       
    }
};

module.exports.scheduleCrowdfundingJob = (crowdfundingId) => {

    var rule = new schedule.RecurrenceRule();
    rule.second = new schedule.Range(0, 59, 10);

    schedule.scheduleJob(rule, function(){
        updateCrowdfundingState(crowdfundingId);
    });


    async function updateCrowdfundingState(crowdfundingId){

        var promise3;

        let query3 =
        `SELECT status
        FROM crowdfunding
        WHERE id = $(crowdfunding_id);`;
        
        try {
            promise3 = await db.one(query3, {
                crowdfunding_id: crowdfundingId
            });
        } catch (error){
            console.log(error);
        }


        if (promise3['status'] == 'RECRUITING'){

            query =
            `SELECT SUM(mygrant_value) as total_mv
            FROM service, service_instance
            WHERE service.id = service_instance.service_id
            AND service.crowdfunding_id=$(crowdfundingId);`;

            var promise1;

            try {
                promise1 = await db.manyOrNone(query, {
                    crowdfundingId: crowdfundingId
                });
            } catch (error){
                console.log(error);
            }

            var total_mv = parseInt(promise1[0]['total_mv']);

            query2 =
            `SELECT mygrant_target as mv_target
            FROM crowdfunding
            WHERE id =$(crowdfundingId);`;

            var promise2;

            try {
                promise2 = await db.manyOrNone(query2, {
                    crowdfundingId: crowdfundingId,
                });
            } catch (error){
                console.log(error);
            }
            
            console.log(promise2);
            var mv_target = promise2[0]['mv_target'];

            if (total_mv >= mv_target){

                query4 =
                    `UPDATE crowdfunding
                    SET status = 'COLLECTING'
                    WHERE id = $(crowdfunding_id);`;
                
                db.none(query4, {
                    crowdfunding_id: crowdfundingId
                }).then(() => {
                    console.log("Cronjob successfully updated the crowdfunding state.")
                }).catch(error => {
                    console.error("Error: Cronjob couldn't update the crowdfunding state.")
                    console.error(error);
                })
            
            }

        }
    }

}