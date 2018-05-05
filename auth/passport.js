const passport = require('passport');
const db = require('../config/database');

module.exports = () => {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        const query = 'SELECT * FROM user WHERE id = $(id)';

        db.one(query, { id })
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
};

