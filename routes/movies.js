var express = require('express');
var router = express.Router();

router.get('/', (req, res) => { //this is done in the index page right now
    let db = req.db;

    let moviesData = `SELECT * FROM Movies;`;

    db.query(moviesData).then(movies => {
        res.render('movies', { movies });
    });
});

router.get('/:movieId', (req, res) => {
    let db = req.db;
    let cinemaId = 1; //temporary

    let resultId = `SELECT MovieId 
        FROM CinemaMovies
        WHERE CinemaMovies.CinemaId = ? AND CinemaMovies.MovieId = ?;`;
    
    let movieData = `SELECT * FROM Movies
        WHERE Movies.Id = ?;`;

    db.query(resultId, [cinemaId, req.params.movieId]).then(id => {
        return db.query(movieData, [id]);
    }).then(movie => {
        res.render('movie', { movie });
    }).catch(err => {
        throw err;
    });
    
});

router.get('/:movieId/edit', (req, res) => {
    var db = req.db;
    var getMovie = "SELECT * FROM Movies WHERE Id = ?;";
    db.query(getMovie, [req.params.movieId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else if (results.length == 0) {
            res.status(204).send('No movie found');
        } else {
            res.render('editMovie', { movie:results[0], user:req.user });
        }
    });
});

module.exports = router;