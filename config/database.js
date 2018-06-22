// https://vitaly-t.github.io/pg-promise/Database.html
// https://vitaly-t.github.io/pg-promise/Database.html

const config = require('./config').dbConfig;
const pgp = require('pg-promise')(/* options */);

const db = pgp(config);

module.exports = db;