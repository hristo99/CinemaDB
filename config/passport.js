var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

// expose this function to our app using module.exports
module.exports = function(passport, connection) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.Username);
    });

    // used to deserialize the user
    passport.deserializeUser(function(username, done) {
        connection.query("SELECT * FROM Users WHERE Username = ? ",[username], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // we are checking to see if the user trying to login already exists
            connection.query("SELECT * FROM Users WHERE Username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        Username: username,
                        Password: bcrypt.hashSync(password, null, null),  // use the generateHash function in our user model
                        FirstName: req.param('firstName'),
                        LastName: req.param('lastName'),
                        Age: req.param('age'),
                        Role: 'user'
                    };

                    var insertQuery = "INSERT INTO Users ( Username, Password, FirstName, LastName, Age, Role ) values (?,?,?,?,?,?)";

                    connection.query(
                        insertQuery,
                        [newUserMysql.Username, newUserMysql.Password, newUserMysql.FirstName, newUserMysql.LastName, newUserMysql.Age, newUserMysql.Role],
                        function(err, rows) {
                            return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            connection.query("SELECT * FROM Users WHERE Username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].Password)) 
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
};
