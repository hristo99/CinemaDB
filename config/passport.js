var LocalStrategy   = require('passport-local').Strategy;
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport, connection) {

    passport.serializeUser((user, done) => {
        done(null, user.Username);
    });

    passport.deserializeUser((username, done) => {
        connection.query("SELECT * FROM Users WHERE Username = ? ",[username], (err, rows) => {
            done(err, rows[0]);
        });
    });

    passport.use(
        'local-signup',
        new LocalStrategy({
            passReqToCallback : true
        },
        (req, username, password, done) => {
            connection.query("SELECT * FROM Users WHERE Username = ?",[username], (err, rows) => {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    var newUserMysql = {
                        Username: username,
                        Password: bcrypt.hashSync(password, null, null),
                        FirstName: req.body.firstName,
                        LastName: req.body.lastName,
                        Age: req.body.age,
                        Role: 'user'
                    };

                    var insertQuery = "INSERT INTO Users ( Username, Password, FirstName, LastName, Age, Role ) values (?,?,?,?,?,?)";

                    connection.query(
                        insertQuery,
                        [newUserMysql.Username, newUserMysql.Password, newUserMysql.FirstName, newUserMysql.LastName, newUserMysql.Age, newUserMysql.Role],
                        (err, rows) => {
                            return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    passport.use(
        'local-login',
        new LocalStrategy({
            passReqToCallback : true
        },
        (req, username, password, done) => {
            connection.query("SELECT * FROM Users WHERE Username = ?",[username], (err, rows) => {
                if (err)
                    return done(err);
                if (!rows.length)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!bcrypt.compareSync(password, rows[0].Password)) 
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                return done(null, rows[0]);
            });
        })
    );
};
