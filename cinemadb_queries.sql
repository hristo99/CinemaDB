DROP DATABASE IF EXISTS cinemaDB;
CREATE DATABASE cinemaDB CHARACTER SET utf8;

USE cinemaDB;

CREATE TABLE Users (
	Username VARCHAR(15) NOT NULL PRIMARY KEY,
    Password VARCHAR(60) NOT NULL,
    FirstName VARCHAR(30) NOT NULL,
    LastName VARCHAR(30) NOT NULL,
    Age INTEGER NOT NULL,
    Role VARCHAR(20) NOT NULL
);

CREATE TABLE Movies (
	Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    AgeRestriction INTEGER NOT NULL,
    FirstProjection DATETIME NOT NULL,
    LastProjection DATETIME NOT NULL,
    Length INTEGER NOT NULL
);

CREATE TABLE Halls (
	Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    Seats INTEGER NOT NULL
);

CREATE TABLE Projections (
	Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    MovieId INTEGER NOT NULL,
    HallId INTEGER NOT NULL,
    StartTime DATETIME NOT NULL,
    FOREIGN KEY(MovieId) REFERENCES Movies(Id),
    FOREIGN KEY(HallId) REFERENCES Halls(Id)
);

CREATE TABLE ProjectionViewers (
	Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    ProjectionId INTEGER NOT NULL,
    Username VARCHAR(15) NOT NULL,
    FOREIGN KEY(ProjectionId) REFERENCES Projections(Id),
    FOREIGN KEY(Username) REFERENCES Users(Username)
);

INSERT INTO Users 
	(Username, Password, FirstName, LastName, Age, Role)
VALUES
	( 'test', 'test', 'Testing', 'Tester', 20, 'user' ),
    ( 'test2', 'test2', 'Another', 'Tester', 20, 'user' );
    
INSERT INTO Movies 
	(Title, AgeRestriction, FirstProjection, LastProjection, Length)
VALUES
	( 'Pirates of the Carribean', 18, '2017-04-04 08:30:00', '2017-05-20 19:20:00', 120 ),
	( 'The Dictator', 12, '2015-09-04 12:30:00', '2015-12-28 21:45:00', 93 );
