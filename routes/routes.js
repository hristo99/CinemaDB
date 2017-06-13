var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, passport) {

	app.get('/', (req, res, next) => {
		var db = req.db; 
	  	db.query("SELECT * FROM Movies ORDER BY FirstProjection DESC LIMIT 10;", (err, results, fields) => {
	    	if (err) {
		        res.send("errordatabase");
		    } else if (results.length == 0) {
		    	res.send("No movies");
		    } else {
		    	res.render("index", {movies:results});
		    }
	  	});
	});

	app.get('/login', (req, res) => {
		res.render('login.pug', { message: req.flash('loginMessage') });
	});

	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile',
            failureRedirect : '/login',
            failureFlash : true
		}),
        (req, res) => {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	app.get('/signup', (req, res) => {
		res.render('signup.pug', { message: req.flash('signupMessage') });
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile.pug', {
			user : req.user
		});
	});

	app.get('/profile/settings', isLoggedIn, (req, res) => {
		res.render('profileSettings.pug');
	});

	app.post('/profile/settings', isLoggedIn, (req, res) => {
		var db = req.db;
		db.query(
			"SELECT * FROM Users WHERE Username = ?;", 
			[req.user.Username],
			(err, result) => {
				if (err) {
					throw err;
				} else if (result.length == 0) {
					res.send("No user found!");
				} else {
					var password = (req.body.password.length) ?
						bcrypt.hashSync(req.body.password, null, null) : result[0].Password;  
					var firstName = (req.body.firstName.length) ?
						req.body.firstName : result[0].FirstName;
					var lastName = (req.body.lastName.length) ?
						req.body.lastName : result[0].LastName;
					var age = (req.body.age) ?
						req.body.age : result[0].Age;
					
					var newUserSettings = {
						Username: req.user.Username,
						Password: password,
						FirstName: firstName,
						LastName: lastName,
						Age: age
					};
					var updateUser = `UPDATE Users SET
						Password = ?, FirstName = ?, LastName = ?, Age = ?
						WHERE Username = ?;`;
					db.query(
						updateUser,
						[
							newUserSettings.Password, 
							newUserSettings.FirstName,
							newUserSettings.LastName,
							newUserSettings.Age,
							newUserSettings.Username
						],
						(err, result) => {
							if (err) {
								throw err;
							} else {
								res.send("You've successfully changed your profile settings!");
							}
						}
					);
				}
			}
		);
	});

	app.get('/users', isAdmin, (req, res, next) => {
	  var db = req.db; 
	  db.query("SELECT * FROM Users;", (err, results, fields) => {
	    if (err) {
	        res.send("errordatabase");
	    } else{
	        res.render("user", { title: "List of All Users",
	                             users:results});
	    }
	  })
	});

	app.get('/movies', (req, res, next) => {
		var db = req.db;
		var getAllMovies = "SELECT * FROM Movies";
		db.query(getAllMovies, (err, results, fields) => {
		    if (err) {
		        res.send("errordatabase");
		    } else if (results.length == 0) {
		    	console.log(results);
			    res.send("No data");
			} else {
		        res.render("movies", {movies:results});
		    }
		})
	});

	app.get('/movies/hottest', (req, res, next) => {
	  var db = req.db;
	  var getHottestMovies = `SELECT Movies.Title, COUNT(Movies.Title) AS Views FROM Movies
		INNER JOIN Projections ON Movies.Id = Projections.MovieId
		INNER JOIN ProjectionViewers ON Projections.Id = ProjectionViewers.ProjectionId
		GROUP BY Movies.Title ORDER BY Views DESC LIMIT 10;`;
	  db.query(getHottestMovies, (err, results, fields) => {
	    if (err) {
	        res.send("errordatabase");
	    } else if (results.length == 0) {
	    	console.log(results);
		    res.send("No data");
		} else {
	        res.render("hottestMovies", {movies:results});
	    }
	  })
	});

	app.get('/movies/add', isAdmin, (req, res) => {
		res.render('addMovie.pug');
	});

	app.post('/movies/add', isAdmin, (req, res, next) => {
		var db = req.db;
		var insertMovie = `INSERT INTO Movies
			(Title, AgeRestriction, FirstProjection, LastProjection, Length)
		VALUES
				(?, ?, ?, ?, ?);`;
		db.query(insertMovie, 
			[req.body.title, req.body.ageRes, req.body.firstPr, req.body.lastPr, req.body.length],
			(err, rows) => {
				if (err) {
					res.send("Insert movie error");
				}
				console.log("Inserted Movie!");
				res.send("Movie added");
			}
		);
	});

	app.get('/movies/:movieId', (req, res, next) => {
		var db = req.db;
		var getMovie = `SELECT p.MovieId, m.Title, m.FirstProjection, m.LastProjection,
			m.Length, m.AgeRestriction, p.Id, p.HallId, h.Seats, p.StartTime
			FROM Projections AS p
			LEFT JOIN Movies AS m
			ON m.Id = p.MovieId
			LEFT JOIN Halls AS h
			ON p.HallId = h.Id
			WHERE p.StartTime > NOW() AND m.Id = ${req.params.movieId};`;
		db.query(getMovie, (err, results, fields) => {
		    if (err) {
		        res.send("errordatabase");
		    } else if (results.length == 0) {
				if (req.user && req.user.Role != 'admin') {
					res.send("No data");
				}
				getMovie = `SELECT m.Id AS MovieId, m.Title, m.FirstProjection, m.LastProjection,
					m.Length, m.AgeRestriction FROM Movies AS m
					WHERE m.Id = ${req.params.movieId};`;
				db.query(getMovie, (err, results, fields) => {
					if (err) {
						res.send("errordatabase");
					} else if (results.length == 0) {
						res.send("No data");
					} else {
						res.render("movie", { movie:results, user:req.user });
					}
				});
			} else {
		        res.render("movie", { movie:results, user:req.user });
		    }
		});
	});

	app.get('/movies/:movieId/edit', isAdmin, (req, res) => {
		var db = req.db;
		var getMovie = "SELECT * FROM Movies WHERE Id = ?;";
		db.query(getMovie, [req.params.movieId], (err, results, fields) => {
			if (err) {
		        res.send("errordatabase");
		    } else if (results.length == 0) {
			    res.send("No data");
			} else {
				res.render('editMovie.pug', {movie:results});
			}
		});
	});

	app.post('/movies/:movieId/edit', isAdmin, (req, res, next) => {
		var db = req.db;
		db.query("SELECT * FROM Movies WHERE Id = ?;",
			[req.params.movieId],
			(err, result) => {
				if (err) {
					throw err;
				} else if (result.length == 0) {
					res.send("No Movie Found");
				} else {
					var title = (req.body.title.length) ?
						req.body.title : result[0].Title;
					var ageRes = (req.body.ageRes) ?
						req.body.ageRes : result[0].AgeRestriction;
					var firstPr = (req.body.firstPr.length) ?
						req.body.firstPr : result[0].FirstProjection;
					var lastPr = (req.body.lastPr.length) ? 
						req.body.lastPr : result[0].LastProjection;
					var length = (req.body.length) ?
						req.body.length : result[0].Length;

					var newMovieEdit = {
						Title : title,
						AgeRestriction : ageRes,
						FirstProjection : firstPr,
						LastProjection : lastPr,
						Length : length
					};
					var updateMovies = `UPDATE Movies SET
						Title = ?, AgeRestriction = ?, FirstProjection = ?,
						LastProjection = ?, Length = ?
						WHERE Id = ?;`;
					db.query(updateMovies,
						[
							newMovieEdit.Title,
							newMovieEdit.AgeRestriction,
							newMovieEdit.FirstProjection,
							newMovieEdit.LastProjection,
							newMovieEdit.Length,
							req.params.movieId
						],
						(err, result) => {
							if (err) {
								throw err;
							} else {
								res.send("Successfully updated movie");
							}
						}
					);
				}
			}
		);
	});

	app.get('/movies/:movieId/remove', isAdmin, (req, res, next) => {
		var db = req.db;
		var deleteMovie = "DELETE FROM Movies WHERE Movies.Id = ?;";
		db.query(deleteMovie, [req.params.movieId], (err, rows) => {
			if (err) {
				throw err;
			} else if (rows.length) {
				res.send("Qakata rabota");
			} else {
				res.send("Movie deleted");
			}
		});
	});

	app.get('/movies/:movieId/addProjection', isAdmin, (req, res) => {
		res.render('addProjection.pug', { movieId: req.params.movieId});
	});

	app.post('/movies/:movieId/addProjection', isAdmin, (req, res) => {
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
			(err, rows) => {
				if (err) {
					console.log(err);
					res.send("Insert projection error!");
				}
				console.log("Inserted projection!");
				res.send("Projection added!");
			}
		);
	});

	app.get('/boughtTickets', isLoggedIn, (req, res, next) => {
		var db = req.db;
		var getBoughtTickets = `SELECT Projections.Id, Movies.Title, Movies.Length, Projections.StartTime, Projections.HallId
			FROM ProjectionViewers LEFT JOIN Projections
			ON ProjectionViewers.ProjectionId = Projections.Id
			LEFT JOIN Movies ON Projections.MovieId = Movies.Id
			WHERE ProjectionViewers.Username = ?`;
		db.query(getBoughtTickets, [req.user.Username], (err, results) => {
			if (err) {
				throw err;
			} else if (results.length == 0) {
				res.send("No data");
			} else {
				res.render("boughtTickets", {projections: results});
			}
		})
	});

	app.get('/projections/:projectionId/buyTicket', isLoggedIn, (req, res, next) => {
		var db = req.db;
		db.query("SELECT * FROM ProjectionViewers WHERE ProjectionId = ? AND Username = ?", 
			[req.params.projectionId, req.user.Username], 
			(err, rows) => {
				if (err) {
					throw err;
				} else if (rows.length) {
					res.send("You've already bought ticket for this projection!");
				} else {
					var insertProjectionViewer = `INSERT INTO ProjectionViewers
						(ProjectionId, Username)
					VALUES
						(?, ?)`;
					db.query(
						insertProjectionViewer,
						[req.params.projectionId, req.user.Username],
						(err, rows) => {
							if (err) {
								console.log("Insert projection viewer error!");
								console.log(err);
								throw err;
							}
							console.log("Inserted Projection Viewer!");
							res.send("You've successfully bought a ticket!");
						}
					);
				}
		});
	});

	app.get('/projections/:projectionId/returnTicket', isLoggedIn, (req, res, next) => {
		var db = req.db;
		db.query("SELECT * FROM ProjectionViewers WHERE ProjectionId = ? AND Username = ?", 
			[req.params.projectionId, req.user.Username], 
			(err, rows) => {
				if (err) {
					throw err;
				} else if (rows.length == 0) {
					res.send("You are not registered for this projection!");
				} else {
					var removeProjectionViewer = `DELETE FROM ProjectionViewers
						WHERE ProjectionId = ? AND Username = ?`;
					db.query(
						removeProjectionViewer,
						[req.params.projectionId, req.user.Username],
						(err, rows) => {
							if (err) {
								console.log("Remove projection viewer error!");
								console.log(err);
								throw err;
							}
							console.log("Successfully removed Projection Viewer!");
							res.send("You've successfully returned a ticket!");
						}
					);
				}
			}
		);
	});

	app.get('/projections/:projectionId/edit', isAdmin, (req, res) => {
		res.render('editProjection.pug', { projectionId: req.params.projectionId});
	});
	
	app.post('/projections/:projectionId/edit', isAdmin, (req, res, next) => {
		var db = req.db;
		db.query("SELECT * FROM Projections WHERE Id = ?;",
			[req.params.projectionId],
			(err, result) => {
				if (err) {
					throw err;
				} else if (result.length == 0) {
					res.send("No Projection Found");
				} else {
					var movieId = (req.body.movieId) ?
						req.body.movieId : result[0].MovieId;
					var hallId = (req.body.hallId) ?
						req.body.hallId : result[0].HallId;
					var startTime = (req.body.startTime.length) ?
						req.body.startTime : result[0].StartTime;

					var newProjectionEdit = {
						MovieId : movieId,
						HallId : hallId,
						StartTime : startTime
					};
					var updateProjections = `UPDATE Projections SET
						MovieId = ?, HallId = ?, StartTime = ?
						WHERE Id = ?;`;
					db.query(
						updateProjections,
						[
							newProjectionEdit.MovieId,
							newProjectionEdit.HallId,
							newProjectionEdit.StartTime,
							req.params.projectionId
						],
						(err, result) => {
							if (err) {
								throw err;
							} else {
								res.send("Successfully updated projection");
							}
						}
					);
				}
			}
		);
	});

	app.get('/projections/:projectionId/remove', isAdmin, (req, res, next) => {
		var db = req.db;
		db.query("SELECT * FROM Projections WHERE Id = ?;", 
			[req.params.projectionId], 
			(err, rows) => {
				if (err) {
					throw err;
				} else if (rows.length == 0) {
					res.send("Invalid projection!");
				} else {
					var removeProjection = `DELETE FROM Projections
						WHERE Id = ?;`;
					db.query(
						removeProjection,
						[req.params.projectionId],
						(err, rows) => {
							if (err) {
								console.log("Remove projection error!");
								console.log(err);
								throw err;
							}
							console.log("Successfully removed Projection!");
							res.send("You've successfully removed a projection!");
						}
					);
				}
			}
		);
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

function isAdmin(req, res, next) {
	if (req.user.Role == 'admin') {
		return next();
	}
	res.redirect('/');
}