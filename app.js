var mysql = require('mysql');
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
    FOREIGN KEY(MovieId) REFERENCES Movies(Id),\
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
    FOREIGN KEY(ProjectionId) REFERENCES Projections(Id),\
    FOREIGN KEY(Username) REFERENCES Users(Username)\
    );";
  db.query(createTableProjectionViewers, function (err, result) {
    if (err) throw err;
    console.log("Created ProjectionViewers table");
  });

  var insertUsers = "INSERT INTO Users \
  	(Username, Password, FirstName, LastName, Age, Role)\
    VALUES\
    ( 'test', 'test', 'Testing', 'Tester', 20, 'user' ),\
    ( 'test2', 'test2', 'Another', 'Tester', 20, 'user' );";
  db.query(insertUsers, function (err, result) {
    if (err) throw err;
    console.log("Inserted users");
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
