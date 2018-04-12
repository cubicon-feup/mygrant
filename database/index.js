var config = {
	host: 'localhost',
	port: 5432,
	database: 'mygrant',
	user: 'postgres'
};
var pgp = require('pg-promise')(/* options */);
var db = pgp(config);

module.exports = db;