var schedule = require('node-schedule');

module.exports.scheduleJob = (someFunction,crowdfundingId,date) => {
    //var date = new Date(2018, 3, 26, 5, 46, 30);
     job = schedule.scheduleJob(date, function(){

        do{

        }while(!someFunction(cronfundingId));
    });

};