var express = require('express');
var router = express.Router();

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

// router.get('/:movieId/edit', (req, res) => {

// });

module.exports = router;