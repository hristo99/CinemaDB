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
			user : req.user // get the user out of session and pass to template
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
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
