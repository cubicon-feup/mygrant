// https://vitaly-t.github.io/pg-promise/Database.html

const config = {
    host: 'localhost',
    port: 5432,
    database: 'mygrant',
    user: 'postgres',
    password: 'mygrant'
};

var pgp = require('pg-promise')(/* options */);
var db = pgp(config);

module.exports = db
