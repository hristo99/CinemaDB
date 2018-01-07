const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');

module.exports = (passport, connection) => {

    function serializeUser(user, done) {
        done(null, user.Username);
    }

    function deserializeUser(username, done) {
        connection.query(`SELECT * FROM Users WHERE Username = ?;`, [username]).then(result => {
            done(null, result[0]);
        }).catch(error => {
            throw error;
        });
    }

    const localLogin = new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {
        connection.query("SELECT * FROM Users WHERE Username = ?;", [username]).then(result => {
            if (!result.length) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            }
            if (!bcrypt.compareSync(password, result[0].Password)) {
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            }
            return done(null, result[0]);
        }).catch(error => {
            return done(error);
        });
    });

    const localSignUp = new LocalStrategy({ passReqToCallback: true }, (req, username, password, done) => {        
        const insertQuery = `INSERT INTO Users
                            ( Username, Password, FirstName, LastName, DateOfBirth, ProfilePic, Role )
                        VALUES
                            (?,?,?,?,?,?,?);`;
        const newUser = {
            Username: username,
            Password: bcrypt.hashSync(password),
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            DateOfBirth: req.body.dateOfBirth,
            ProfilePic: '/images/No_picture_icon_2.jpg',
            Role: 'user'
        };
        connection.query(insertQuery,[
            newUser.Username,
            newUser.Password,
            newUser.FirstName,
            newUser.LastName,
            newUser.DateOfBirth,
            newUser.ProfilePic,
            newUser.Role
        ]).then(() => {
            done(null, newUser);
        }).catch(error => {
            console.log(error);
            done(error);
        });
    });

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    passport.use('local-login', localLogin);
    passport.use('local-signup', localSignUp);
};