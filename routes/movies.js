var express = require('express');
var router = express.Router();
var { verify, isLoggedIn, isMovieAdmin} = require('../modules/security');

router.get('/', verify(isLoggedIn), (req, res) => {
    let db = req.db;
    let moviesData = `SELECT * FROM Movies;`;

    db.query(moviesData).then(result => {
        res.render('movies', { movies: result, user: req.user });
    });
});

router.get('/add', verify(isLoggedIn, isMovieAdmin), (req, res) => {
    res.render('addMovie', { user: req.user });
});

router.post('/add', verify(isLoggedIn, isMovieAdmin), (req, res) => {
    let db = req.db;
    let insertMovie = `INSERT INTO Movies
        (Title, Image, AgeRestriction, Description, Language, Length, Trailer)
    VALUES
        (?, ?, ?, ?, ?, ?, ?);`;

    var image = (req.files.length) ?
        `/uploads/${req.files[0].filename}` : '/images/519539-085_Movie-512.png';
    db.query(insertMovie, 
        [
            req.body.title, 
            image,
            req.body.ageRes, 
            req.body.description, 
            req.body.language,
            req.body.length,
            req.body.trailer
        ]).then(result => {
            res.status(201).redirect('/movies');
        }).catch(error => {
            throw error;
        });
});

router.get('/:movieId', (req, res) => {
    let db = req.db;
    let cinemaId = 1; //temporary
    let movieData = `SELECT * FROM Movies
        RIGHT JOIN CinemaMovies AS cm
        ON cm.MovieId = Movies.Id
        WHERE Movies.Id = ? AND cm.CinemaId = ?;`;

    db.query(movieData, [req.params.movieId, cinemaId]).then(result => {
        res.render('movie', { movie: result[0], user: req.user });
    }).catch(error => {
        throw error;
    });

});

router.get('/:movieId/edit', (req, res) => {
    var db = req.db;
    var getMovie = "SELECT * FROM Movies WHERE Id = ?;";
    db.query(getMovie, [req.params.movieId]).then(result => {
        if (results.length == 0) {
            res.status(204).send('No movie found');
        } else {
            res.render('editMovie', { movie: result[0], user: req.user });
        }
    }).catch(error => {
        throw error;
    });
});

module.exports = router;