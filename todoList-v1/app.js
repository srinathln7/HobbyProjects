//jshint esversion:6

const express = require("express");
const bodyParser = require("body-Parser");
const dateModule = require(__dirname + "/date.js");

//const request = require("request");

var app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

//Start up the server
app.listen(3000, function() {
  console.log("Server listening on port 3000");
});

var items = [];

app.get("/", function(req, res) {
    let day = dateModule.getDate();
    res.render("lists", {
      today: day,
      toDoItem: items
    });
}
);

app.post("/", function(req, res) {
    items.push(req.body.item);
    res.redirect("/");
});
