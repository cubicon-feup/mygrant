// https://vitaly-t.github.io/pg-promise/Database.html

const config = {
    host: 'localhost',
    port: 5432,
    database: 'mygrant_test',
    user: 'postgres',
    password: 'postgres'
};

var pgp = require('pg-promise')(/* options */);



var db = pgp(config);





module.exports = db;
