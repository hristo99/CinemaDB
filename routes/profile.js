var express = require('express');
var router = express.Router();
var securityCheck = require('./../modules/securityCheck.js');
var age = require('./../modules/age.js');
var bcrypt = require('bcrypt-nodejs');

router.get('/',  securityCheck.isLoggedIn, (req, res) => {
    let userAge = age.calculate(req.user.DateOfBirth);
    res.render('profile', {
        user : req.user,
        userAge: userAge
    });
});

router.get('/settings', securityCheck.isLoggedIn, (req, res) => {
    res.render('profileSettings', {user:req.user});
});

router.post('/settings', securityCheck.isLoggedIn, (req, res) => {
    let db = req.db;
    db.query("SELECT * FROM Users WHERE Id = ?;", [req.user.Id]).then(result => {
        if (result.length == 0) {
            res.status(204).send('No user found');
        } else {
            let username = (req.body.userName.length) ?
                req.body.userName : result[0].userName
            let password = (req.body.password.length) ?
                bcrypt.hashSync(req.body.password, null, null) : result[0].Password;
            let firstName = (req.body.firstName.length) ?
                req.body.firstName : result[0].FirstName;
            let lastName = (req.body.lastName.length) ?
                req.body.lastName : result[0].LastName;
            let dateOfBirth = (req.body.dateOfBirth) ?
                req.body.dateOfBirth : result[0].DateOfBirth;

            let profilePic = (req.files.length) ?
                `/uploads/${req.files[0].filename}` : result[0].ProfilePic;

            let updateUser = `UPDATE Users SET
                Username = ?, Password = ?, FirstName = ?,
                LastName = ?, DateOfBirth = ?, ProfilePic = ?
                WHERE Id = ?;`;
            db.query(updateUser,
                [username, password, firstName, lastName, dateOfBirth, profilePic, req.user.Id]).then(() => {
                res.status(201).redirect('/profile');
            });
        }
    }).catch(error => {
        throw error;
    });
});

router.get('/delete', securityCheck.isLoggedIn, (req, res) => {
    let db = req.db;
    let id = req.user.Id;
    req.logout();
    let deleteUser = `DELETE FROM Users WHERE Id = ?;`;
    db.query(deleteUser, [id]).then(() => {
        res.status(200).redirect('/');
    }).catch(error => {
        throw error;
    });
});

module.exports = router;