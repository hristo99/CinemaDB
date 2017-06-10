# CinemaDB
A DB systems project

## Introduction
CinemaDB is a web application for managing movies, projections and projection viewers in cinemas.

## Instruction Manual
1. Check out the source code from git
```groovy
git clone https://github.com/hristo99/CinemaDB.git
```
2. Open CinemaDB main dir
```groovy
cd ./CinemaDB
```
3. Install dependencies
```groovy
npm install
```
4. Start application
```groovy
npm start
```
## Technologies used
ExpressJS, pugJS, Bootstrap and MySQL.

## Database tables
### Users
| Column      | Data type   | Constraints           |
|:-----------:|:-----------:|:---------------------:|
| Username    | VARCHAR(15) | NOT NULL, PRIMARY KEY |
| Password    | VARCHAR(60) | NOT NULL              |
| FirstName   | VARCHAR(30) | NOT NULL              |
| LastName    | VARCHAR(30) | NOT NULL              |
| Age         | INTEGER     | NOT NULL              |
| Role        | VARCHAR(20) | NOT NULL              |

### Movies
| Column              | Data type    | Constraints           |
|:-------------------:|:------------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY |
| Title               | VARCHAR(100) | NOT NULL              |
| AgeRestriction      | INTEGER      | NOT NULL              |
| FirstProjection     | DATETIME     | NOT NULL              |
| LastProjection      | DATETIME     | NOT NULL              |
| Length              | INTEGER      | NOT NULL              |

### Halls
| Column              | Data type    | Constraints           |
|:-------------------:|:------------:|:---------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY |
| Seats               | INTEGER      | NOT NULL              |

### Projections
| Column              | Data type    | Constraints                                 |
|:-------------------:|:------------:|:-------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY                       |
| MovieId             | INTEGER      | NOT NULL, FOREIGN KEY REFERENCES Movies(Id) |
| HallId              | INTEGER      | NOT NULL, FOREIGN KEY REFERENCES Halls(Id)  |
| StartTime           | DATETIME     | NOT NULL                                    |
| LastProjection      | DATETIME     | NOT NULL                                    |
| Length              | INTEGER      | NOT NULL                                    |

### ProjectionViewers
| Column              | Data type    | Constraints                                      |
|:-------------------:|:------------:|:------------------------------------------------:|
| Id (AUTO_INCREMENT) | INTEGER      | NOT NULL, PRIMARY KEY                            |
| ProjectionId        | INTEGER      | NOT NULL, FOREIGN KEY REFERENCES Projections(Id) |
| Username            | VARCHAR(15)  | NOT NULL, FOREIGN KEY REFERENCES Users(Username) |
| StartTime           | DATETIME     | NOT NULL                                         |
| LastProjection      | DATETIME     | NOT NULL                                         |
| Length              | INTEGER      | NOT NULL                                         |

## Contributors
Hristo Spasov - hristo.b.spasov@gmail.com

Rangel Ivanov - rangel.ivanov33@gmail.com