var express = require('express');
var router = express.Router();
const { verify, isLoggedIn, isCinemaAdmin } = require('../modules/security');

router.get('/', verify(isLoggedIn, isCinemaAdmin), (req, res) => {
    req.db.query('SELECT * FROM Cinemas;').done((result) => {
        res.render('cinemas', { cinemas: result });
    });
});

module.exports = router;
