var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, passport) {

	app.get('/', function(req, res, next) {
		var db = req.db; 
	  	db.query("SELECT * FROM Movies ORDER BY FirstProjection DESC LIMIT 10;", function(err, results, fields) {
	    	if (err) {
		        res.send("errordatabase");
		    } else if (results.length == 0) {
		    	res.send("No movies");
		    } else {
		    	res.render("index", {movies:results});
		    }
	  	});
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.pug', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.pug', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =====================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.pug', {
			user : req.user,
			userRole : req.user.Role
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/users', function(req, res, next) {
	  var db = req.db; 
	  db.query("SELECT * FROM Users;", function(err, results, fields) {
	    if (err) {
	        res.send("errordatabase");
	    } else{
	        res.render("user", { title: "List of All Users",
	                             users:results});
	    }
	  })
	});

	app.get('/hottestMovies', function(req, res, next) {
	  var db = req.db;
	  var getHottestMovies = "SELECT Movies.Title, COUNT(Movies.Title) AS Views FROM Movies\
		INNER JOIN Projections ON Movies.Id = Projections.MovieId\
		INNER JOIN ProjectionViewers ON Projections.Id = ProjectionViewers.ProjectionId\
		GROUP BY Movies.Title ORDER BY Views DESC LIMIT 10;";
	  db.query(getHottestMovies, function(err, results, fields) {
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

	app.get('/movies', function(req, res, next) {
		var db = req.db;
		var getAllMovies = "SELECT * FROM Movies";
		db.query(getAllMovies, function(err, results, fields) {
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

	app.get('/movie/:movieId', function(req, res, next) {
		var db = req.db;
		var getMovie = "SELECT p.MovieId, m.Title, m.FirstProjection, m.LastProjection,\
			m.Length, m.AgeRestriction, p.Id, p.HallId, h.Seats, p.StartTime\
			FROM Projections AS p\
			LEFT JOIN Movies AS m\
			ON m.Id = p.MovieId\
			LEFT JOIN Halls AS h\
			ON p.HallId = h.Id\
			WHERE p.StartTime > NOW() AND m.Id = " + req.params.movieId + ";";
		db.query(getMovie, function(err, results, fields) {
		    if (err) {
		        res.send("errordatabase");
		    } else if (results.length == 0) {
			    res.send("No data");
			} else {
				//console.log(req.user.Role);
		        res.render("movie", { movie:results, user:req.user.Role });
		    }
		});
	});

	app.get('/addMovie', function(req, res) {
		res.render('addMovie.pug');
	});

	app.post('/addMovie', function(req, res, next) {
		var db = req.db;
		var insertMovie = "INSERT INTO Movies \
			(Title, AgeRestriction, FirstProjection, LastProjection, Length)\
		VALUES\
				(?, ?, NOW(), NOW(), ?)";
		console.log(req.body.title);
		console.log(req.body.ageRes);
		console.log(req.body.length);
		db.query(insertMovie, 
			[req.body.title, req.body.ageRes, req.body.length],
			function(err, rows) {
				if (err) {
					console.log("Insert movie error!");
					res.redirect('/profile'); //temporary
					//throw err;
				}
				console.log("Inserted Movie!");
				window.alert("Movie added");
				//res.send("Movie added");
				res.redirect('/profile');
			}
		);
	});

	app.get('/addProjection', function(req, res) {
		res.render('addProjection.pug');
	});

	app.post('/addProjection', function(req, res, next) {

	});

	app.get('/editMovie/:movieId', function(req, res) {
		var db = req.db;
		var getMovie = "SELECT * FROM Movies WHERE Movies.Id = ?;";
		db.query(getMovie, [req.params.movieId], function(err, results, fields) {
			if (err) {
		        res.send("errordatabase");
		    } else if (results.length == 0) {
			    res.send("No data");
			} else {
				res.render('editMovie.pug', {movie:results});
			}
		});
	});

	app.post('/editMovie/:movieId', function(req, res, next) {
		var db = req.db;
		//implement
	});

	app.get('deleteMovie/:movieId', function(req, res, next) {
		var db = req.db;
		var deleteMovie = "DELETE FROM Movies WHERE Movie.Id = ?;";
		db.query(deleteMovie, [req.params.movieId], function(err, rows){
			if (err) {
				throw err;
			} else if (rows.length) {
				res.send("Qakata rabota");
			} else {
				res.send("Movie deleted");
			}
			//res.redirect('/movies');
		});
	});

	app.get('/projection/:projectionId/buyTicket', function(req, res, next) {
		var db = req.db;
		db.query("SELECT * FROM ProjectionViewers WHERE ProjectionId = ? AND Username = ?", 
			[req.params.projectionId, req.user.Username], 
			function(err, rows) {
				if (err) {
					throw err;
				} else if (rows.length) {
					res.send("You've already bought ticket for this projection!");
				} else {
					// if there is no user for this projection
					// create the projection view
					var insertProjectionViewer = "INSERT INTO ProjectionViewers\
						(ProjectionId, Username)\
					VALUES\
						(?, ?)";
					db.query(
						insertProjectionViewer,
						[req.params.projectionId, req.user.Username],
						function(err, rows) {
							if (err) {
								console.log("Insert projection viewer error!");
								console.log(err);
								throw err;
							}
							console.log("Inserted Projection Viewer!");
							// $(location).attr('href', '/movies');
							res.send("You've successfully bought a ticket!");
						}
					);
				}
		});
	});

	app.get('/boughtTickets', function(req, res, next) {
		var db = req.db;
		var getBoughtTickets = "SELECT Projections.Id, Movies.Title, Movies.Length, Projections.StartTime, Projections.HallId\
			FROM ProjectionViewers LEFT JOIN Projections\
			ON ProjectionViewers.ProjectionId = Projections.Id\
			LEFT JOIN Movies ON Projections.MovieId = Movies.Id\
			WHERE ProjectionViewers.Username = ?";
		db.query(getBoughtTickets, [req.user.Username], function(err, results) {
			if (err) {
				throw err;
			} else if (results.length == 0) {
				res.send("No data");
			} else {
				res.render("boughtTickets", {projections: results});
			}
		})
	});

	app.get('/projection/:projectionId/returnTicket', function(req, res, next) {
		var db = req.db;
		db.query("SELECT * FROM ProjectionViewers WHERE ProjectionId = ? AND Username = ?", 
			[req.params.projectionId, req.user.Username], 
			function(err, rows) {
				if (err) {
					throw err;
				} else if (rows.length == 0) {
					res.send("You are not registered for this projection!");
				} else {
					// if user had bought ticket for this projection
					// return ticket
					var removeProjectionViewer = "DELETE FROM ProjectionViewers\
						WHERE ProjectionId = ? AND Username = ?";
					db.query(
						removeProjectionViewer,
						[req.params.projectionId, req.user.Username],
						function(err, rows) {
							if (err) {
								console.log("Remove projection viewer error!");
								console.log(err);
								throw err;
							}
							console.log("Successfully removed Projection Viewer!");
							// TODO REDIRECT
							res.send("You've successfully returned a ticket!");
						}
					);
				}
		});
	});

	app.get('/profileSettings', function(req, res) {
		res.render('profileSettings.pug');
	});

	app.post('/profileSettings', function(req, res) {
		var db = req.db;
		db.query(
			"SELECT * FROM Users WHERE Username = ?", 
			[req.user.Username],
			function(err, result) {
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
					var age = (req.body.age.length) ?
						req.body.age : result[0].Age;
					
					var newUserSettings = {
						Username: req.user.Username,
						Password: password,
						FirstName: firstName,
						LastName: lastName,
						Age: age
					};
					var updateUser = "UPDATE Users SET\
						Password = ?, FirstName = ?, LastName = ?, Age = ?\
						WHERE Username = ?";
					db.query(
						updateUser,
						[
							newUserSettings.Password, 
							newUserSettings.FirstName,
							newUserSettings.LastName,
							newUserSettings.Age,
							newUserSettings.Username
						],
						function(err, result) {
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
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
