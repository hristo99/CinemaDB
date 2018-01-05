var express = require('express');
var router = express.Router();

router.get('/', (req, res) => { //this is done in the index page right now
    let db = req.db;
    let moviesData = `SELECT * FROM Movies;`;

    db.query(moviesData).then(result => {
        res.render('movies', { movies: result[0] });
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
        res.render('movie', { movie: result[0] });
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