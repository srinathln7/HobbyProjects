//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.use( bodyParser.urlencoded({
      extended: true
  })
);

// Make a connection to the mongodb server
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

const secret = "I am a super man.";

// Important to add this plugin before creating the user model
// userSchema.plugin(encrypt, {
//   secret: process.env.SECRET,
//   encryptedFields: ["password"]
// });


let User = mongoose.model("User", userSchema);
app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});

app.post("/register", function(req, res) {

    bcrypt.hash(req.body.password, saltRounds, function(err, hashP) {
      const newUser = new User ({
        email: req.body.username,
        password: hashP // Hashed password
        });

        newUser.save(function(err) {
            if(!err) {
              res.render("secrets");
            }
        });
    });

});

app.post("/login", function(req, res) {
   let eUserName = req.body.username;
   let ePassword = req.body.password;

   User.findOne({email: eUserName}, function(err, foundUser)  {
      if (!err) {
        if (foundUser) {
           bcrypt.compare(ePassword, foundUser.password, function (err, result) {
             if (result) {
                res.render("secrets");
             } else {
                res.send("Incorrect password");
              }
           });
          } else {
            res.send("Username not registered.");
          }
        } else {
            res.send(err);
        }
   });
});


app.get("/logout", function(req, res){
    res.render("home");
});
