var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
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

module.exports = router;