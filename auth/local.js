const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const init = require('./passport');
const db = require('../config/database');

const options = {};

init();

passport.use(new LocalStrategy(options, (username, password, done) => {

    // Check if the user exists
    const query = 'SELECT * FROM users WHERE email = $(email)';
    db.one(query, { email: username })
        .then(user => {
            bcrypt.compare(password, user.pass_hash, function(err, result) {
                if (result) {
                    // Password matches
                    return done(null, user);
                }

                // Password doesn't match
                return done(err, false);
            });
        })
        .catch(() => done(false));
}));

module.exports = passport;

