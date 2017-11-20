const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const dbconfig = require('../config/database');

const connection = mysql.createConnection({
  host : dbconfig.connection.host,
  user: dbconfig.connection.user,
  password: dbconfig.connection.password
});

connection.query(`DROP DATABASE IF EXISTS ${dbconfig.database};`, err => {
    if (err) throw err;
    console.log("No database");
});

connection.query(`CREATE DATABASE ${dbconfig.database} CHARACTER SET utf8;`, err => {
    if (err) throw err;
    console.log("Database created");
});

connection.query(`USE ${dbconfig.database};`, err => {
    if (err) throw err;
    console.log(`Using ${dbconfig.database}`);
});

const createTableUsers = `CREATE TABLE Users (
Id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
Username VARCHAR(30) NOT NULL,
Password VARCHAR(60) NOT NULL,
FirstName VARCHAR(30) NOT NULL,
LastName VARCHAR(30) NOT NULL,
DateOfBirth DATE NOT NULL,
ProfilePic VARCHAR(255) NOT NULL,
Role VARCHAR(20) NOT NULL
);`;
connection.query(createTableUsers, err => {
    if (err) throw err;
    console.log("Created Users table");
});

const createTableMovies = `CREATE TABLE Movies (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
Title VARCHAR(100) NOT NULL,
Image VARCHAR(255) NOT NULL,
AgeRestriction INTEGER NOT NULL,
Description VARCHAR(1000) NOT NULL,
Language VARCHAR(30) NOT NULL,
Length INTEGER NOT NULL,
Trailer VARCHAR(60)
);`;
connection.query(createTableMovies, err => {
    if (err) throw err;
    console.log("Created Movies table");
});

const createTableCountries = `CREATE TABLE Countries(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
Name VARCHAR(60) NOT NULL
);`;
connection.query(createTableCountries, err => {
    if (err) throw err;
    console.log("Created Countries table");
});

const createTableCities = `CREATE TABLE Cities(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
Name VARCHAR(100) NOT NULL,
CountryId INTEGER NOT NULL,
FOREIGN KEY(CountryId) REFERENCES Countries(Id)
);`;
connection.query(createTableCities, err => {
    if (err) throw err;
    console.log("Created Cities table");
});

const createTableCinemaAddresses = `CREATE TABLE CinemaAddresses(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
CityId INTEGER NOT NULL,
FullAddress VARCHAR(100),
FOREIGN KEY(CityId) REFERENCES Cities(Id)
);`;
connection.query(createTableCinemaAddresses, err => {
    if (err) throw err;
    console.log("Created CinemaAddresses table");
});

const createTableCinemas = `CREATE TABLE Cinemas (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
Name VARCHAR(30) NOT NULL,
AddressId INTEGER NOT NULL,
FOREIGN KEY(AddressId) REFERENCES CinemaAddresses(Id)
);`;
connection.query(createTableCinemas, err => {
    if (err) throw err;
    console.log("Created Cinemas table");
});

const createTableHalls = `CREATE TABLE Halls (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
CinemaId INTEGER NOT NULL,
Label VARCHAR(30) NOT NULL,
FOREIGN KEY(CinemaId) REFERENCES Cinemas(Id) ON DELETE CASCADE
);`;
connection.query(createTableHalls, err => {
    if (err) throw err;
    console.log("Created Halls table");
});

const createTablePriceCategories = `CREATE TABLE PriceCategories(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
Regular DECIMAL NOT NULL,
Reduced DECIMAL NOT NULL
);`;
connection.query(createTablePriceCategories, err => {
    if (err) throw err;
    console.log("Created PriceCategories table");
});

const createTableProjections = `CREATE TABLE Projections (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
MovieId INTEGER NOT NULL,
HallId INTEGER NOT NULL,
StartTime DATETIME NOT NULL,
VideoFormat VARCHAR(15),
Translation VARCHAR(15),
PriceCategoryId INTEGER,
FOREIGN KEY(MovieId) REFERENCES Movies(Id) ON DELETE CASCADE,
FOREIGN KEY(HallId) REFERENCES Halls(Id) ON DELETE CASCADE,
FOREIGN KEY(PriceCategoryId) REFERENCES PriceCategories(Id)
);`;
connection.query(createTableProjections, err => {
    if (err) throw err;
    console.log("Created Projections table");
});

const createTableViewersGroups = `CREATE TABLE ViewersGroups (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
ProjectionId INTEGER NOT NULL,
FOREIGN KEY(ProjectionId) REFERENCES Projections(Id) ON DELETE CASCADE
);`;
connection.query(createTableViewersGroups, err => {
    if (err) throw err;
    console.log("Created ViewersGroups table");
});

const createTableGenres = `CREATE TABLE Genres (
Id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
Name VARCHAR(30) NOT NULL,
Description VARCHAR(500)
);`;
connection.query(createTableGenres, err => {
    if (err) throw err;
    console.log("Created Genres table");
});

const createTableMovieGenres = `CREATE TABLE MovieGenres (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
MovieId INTEGER NOT NULL,
GenreId INTEGER NOT NULL,
FOREIGN KEY(GenreId) REFERENCES Genres(Id)
);`;
connection.query(createTableMovieGenres, err => {
    if (err) throw err;
    console.log("Created MovieGenres table");
});

const createTableProjectionViewers = `CREATE TABLE ProjectionViewers (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
UserId INTEGER NOT NULL,
Row INTEGER NOT NULL,
Position INTEGER NOT NULL,
ViewersGroupId INTEGER NOT NULL,
FOREIGN KEY(ViewersGroupId) REFERENCES ViewersGroups(Id) ON DELETE CASCADE,
FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE
);`;
connection.query(createTableProjectionViewers, err => {
    if (err) throw err;
    console.log("Created ProjectionViewers table");
});

const createTableComments = `CREATE TABLE Comments (
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
MovieId INTEGER NOT NULL,
UserId INTEGER NOT NULL,
Text VARCHAR(500) NOT NULL,
Date DATETIME NOT NULL,
FOREIGN KEY(MovieId) REFERENCES Movies(Id) ON DELETE CASCADE,
FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE
);`;
connection.query(createTableComments, err => {
    if (err) throw err;
    console.log("Created Comments table");
});

const createTableSeats = `CREATE TABLE Seats(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
HallId INTEGER NOT NULL,
Row INTEGER NOT NULL,
Position INTEGER NOT NULL,
FOREIGN KEY(HallId) REFERENCES Halls(Id) ON DELETE CASCADE
);`;
connection.query(createTableSeats, err => {
    if (err) throw err;
    console.log("Created Seats table");
});

const createTableNotficationTypes = `CREATE TABLE NotificationTypes(
Id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
Subject VARCHAR(30) NOT NULL
);`;
connection.query(createTableNotficationTypes, err => {
    if (err) throw err;
    console.log("Created NotificationTypes table");
});

const createTableNotifications = `CREATE TABLE Notifications(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
UserId INTEGER NOT NULL,
Information JSON NOT NULL,
TypeId INTEGER NOT NULL,
Date DATETIME NOT NULL,
FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE,
FOREIGN KEY(TypeId) REFERENCES NotificationTypes(Id) ON DELETE CASCADE
);`;
connection.query(createTableNotifications, err => {
    if (err) throw err;
    console.log("Created Notifications table");
});

const createTableRatings = `CREATE TABLE Ratings(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
UserId INTEGER NOT NULL,
MovieId INTEGER NOT NULL,
Date DATETIME NOT NULL,
Rating INTEGER NOT NULL,
FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE,
FOREIGN KEY(MovieId) REFERENCES Movies(Id) ON DELETE CASCADE
);`;
connection.query(createTableRatings, err => {
    if (err) throw err;
    console.log("Created Ratings table");
});

const createUsersFriends = `CREATE TABLE UsersFriends(
Id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
UserId INTEGER NOT NULL,
FriendUserId INTEGER NOT NULL,
FOREIGN KEY(UserId) REFERENCES Users(Id) ON DELETE CASCADE,
FOREIGN KEY(FriendUserId) REFERENCES Users(Id) ON DELETE CASCADE
);`;
connection.query(createUsersFriends, err => {
    if (err) throw err;
    console.log("Created UsersFriends table");
});

const testpass = bcrypt.hashSync('test', null, null);
const test2pass = bcrypt.hashSync('test2', null, null);
const hspasovpass = bcrypt.hashSync('1234567890', null , null);
const radito3pass = bcrypt.hashSync('0987654321', null, null);
const santapass = bcrypt.hashSync('northpole', null, null);
const dontpass = bcrypt.hashSync('123456', null, null);
const sysadminPass = bcrypt.hashSync('sysadminPass', null, null);
const movadminPass = bcrypt.hashSync('movadminPass', null, null);
const cinoneadminPass = bcrypt.hashSync('cinoneadminPass', null, null);
const cintwoadminPass = bcrypt.hashSync('cintwoadminPass', null, null);
const cinthreeadminPass = bcrypt.hashSync('cinthreeadminPass', null, null);
const insertUsers = `INSERT INTO Users
    (Username, Password, FirstName, LastName, DateOfBirth, ProfilePic, Role)
VALUES
    ( 'test', '${testpass}', 'Testing', 'Tester', '2000-11-11', '/images/facebook-default--profile-pic.jpg', 'user' ),
    ( 'test2', '${test2pass}', 'Another', 'Tester', '2000-10-20', '/images/No_picture_icon_2.jpg', 'user' ),
    ( 'hspasov', '${hspasovpass}', 'Hristo', 'Spasov', '1999-12-09', '/images/No_picture_icon_2.jpg', 'user' ),
    ( 'radito3', '${radito3pass}', 'Rangel', 'Ivanov', '1999-12-27', '/images/No_picture_icon_2.jpg', 'user' ),
    ( 'santa', '${santapass}', 'Santa', 'Claus', '1817-01-01', '/images/No_picture_icon_2.jpg', 'user' ),
    ( 'dont', '${dontpass}', 'Donald', 'Trump', '1954-03-08', '/images/No_picture_icon_2.jpg', 'user' ),
    ( 'sysadmin', '${sysadminPass}', 'System', 'Admin', '1985-04-15', '/images/admin.jpg', 'sysadmin'),
    ( 'movieAdmin', '${movadminPass}', 'Movie', 'Admin', '1970-01-01', '', 'movadmin'),
    ( 'cinemaOneAdmin', '${cinoneadminPass}', 'CinemaOne', 'Admin', '1970-01-01', '', 'cinoneadmin' ),
    ( 'cinemaTwoAdmin', '${cintwoadminPass}', 'CinemaTwo', 'Admin', '1970-01-01', '', 'cintwoadmin' ),
    ( 'cinemaThreeAdmin', '${cinthreeadminPass}', 'CinemaThree', 'Admin', '1970-01-01', '', 'cinthreeadmin' )`;
connection.query(insertUsers, err => {
    if (err) throw err;
    console.log("Inserted users");
});

const insertMovies = `INSERT INTO Movies
    (Title, Image, AgeRestriction, Description, Language, Length, Trailer)
VALUES
    ( 'Pirates of the Carribean', '/images/Pirates-Of-The-Caribbean-Wallpapers-On-Stranger-Tides-1920x1200-4.jpg', 13, 'Jack Sparrow and Barbossa embark on a quest to find the elusive fountain of youth, only to discover that Blackbeard and his daughter are after it too.', 'English', 136, 'KR_9A-cUEJc' ),
    ( 'Sample Movie Name', '/images/519539-085_Movie-512.png', 0, 'Sample Description', 'English', 100, 'wZZ7oFKsKzY' ),
    ( 'Finding Dory', '/images/finding-dory-wallpaper-movie-poster-nemo.jpg', 0, 'The friendly but forgetful blue tang fish, Dory, begins a search for her long-lost parents, and everyone learns a few things about the real meaning of family along the way.', 'English', 97, '3JNLwlcPBPI' ),
    ( 'Changeling', '/images/Changeling.jpg', 12, 'A grief-stricken mother takes on the LAPD to her own detriment when it stubbornly tries to pass off an obvious impostor as her missing child, while also refusing to give up hope that she will find him one day.', 'English', 141, 'PmfjureC-5I' ),
    ( 'Black Swan', '/images/natalie-portman-in-black-swan_083878.jpg', 16, 'A committed dancer wins the lead role in a production of Tchaikovskys "Swan Lake" only to find herself struggling to maintain her sanity.', 'English', 108, '5jaI1XOB-bs' ),
    ( 'Star Wars', '/images/Star-Wars-2.jpg', 13, 'Three decades after the Empires defeat, a new threat arises in the militant First Order. Stormtrooper defector Finn and spare parts scavenger Rey are caught up in the Resistances search for the missing Luke Skywalker.', 'English', 136, 'sGbxmsDFVnE' ),
    ( 'The Dictator', '/images/The-Dictator.jpg', 16, 'The heroic story of a dictator who risked his life to ensure that democracy would never come to the country he so lovingly oppressed.', 'English', 83, 'cYplvwBvGA4' );`;
connection.query(insertMovies, err => {
    if (err) throw err;
    console.log("Inserted movies");
});

const insertCountries = `INSERT INTO Countries
    (Name)
VALUES
    ( 'Bulgaria' ),
    ( 'United Kingdom' );`;
connection.query(insertCountries, err => {
    if (err) throw err;
    console.log("Inserted countries");
});

const insertCities = `INSERT INTO Cities
    (Name, CountryId)
VALUES
    ( 'Sofia', 1 ),
    ( 'Bourgas', 1),
    ( 'London', 2);`;
connection.query(insertCities, err => {
    if (err) throw err;
    console.log("Inserted cities");
});

const insertCinemaAddresses = `INSERT INTO CinemaAddresses
    (CityId, FullAddress)
VALUES
    ( 1, 'Mall Sofia, ul. Opalchenska' ),
    ( 2, 'Mall Bourgas' ),
    ( 3, 'Near London Bridge' );`;
connection.query(insertCinemaAddresses, err => {
    if (err) throw err;
    console.log("Inserted cinema addresses");
});

const insertCinemas = `INSERT INTO Cinemas
    (Name, AddressId)
VALUES
    ( 'CinemaOne', 1 ),
    ( 'CinemaTwo', 2 ),
    ( 'CinemaThree', 3);`;
connection.query(insertCinemas, err => {
    if (err) throw err;
    console.log("Inserted cinemas");
});

const insertHalls = `INSERT INTO Halls
    (CinemaId, Label)
VALUES
    ( 1, '1' ),
    ( 1, '2'),
    ( 1, '3'),
    ( 2, '1' ),
    ( 2, '2'),
    ( 3, '1' ),
    ( 3, '2'),
    ( 3, '3');`;
connection.query(insertHalls, err => {
    if (err) throw err;
    console.log("Inserted halls");
});

const insertPriceCategories = `INSERT INTO PriceCategories
    (Regular, Reduced)
VALUES
    ( 10, 8 ),
    ( 12, 10 )`;
connection.query(insertPriceCategories, err => {
    if (err) throw err;
    console.log("Inserted price categories");
});

const insertProjections = `INSERT INTO Projections
    (MovieId, HallId, StartTime, VideoFormat, Translation, PriceCategoryId)
VALUES
    ( 1, 1, '2017-12-10 11:50:00', '2d', 'sub', 1),
    ( 1, 1, '2017-12-10 14:50:00', '2d', 'sub', 1),
    ( 1, 1, '2017-12-10 17:50:00', '2d', 'sub', 1),
    ( 1, 1, '2017-12-10 20:50:00', '2d', 'sub', 1),
    ( 1, 5, '2017-12-10 11:50:00', '2d', 'sub', 1),
    ( 1, 5, '2017-12-10 14:50:00', '2d', 'sub', 1),
    ( 1, 5, '2017-12-10 17:50:00', '2d', 'sub', 1),
    ( 1, 5, '2017-12-10 20:50:00', '2d', 'sub', 1),
    ( 1, 7, '2017-12-11 12:50:00', '2d', 'sub', 1),
    ( 1, 7, '2017-12-11 15:50:00', '2d', 'sub', 1),
    ( 1, 7, '2017-12-11 18:50:00', '2d', 'sub', 1),
    ( 1, 7, '2017-12-11 21:50:00', '2d', 'sub', 1),
    ( 2, 2, '2017-12-10 11:50:00', '3d', 'none', 2),
    ( 2, 2, '2017-12-10 16:40:00', '3d', 'none', 2),
    ( 2, 2, '2017-12-10 22:50:00', '3d', 'none', 2),
    ( 3, 2, '2017-12-22 16:30:00', '3d', 'dub', 2),
    ( 3, 3, '2017-12-23 14:20:00', '3d', 'dub', 2),
    ( 3, 4, '2017-12-23 14:20:00', '3d', 'dub', 2),
    ( 3, 4, '2017-12-23 18:20:00', '3d', 'dub', 2),
    ( 3, 8, '2018-01-21 14:00:00', '3d', 'none', 2),
    ( 3, 8, '2018-01-21 17:00:00', '3d', 'none', 2),
    ( 3, 8, '2018-01-21 20:00:00', '3d', 'none', 2),
    ( 4, 2, '2017-12-10 12:00:00', '2d', 'sub', 1),
    ( 4, 2, '2017-12-10 15:40:00', '2d', 'sub', 1),
    ( 4, 2, '2017-12-10 18:55:00', '2d', 'sub', 1),
    ( 4, 4, '2017-12-15 18:00:00', '2d', 'sub', 1),
    ( 4, 4, '2017-12-16 18:00:00', '2d', 'sub', 1),
    ( 4, 6, '2017-12-17 10:00:00', '2d', 'none', 1),
    ( 4, 6, '2017-12-17 13:00:00', '2d', 'none', 1),
    ( 4, 7, '2017-12-17 10:00:00', '2d', 'none', 1),
    ( 4, 7, '2017-12-17 13:00:00', '2d', 'none', 1),
    ( 5, 3, '2017-12-30 16:00:00', '2d', 'sub', 1),
    ( 7, 8, '2017-12-22 19:45:00', '2d', 'none', 1),
    ( 7, 8, '2017-12-23 19:45:00', '2d', 'none', 1),
    ( 7, 8, '2017-12-24 19:45:00', '2d', 'none', 2);`;
connection.query(insertProjections, err => {
    if (err) throw err;
    console.log("Inserted projections");
});

const insertViewerGroups = `INSERT INTO ViewersGroups
    (ProjectionId)
VALUES
    (2),
    (2),
    (9),
    (10);`;
connection.query(insertViewerGroups, err => {
    if (err) throw err;
    console.log("Inserted viewers groups");
});

const insertGenres = `INSERT INTO Genres
    (Name, Description)
VALUES
    ('Action', 'An action story is similar to adventure, and the protagonist usually takes a risky turn, which leads to desperate situations (including explosions, fight scenes, daring escapes, etc.).'),
    ('Adventure', 'An adventure story is about a protagonist who journeys to epic or distant places to accomplish something.'),
    ('Comedy', 'Comedy is a story that tells about a series of funny, or comical events, intended to make the audience laugh.'),
    ('Crime', 'A crime story is about a crime that is being committed or was committed. It can also be an account of a criminal s life.'),
    ('Drama', 'Drama is a genre of narrative fiction intended to be more serious than humorous in tone, focusing on in-depth development of realistic characters who must deal with realistic emotional struggles.'),
    ('Fantasy', 'A fantasy story is about magic or supernatural forces, rather than technology, though it often is made to include elements of other genres, such as science fiction elements, for instance computers or DNA, if it happens to take place in a modern or future era.'),
    ('Historical', 'A story about a real person or event.'),
    ('Horror', 'A horror story is told to deliberately scare or frighten the audience, through suspense, violence or shock.'),
    ('Mystery', 'A mystery story follows an investigator as he/she attempts to solve a puzzle (often a crime). The details and clues are presented as the story continues and the protagonist discovers them and by the end of the story the mystery/puzzle is solved.'),
    ('Philosophical', 'Philosophical fiction is fiction in which a significant proportion of the work is devoted to a discussion of the sort of questions normally addressed in discursive philosophy. These might include the function and role of society, the purpose of life, ethics or morals, the role of art in human lives, and the role of experience or reason in the development of knowledge.'),
    ('Political', 'Political fiction is a subgenre of fiction that deals with political affairs. Political fiction has often used narrative to provide commentary on political events, systems and theories. Works of political fiction often "directly criticize an existing society or... present an alternative, sometimes fantastic, reality."'),
    ('Romance', 'Emotion-driven stories that are primarily focused on the relationship between the main characters of the story. Beyond the focus on the relationship, the biggest defining characteristic of the romance genre is that a happy ending is always guaranteed... perhaps marriage and living "happily ever after", or simply that the reader sees hope for the future of the romantic relationship.'),
    ('Science fiction', 'Science fiction is a fantasy, in which stories use scientific understanding to explain the universe that it takes place in. It generally includes or is centered on the presumed effects or ramifications of computers or machines; travel through space, time or alternate universes; alien life-forms; genetic engineering; or other such things.'),
    ('Thriller', 'A Thriller is a story that is usually a mix of fear and excitement. It has traits from the suspense genre and often from the action, adventure or mystery genres, but the level of terror makes it borderline horror fiction at times as well. It generally has a dark or serious theme, which also makes it similar to drama.');`;
connection.query(insertGenres, err => {
    if (err) throw err;
    console.log("Inserted genres");
});

const insertMovieGenres = `INSERT INTO MovieGenres
    (MovieId, GenreId)
VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 10),
    (3, 2),
    (3, 3),
    (4, 5),
    (4, 9),
    (5, 14),
    (6, 13),
    (7, 3),
    (7, 11);`;
connection.query(insertMovieGenres, err => {
    if (err) throw err;
    console.log("Inserted movie genres");
});

const insertProjectionViewers = `INSERT INTO ProjectionViewers
    (UserId, Row, Position, ViewersGroupId)
VALUES
    (1, 3, 5, 1),
    (2, 3, 6, 1),
    (1, 2, 1, 2),
    (2, 2, 2, 2),
    (3, 2, 3, 2),
    (4, 2, 4, 2),
    (5, 2, 5, 2),
    (6, 1, 4, 3),
    (2, 2, 2, 4),
    (2, 3, 2, 4);`;
connection.query(insertProjectionViewers, err => {
    if (err) throw err;
    console.log("Inserted projection viewers");
});

// const insertProjectionViewers = `INSERT INTO ProjectionViewers
//     (ProjectionId, Username)
// VALUES
//     (46, 'test'),
//     (47, 'test'),
//     (48, 'test2'),
//     (48, 'test'),
//     (49, 'hspasov'),
//     (49, 'radito3'),
//     (49, 'santa'),
//     (1, 'dont'),
//     (2, 'hspasov'),
//     (3, 'radito3'),
//     (3, 'santa'),
//     (5, 'test'),
//     (5, 'test2'),
//     (5, 'hspasov'),
//     (5, 'radito3'),
//     (5, 'dont'),
//     (5, 'santa'),
//     (10, 'test'),
//     (10, 'test2'),
//     (15, 'dont'),
//     (15, 'santa'),
//     (15, 'test'),
//     (31, 'hspasov'),
//     (33, 'hspasov'),
//     (38, 'hspasov'),
//     (18, 'hspasov'),
//     (24, 'hspasov'),
//     (18, 'radito3'),
//     (45, 'radito3'),
//     (40, 'radito3'),
//     (26, 'radito3'),
//     (31, 'radito3'),
//     (19, 'radito3'),
//     (20, 'radito3');`;
// connection.query(insertProjectionViewers, err => {
//     if (err) throw err;
//     console.log("Inserted ProjectionViewers");
// });

connection.end();