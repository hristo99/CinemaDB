var express = require('express');
var router = express.Router();
var securityCheck = require('./../modules/securityCheck.js');
var bcrypt = require('bcrypt-nodejs');

router.get('/', securityCheck.isLoggedIn, (req, res) => {
    res.render('profile', {
        user : req.user
    });
});

router.get('/settings', securityCheck.isLoggedIn, (req, res) => {
    res.render('profileSettings');
});

router.post('/settings', securityCheck.isLoggedIn, (req, res) => {
    var db = req.db;
    db.query(
        "SELECT * FROM Users WHERE Username = ?;", 
        [req.user.Username],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else if (result.length == 0) {
                res.status(204).send('No user found');
            } else {
                var password = (req.body.password.length) ?
                    bcrypt.hashSync(req.body.password, null, null) : result[0].Password;  
                var firstName = (req.body.firstName.length) ?
                    req.body.firstName : result[0].FirstName;
                var lastName = (req.body.lastName.length) ?
                    req.body.lastName : result[0].LastName;
                var age = (req.body.age) ?
                    req.body.age : result[0].Age;
                
                var updateUser = `UPDATE Users SET
                    Password = ?, FirstName = ?, LastName = ?, Age = ?
                    WHERE Username = ?;`;
                db.query(
                    updateUser,
                    [
                        password, 
                        firstName,
                        lastName,
                        age,
                        req.user.Username
                    ],
                    err => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal Server Error');
                        } else {
                            res.status(201).send('Successfully changed your profile settings!');
                        }
                    }
                );
            }
        }
    );
});

module.exports = router;