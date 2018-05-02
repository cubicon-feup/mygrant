// https://vitaly-t.github.io/pg-promise/Database.html

const dbConfig = require('./config');
const pgp = require('pg-promise')(/* options */);

const db = pgp(dbConfig);

module.exports = db;

