var express = require('express');
var router = express.Router();
var securityCheck = require('./../modules/securityCheck.js');

router.get('/', (req, res) => {
    var db = req.db;
    var getAllMovies = "SELECT * FROM Movies";
    db.query(getAllMovies, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else if (results.length == 0) {
            console.log(results);
            res.status(204).send('No movies found');
        } else {
            res.render('movies', {movies:results, user:req.user});
        }
    })
});

router.get('/hottest', (req, res) => {
    var db = req.db;
    var getHottestMovies = `SELECT Movies.Id, Movies.Title, 
    COUNT(Movies.Title) AS Views FROM Movies
    INNER JOIN Projections ON Movies.Id = Projections.MovieId
    INNER JOIN ProjectionViewers ON Projections.Id = ProjectionViewers.ProjectionId
    GROUP BY Movies.Id, Movies.Title ORDER BY Views DESC LIMIT 10;`;
    db.query(getHottestMovies, (err, results) => {
    if (err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
    } else if (results.length == 0) {
        console.log(results);
        res.status(204).send('No movies found');
    } else {
        res.render('hottestMovies', {movies:results, user:req.user});
    }
    })
});

router.get('/add', securityCheck.isAdmin, (req, res) => {
    res.render('addMovie', {user:req.user});
});

router.post('/add', securityCheck.isAdmin, (req, res) => {
    var db = req.db;
    var insertMovie = `INSERT INTO Movies
        (Title, AgeRestriction, Premiere, Length)
    VALUES
            (?, ?, ?, ?);`;
    db.query(insertMovie, 
        [req.body.title, req.body.ageRes, req.body.premiere, req.body.length],
        err => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            console.log("Inserted Movie!");
            res.status(201).send('Movie added');
        }
    );
});

router.get('/:movieId', (req, res) => {
    var db = req.db;
    var getMovie = `SELECT p.MovieId, m.Title, m.Premiere,
        m.Length, m.AgeRestriction, p.Id, p.HallId, h.Seats, p.StartTime
        FROM Projections AS p
        LEFT JOIN Movies AS m
        ON m.Id = p.MovieId
        LEFT JOIN Halls AS h
        ON p.HallId = h.Id
        WHERE p.StartTime > NOW() AND m.Id = ${req.params.movieId};`;
    db.query(getMovie, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else if (results.length == 0) {
            getMovie = `SELECT m.Id AS MovieId, m.Title, m.Premiere,
                m.Length, m.AgeRestriction FROM Movies AS m
                WHERE m.Id = ${req.params.movieId};`;
            db.query(getMovie, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else if (results.length == 0) {
                    res.status(204).send('No movie found');
                } else {
                    res.render('movie', { movie:results, user:req.user });
                }
            });
        } else {
            res.render('movie', { movie:results, user:req.user });
        }
    });
});

router.get('/:movieId/edit', securityCheck.isAdmin, (req, res) => {
    var db = req.db;
    var getMovie = "SELECT * FROM Movies WHERE Id = ?;";
    db.query(getMovie, [req.params.movieId], (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        } else if (results.length == 0) {
            res.status(204).send('No movie found');
        } else {
            res.render('editMovie', {movie:results[0], user:req.user});
        }
    });
});

router.post('/:movieId/edit', securityCheck.isAdmin, (req, res) => {
    var db = req.db;
    db.query("SELECT * FROM Movies WHERE Id = ?;",
        [req.params.movieId],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else if (result.length == 0) {
                res.status(204).send('No Movie Found');
            } else {
                var title = (req.body.title.length) ?
                    req.body.title : result[0].Title;
                var ageRes = (req.body.ageRes) ?
                    req.body.ageRes : result[0].AgeRestriction;
                var premiere = (req.body.premiere.length) ?
                    req.body.premiere : result[0].Premiere;
                var length = (req.body.length) ?
                    req.body.length : result[0].Length;
                var updateMovies = `UPDATE Movies SET
                    Title = ?, AgeRestriction = ?, Premiere = ?,
                     Length = ? WHERE Id = ?;`;
                db.query(updateMovies,
                    [
                        title,
                        ageRes,
                        premiere,
                        length,
                        req.params.movieId
                    ],
                    err => {
                        if (err) {
                            console.log(err);
                            rest.status(500).send('Internal Server Error');
                        } else {
                            res.status(201).send('Successfully updated movie');
                        }
                    }
                );
            }
        }
    );
});

router.get('/:movieId/remove', securityCheck.isAdmin, (req, res) => {
    var db = req.db;
    var getMovie = "SELECT * FROM Movies WHERE Id = ?;"
    db.query(
        getMovie,
        [req.params.movieId], 
        (err, rows) => {
        if (err) {
            console.log(err);
			res.status(500).send('Internal Server Error');
        } else if (rows.length == 0) {
            res.status(204).send('No projection found');
        } else {
            var removeMovie = "DELETE FROM Movies WHERE Id = ?;";
            db.query(
                removeMovie,
                [req.params.movieId],
                err => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    }
                    res.status(200).send('Successfuly removed Movie');
                }
            );
        }
    });
});

router.get('/:movieId/addProjection', securityCheck.isAdmin, (req, res) => {
    res.render('addProjection', { movieId: req.params.movieId, user:req.user});
});

router.post('/:movieId/addProjection', securityCheck.isAdmin, (req, res) => {
    var db = req.db;
    var insertProjection = `INSERT INTO Projections
        (MovieId, HallId, StartTime)
    VALUES
        (?, ?, ?);`;
    db.query(
        insertProjection,
        [
            req.params.movieId,
            req.body.hallId,
            req.body.startTime
        ],
        err => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            console.log("Inserted projection!");
            res.status(201).send('Projection added');
        }
    );
});

module.exports = router;