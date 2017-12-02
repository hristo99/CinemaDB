var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', (req, res) => {
	res.render('index');
});
module.exports = router;