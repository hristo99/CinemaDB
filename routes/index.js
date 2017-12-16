var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', (req, res) => {
	req.db.query(`SELECT * FROM Movies`).then(movies => {
		res.render('index', { movies });
	}).catch(error => {
		throw error;
	});
});
module.exports = router;