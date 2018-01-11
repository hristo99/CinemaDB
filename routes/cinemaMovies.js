const express = require('express');
const router = express.Router({ mergeParams: true });
const { verify, isCinemaAdmin, isSystemAdmin } = require('../modules/security');

router.get('/', (req, res) => {
    const db = req.db;
    db.query(`SELECT Title, AgeRestriction, Length, Language, Movies.Description, Image, Trailer
        FROM Movies
        LEFT JOIN CinemaMovies
        ON Movies.Id=CinemaMovies.MovieId
        WHERE CinemaMovies.CinemaId=?;`,
    [req.params.cinemaId]).then(result => {
        res.send(result);
    }).catch(error => {
        console.log(error);
    });
});

router.post('/', verify(isCinemaAdmin), (req, res) => {
    const db = req.db;
    db.query(`SELECT * FROM Cinemas
        WHERE Id = ? AND Admin = ?`,
    [req.params.cinemaId, req.user.Id]).then(result => {
        if (result.length > 0) {
            return db.query(`INSERT INTO CinemaMovies
                (CinemaId, MovieId)
                VALUES (?, ?)`,
            [req.params.cinemaId, req.body.movieId]);
        } else {
            res.send("Not authorized");
        }
    }).then(response => {
        res.send("Success");
    }).catch(error => {
        console.log(error);
    });
});

router.delete('/:movieId', verify(isCinemaAdmin), (req, res) => {
    const db = req.db;
    db.query(`DELETE FROM CinemaMovies
        WHERE CinemaId = ? AND MovieId = ?;`,
    [req.params.cinemaId, req.params.movieId]).then(result => {
        console.log(result);
        res.send(result.length > 0 ? "Successfully deleted" : "Nothing to delete");
    }).catch(error => {
        console.log(error);
        res.end("Error");
    });
});

router.get('/:movieId', (req, res) => {
    const db = req.db;
    db.query(`SELECT MovieId
        FROM CinemaMovies
        WHERE CinemaMovies.CinemaId = ?
        AND CinemaMovies.MovieId = ?;`,
    [req.params.cinemaId, req.params.movieId]).then(result => {
        return db.query(`SELECT * FROM Movies WHERE Movies.Id = ?`, [result[0].MovieId]);
    }).then(result => {
        res.send(result[0]);
    }).catch(error => {
        console.log(error);
    });
});


module.exports = router;