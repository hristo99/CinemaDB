var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var express = require('express');
var session  = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Database
var db = mysql.createConnection({
  host : 'localhost',
  user: 'cinemaAdmin',
  password: 'cinema_Pass123'
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  db.query("DROP DATABASE IF EXISTS cinemaDB;", function (err, result) {
    if (err) throw err;
    console.log("No database");
  });

  db.query("CREATE DATABASE cinemaDB CHARACTER SET utf8;", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });

  db.query("USE cinemaDB;", function (err, result) {
    if (err) throw err;
    console.log("Using cinemaDB");
  });

  var createTableUsers = "CREATE TABLE Users ( \
    Username VARCHAR(15) NOT NULL PRIMARY KEY,\
    Password VARCHAR(60) NOT NULL,\
    FirstName VARCHAR(30) NOT NULL,\
    LastName VARCHAR(30) NOT NULL,\
    Age INTEGER NOT NULL,\
    Role VARCHAR(20) NOT NULL\
    );";
  db.query(createTableUsers, function (err, result) {
    if (err) throw err;
    console.log("Created Users table");
  });

  var createTableMovies = "CREATE TABLE Movies (\
    Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,\
    Title VARCHAR(100) NOT NULL,\
    AgeRestriction INTEGER NOT NULL,\
    FirstProjection DATETIME NOT NULL,\
    LastProjection DATETIME NOT NULL,\
    Length INTEGER NOT NULL\
    );";
  db.query(createTableMovies, function (err, result) {
    if (err) throw err;
    console.log("Created Movies table");
  });
  
  var createTableHalls = "CREATE TABLE Halls (\
    Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,\
    Seats INTEGER NOT NULL\
    );";
  db.query(createTableHalls, function (err, result) {
    if (err) throw err;
    console.log("Created Halls table");
  });

  var createTableProjections = "CREATE TABLE Projections (\
    Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,\
    MovieId INTEGER NOT NULL,\
    HallId INTEGER NOT NULL,\
    StartTime DATETIME NOT NULL,\
    FOREIGN KEY(MovieId) REFERENCES Movies(Id) ON DELETE CASCADE,\
    FOREIGN KEY(HallId) REFERENCES Halls(Id)\
    );";
  db.query(createTableProjections, function (err, result) {
    if (err) throw err;
    console.log("Created Projections table");
  });

  var createTableProjectionViewers = "CREATE TABLE ProjectionViewers (\
    Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,\
    ProjectionId INTEGER NOT NULL,\
    Username VARCHAR(15) NOT NULL,\
    FOREIGN KEY(ProjectionId) REFERENCES Projections(Id) ON DELETE CASCADE,\
    FOREIGN KEY(Username) REFERENCES Users(Username)\
    );";
  db.query(createTableProjectionViewers, function (err, result) {
    if (err) throw err;
    console.log("Created ProjectionViewers table");
  });
  var testpass = bcrypt.hashSync('test', null, null);
  var test2pass = bcrypt.hashSync('test2', null, null);
  var hspasovpass = bcrypt.hashSync('1234567890', null , null);
  var radito3pass = bcrypt.hashSync('0987654321', null, null);
  var santapass = bcrypt.hashSync('northpole', null, null);
  var dontpass = bcrypt.hashSync('123456', null, null);
  var adminPass = bcrypt.hashSync('adminPass', null, null);
  var insertUsers = "INSERT INTO Users \
  	(Username, Password, FirstName, LastName, Age, Role)\
    VALUES\
    ( 'test', '" + testpass + "', 'Testing', 'Tester', 20, 'user' ),\
    ( 'test2', '" + test2pass + "', 'Another', 'Tester', 20, 'user' ),\
    ( 'hspasov', '" + hspasovpass + "', 'Hristo', 'Spasov', 17, 'user' ),\
    ( 'radito3', '" + radito3pass + "', 'Rangel', 'Ivanov', 17, 'user' ),\
    ( 'santa', '" + santapass + "', 'Santa', 'Claus', 200, 'user' ),\
    ( 'dont', '" + dontpass + "', 'Donald', 'Trump', 75, 'user' ),\
    ( 'admin', '" + adminPass + "', 'Kiril', 'Mitov', '30', 'admin');";
  db.query(insertUsers, function (err, result) {
    if (err) throw err;
    console.log("Inserted users");
  });

  var insertMovies = "INSERT INTO Movies \
    (Title, AgeRestriction, FirstProjection, LastProjection, Length)\
VALUES\
    ( 'Pirates of the Carribean', 18, '2017-04-04 08:30:00', '2017-05-20 19:20:00', 120 ),\
    ( 'Sample Movie Name', 0, '2017-06-01 09:45:00', '2017-07-30 21:00:00', 100 ),\
    ( 'Finding Dory', 0, '2016-07-21 08:00:00', '2016-09-20 21:00:00', 83 ),\
    ( 'The Changeling', 12, '2017-01-03 07:00:00', '2017-04-30 22:15:00', 141 ),\
    ( 'Black Swan', 16, '2016-10-05 11:40:00', '2016-12-01 23:10:00', 135 ),\
    ( 'Star Wars', 0, '2017-11-30 08:50:00', '2018-02-18 19:25:00', 152 ),\
    ( 'The Dictator', 12, '2015-09-04 12:30:00', '2015-12-28 21:45:00', 93 );";
    db.query(insertMovies, function (err, result) {
    	if (err) throw err;
    	console.log("Inserted movies");
    });

    var insertHalls = "INSERT INTO Halls\
    	(Seats)\
	VALUES\
	    (50),\
	    (84),\
	    (50),\
	    (148),\
	    (74);";
	db.query(insertHalls, function (err, result) {
    	if (err) throw err;
    	console.log("Inserted halls");
    });

    var insertProjections = "INSERT INTO Projections\
    	(MovieId, HallId, StartTime)\
	VALUES\
	    (1, 3, '2017-04-04 08:30:00'),\
	    (1, 3, '2017-04-04 15:30:00'),\
	    (1, 3, '2017-04-06 08:30:00'),\
	    (1, 3, '2017-04-06 15:30:00'),\
	    (1, 3, '2017-04-24 17:30:00'),\
	    (1, 3, '2017-05-16 08:30:00'),\
	    (1, 3, '2017-05-16 14:30:00'),\
	    (1, 3, '2017-05-20 09:30:00'),\
	    (1, 3, '2017-05-20 19:20:00'),\
	    (2, 2, '2017-06-01 09:45:00'),\
	    (2, 2, '2017-06-02 09:45:00'),\
	    (2, 3, '2017-06-03 12:40:00'),\
	    (2, 3, '2017-06-10 12:40:00'),\
	    (2, 3, '2017-06-17 12:40:00'),\
	    (2, 3, '2017-06-30 12:40:00'),\
	    (2, 3, '2017-07-15 12:40:00'),\
	    (2, 3, '2017-07-30 21:00:00'),\
	    (3, 4, '2016-07-21 08:00:00'),\
	    (3, 2, '2016-07-21 08:00:00'),\
	    (3, 4, '2016-07-21 12:00:00'),\
	    (3, 2, '2016-07-21 12:00:00'),\
	    (3, 4, '2016-07-21 16:00:00'),\
	    (3, 2, '2016-07-21 16:00:00'),\
	    (3, 4, '2016-07-22 17:00:00'),\
	    (3, 4, '2016-07-23 12:00:00'),\
	    (3, 4, '2016-07-25 12:00:00'),\
	    (3, 4, '2016-08-01 16:00:00'),\
	    (3, 4, '2016-08-10 16:00:00'),\
	    (3, 1, '2016-08-15 13:00:00'),\
	    (3, 1, '2016-09-20 21:00:00'),\
	    (4, 3, '2017-01-03 07:00:00'),\
	    (4, 3, '2017-01-10 17:00:00'),\
	    (4, 3, '2017-01-17 17:00:00'),\
	    (4, 3, '2017-01-31 17:00:00'),\
	    (4, 3, '2017-02-14 22:15:00'),\
	    (4, 3, '2017-02-28 22:15:00'),\
	    (4, 3, '2017-03-13 22:15:00'),\
	    (4, 3, '2017-04-30 22:15:00'),\
	    (6, 5, '2017-11-30 08:50:00'),\
	    (6, 5, '2017-11-30 11:50:00'),\
	    (6, 5, '2017-12-10 11:50:00'),\
	    (6, 5, '2017-12-20 11:50:00'),\
	    (6, 5, '2017-01-01 03:00:00'),\
	    (6, 5, '2017-01-07 11:50:00'),\
	    (6, 5, '2017-02-10 19:00:00'),\
	    (6, 5, '2018-02-18 19:25:00'),\
	    (7, 2, '2015-09-04 12:30:00'),\
	    (7, 2, '2015-10-04 17:30:00'),\
	    (7, 2, '2015-11-04 17:30:00'),\
	    (7, 2, '2015-12-28 21:45:00');";
	db.query(insertProjections, function (err, result) {
    	if (err) throw err;
    	console.log("Inserted Projections");
    });

    var insertProjectionViewers = "INSERT INTO ProjectionViewers\
    	(ProjectionId, Username)\
	VALUES\
	    (46, 'test'),\
	    (47, 'test'),\
	    (48, 'test2'),\
	    (48, 'test'),\
	    (49, 'hspasov'),\
	    (49, 'radito3'),\
	    (49, 'santa'),\
	    (1, 'dont'),\
	    (2, 'hspasov'),\
	    (3, 'radito3'),\
	    (3, 'santa'),\
	    (5, 'test'),\
	    (5, 'test2'),\
	    (5, 'hspasov'),\
	    (5, 'radito3'),\
	    (5, 'dont'),\
	    (5, 'santa'),\
	    (10, 'test'),\
	    (10, 'test2'),\
	    (15, 'dont'),\
	    (15, 'santa'),\
	    (15, 'test'),\
	    (31, 'hspasov'),\
	    (33, 'hspasov'),\
	    (38, 'hspasov'),\
	    (18, 'hspasov'),\
	    (24, 'hspasov'),\
	    (18, 'radito3'),\
	    (45, 'radito3'),\
	    (40, 'radito3'),\
	    (26, 'radito3'),\
	    (31, 'radito3'),\
	    (19, 'radito3'),\
	    (20, 'radito3');";
	db.query(insertProjectionViewers, function (err, result) {
    	if (err) throw err;
    	console.log("Inserted ProjectionViewers");
    });
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'daimophilosophics',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./routes/routes.js')(app, passport);
require('./config/passport')(passport, db);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
