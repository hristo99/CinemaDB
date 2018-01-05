const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
	console.log("wtf");
	req.db.query(`SELECT * FROM Movies`).then(movies => {
		res.render('index', { movies });
	}).catch(error => {
		throw error;
	});
});

router.get('/login', (req, res) => {
	res.render('login', { message: req.flash('loginMessage'), user: req.user });
});

router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile',
		failureRedirect : '/login',
		failureFlash : true
}),
	(req, res) => {
		if (req.body.remember) {
			req.session.cookie.maxAge = 1000 * 60 * 3;
		} else {
			req.session.cookie.expires = false;
		}
	res.redirect('/');
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

module.exports = router;