//jshint esversion:6

const express = require("express");
const bodyParser = require("body-Parser");
const request = require("request");

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("static"));

//Start up the server
app.listen(3000, function() {
  console.log("Server listening on port 3000");
});

app.get("/", function(req, res) {
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req, res) {

  // From the mainchimp API
  var data = {
     members: [{
       email_address: req.body.Email,
       status: "subscribed",
       merge_fields: {
         FNAME: req.body.Fname,
         LNAME: req.body.Lname
       }
     }]
  };

  var jsonData = JSON.stringify(data);

  var options = {
    url: "https://us4.api.mailchimp.com/3.0/lists/e4834391a1",
    method: "POST",
    rejectUnauthorized: false, // Comes with its own risk.
    headers: {
        "Authorization" : "srinathLN7 c8a79cdb20fc181af7ead6bf1a03cd39-us4"
    },
    body: jsonData
  };

  request(options, function(err, response, body) {
     if (err) {
       console.log(err);
       res.sendFile(__dirname+"/failure.html");
     } else {
        if (response.statusCode == 200) {
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
     }
  });
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});
