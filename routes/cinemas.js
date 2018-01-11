var express = require('express');
var router = express.Router();
const { verify, isCinemaAdmin } = require('../modules/security');

router.get('/', verify(isCinemaAdmin), (req, res) => {
    req.db.query('SELECT * FROM Cinemas;').done((result) => {
        res.render('cinemas', { cinemas: result, user: req.user });
    });
});

module.exports = router;
