# CinemaDB
A DB systems project

## Introduction
CinemaDB is a web application for managing cinemas.

## Description
CinemaDB is a system for managing multiple cinemas in different countries and providing information to users.
Users can get information about movies, cinemas and movie projections. They can add other users to their friend list and write messages to them. A notification system is available, so no one would accidentally miss a projection they bought tickets for. Users can also buy tickets for a projection for themselves and their friends. They can share their opinions about different movies by writing comments and rating them.

There are also different types of administrators: system administrator, movies administrator and cinema administrator
A cinema administrator can create, edit and delete a cinema, the halls in it, add movies and create projections. He can set the price of tickets for each projection. The cinema has a name and an address. The address information - country and a city, can be added if it doesn't exist.
A movie administrator can create, edit and delete movies. Each movie has the following information: title, age restriction, movie length, language, description, film poster and genre.
The system administrator has full control of the system. He is responsible for adding, editing and deleting the genres.

## Instruction Manual
1. Make sure you have NodeJS installed and an active MySQL service is available.
2. Check out the source code from git
```groovy
git clone https://github.com/hristo99/CinemaDB.git
```
3. Properly configure CinemaDB/config/database.js
4. Create database
```groovy
node CinemaDB/scripts/createDatabase.js
```
5. Open CinemaDB main dir
```groovy
cd CinemaDB
```
6. Install dependencies
```groovy
npm install
```
7. Start application
```groovy
npm start
```
## Technologies used
ExpressJS, pugJS, Bootstrap and MySQL.

## Database tables
### Users
| Column              | Data type    | Constraints           |
|:-------------------:|:------------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY |
| Username            | VARCHAR(30)  | NOT NULL              |
| Password            | VARCHAR(60)  | NOT NULL              |
| FirstName           | VARCHAR(30)  | NOT NULL              |
| LastName            | VARCHAR(30)  | NOT NULL              |
| DateOfBirth         | DATE         | NOT NULL              |
| ProfilePic          | VARCHAR(255) | NOT NULL              |
| Role                | VARCHAR(20)  | NOT NULL              |

### Movies
| Column              | Data type     | Constraints           |
|:-------------------:|:-------------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER       | NOT NULL, PRIMARY KEY |
| Title               | VARCHAR(100)  | NOT NULL              |
| Image               | VARCHAR(255)  | NOT NULL              |
| AgeRestriction      | INTEGER       | NOT NULL              |
| Description         | VARCHAR(1000) | NOT NULL              |
| Language            | VARCHAR(30)   | NOT NULL              |
| Premiere            | DATE          | NOT NULL              |
| Length              | INTEGER       | NOT NULL              |
| Trailer             | VARCHAR(60)   | NOT NULL              |

### Countries
| Column              | Data type     | Constraints           |
|:-------------------:|:-------------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER       | NOT NULL, PRIMARY KEY |
| Name                | VARCHAR(60)   | NOT NULL              |

### Cities
| Column              | Data type    | Constraints                                    |
|:-------------------:|:------------:|:----------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY                          |
| Name                | VARCHAR(100) | NOT NULL                                       |
| CountryId           | INTEGER      | NOT NULL, FOREIGN KEY REFERENCES Countries(Id) |

### CinemaAddresses
| Column              | Data type    | Constraints                               |
|:-------------------:|:------------:|:-----------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY                     |
| CityId              | INTEGER      | NOT NULL, FOREIGN KEY REFERENCES City(Id) |
| FullAddress         | VARCHAR(100) | NOT NULL                                  |

### Cinemas
| Column              | Data type   | Constraints                                          |
|:-------------------:|:-----------:|:----------------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER     | NOT NULL, PRIMARY KEY                                |
| Name                | VARCHAR(30) | NOT NULL                                             |
| AddressId           | INTEGER     | NOT NULL, FOREIGN KEY REFERENCES CinemaAddresses(Id) |
| Admin               | INTEGER     | NOT NULL, FOREIGN KEY REFERENCES Users(Id)           |

### CinemaMovies
| Column              | Data type | Constraints                                  |
|:-------------------:|:---------:|:--------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                        |
| CinemaId            | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Cinemas(Id) |
| MovieId             | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Movies(Id)  |

### Halls
| Column              | Data type   | Constraints                                  |
|:-------------------:|:-----------:|:--------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER     | NOT NULL, PRIMARY KEY                        |
| CinemaId            | INTEGER     | NOT NULL, FOREIGN KEY REFERENCES Cinemas(Id) |
| Label               | VARCHAR(30) | NOT NULL                                     |

### PriceCategories
| Column              | Data type | Constraints           |
|:-------------------:|:---------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY |
| Regular             | DECIMAL   | NOT NULL              |
| Reduced             | DECIMAL   | NOT NULL              |

### Projections
| Column              | Data type   | Constraints                                          |
|:-------------------:|:-----------:|:----------------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER     | NOT NULL, PRIMARY KEY                                |
| CinemaMovieId       | INTEGER     | NOT NULL, FOREIGN KEY REFERENCES CinemaMovies(Id)    |
| HallId              | INTEGER     | NOT NULL, FOREIGN KEY REFERENCES Halls(Id)           |
| StartTime           | DATETIME    | NOT NULL                                             |
| VideoFormat         | VARCHAR(15) | NOT NULL                                             |
| Translation         | VARCHAR(15) | NOT NULL                                             |
| PriceCategoryId     | INTEGER     | NOT NULL, FOREIGN KEY REFERENCES PriceCategories(Id) |

### ViewersGroups
| Column              | Data type | Constraints                                      |
|:-------------------:|:---------:|:------------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                            |
| PojectionId         | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Projections(Id) |
| Date                | DATETIME  | NOT NULL                                         |

### Genres
| Column              | Data type    | Constraints           |
|:-------------------:|:------------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY |
| Name                | VARCHAR(30)  | NOT NULL              |
| Description         | VARCHAR(500) | NOT NULL              |

### MovieGenres
| Column              | Data type | Constraints           |
|:-------------------:|:---------:|:-------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                       |
| MovieId             | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Movies(Id) |
| GenreId             | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Genres(Id) |

### ProjectionViewers
| Column              | Data type | Constraints                                       |
|:-------------------:|:---------:|:-------------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                             |
| UserId              | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Users(Id)        |
| Row                 | INTEGER   | NOT NULL                                          |
| Position            | INTEGER   | NOT NULL                                          |
| ViewersGroupId      | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES ViewersGroup(Id) |

### Comments
| Column              | Data type    | Constraints                                 |
|:-------------------:|:------------:|:-------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY                       |
| MovieId             | DECIMAL      | NOT NULL, FOREIGN KEY REFERENCES Movies(Id) |
| UserId              | DECIMAL      | NOT NULL, FOREIGN KEY REFERENCES Users(Id)  |
| Text                | VARCHAR(500) | NOT NULL                                    |
| Date                | DATETIME     | NOT NULL                                    |

### Seats
| Column              | Data type | Constraints                                |
|:-------------------:|:---------:|:------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                      |
| HallId              | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Halls(Id) |
| Row                 | INTEGER   | NOT NULL                                   |
| Position            | INTEGER   | NOT NULL                                   |

### NotificationTypes
| Column              | Data type   | Constraints           |
|:-------------------:|:-----------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER     | NOT NULL, PRIMARY KEY |
| Subject             | VARCHAR(30) | NOT NULL              |

### Notifications
| Column              | Data type | Constraints                                            |
|:-------------------:|:---------:|:------------------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                                  |
| UserId              | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Users(Id)             |
| Information         | JSON      | NOT NULL                                               |
| TypeId              | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES NotificationTypes(Id) |
| Date                | DATETIME  | NOT NULL                                               |

### Ratings
| Column              | Data type | Constraints                                 |
|:-------------------:|:---------:|:-------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                       |
| UserId              | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Users(Id)  |
| MovieId             | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Movies(Id) |
| Date                | DATETIME  | NOT NULL                                    |
| Rating              | INTEGER   | NOT NULL                                    |

### UsersFriends
| Column              | Data type | Constraints                                |
|:-------------------:|:---------:|:------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER   | NOT NULL, PRIMARY KEY                      |
| UserId              | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Users(Id) |
| FriendUserId        | INTEGER   | NOT NULL, FOREIGN KEY REFERENCES Users(Id) |


## Contributors
Hristo Spasov - hristo.b.spasov@gmail.com

Rangel Ivanov - rangel.ivanov33@gmail.com
