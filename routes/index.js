const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
	let hottestMovies = `SELECT Movies.Id, Movies.Title, Movies.Image, Movies.Description,
    COUNT(Movies.Title) AS Views FROM Movies
    INNER JOIN Projections ON Movies.Id = Projections.CinemaMovieId
    INNER JOIN ViewersGroups ON Projections.Id = ViewersGroups.ProjectionId
    GROUP BY Movies.Id, Movies.Title, Movies.Description ORDER BY Views DESC LIMIT 10;`;

	req.db.query(hottestMovies).then(result => {
		res.render('index', { movies: result });
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