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
Coming soon...

## Contributors
Hristo Spasov - hristo.b.spasov@gmail.com

Rangel Ivanov - rangel.ivanov33@gmail.com
