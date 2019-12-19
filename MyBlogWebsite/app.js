//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const homeStartingContent = "Welcome to myBlogApp.";

const aboutContent = "A simple blog app integrated with mongoDB designed to keep track of your daily posts. ";

const contactContent = "Content created by Lakshminarayanan Nandakumar - contact srinath0393@gmail.com";

const app = express();
let _ = require("lodash");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//let posts = [];

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

// Make a connection to the mongodb server
mongoose.connect("mongodb://localhost:27017/blogWebDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const postSchema = mongoose.Schema({
  postTitle: String,
  postBody:  String
});

const Post = mongoose.model("Post", postSchema);


app.get("/", function(req, res) {

  Post.find({}, function(err, foundPosts) {
    res.render("home.ejs", {
      homeContent : homeStartingContent,
      postsEJS: foundPosts // The foundPosts always gets returned as an array of JSON documents.
          });
      });
  });



app.get("/about", function(req, res) {
  res.render("about.ejs", {
    aboutEJSContent : aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact.ejs", {
    contactEJSContent : contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose.ejs");
});

app.post("/compose", function(req, res) {
    let newPost = new Post({
       postTitle: req.body.titleContent,
       postBody:  req.body.postContent
     });
     // newPost.save(function(err) {
     //   if(!err) {
     //      res.redirect("/");
     //   }
     // });
     Post.insertMany(newPost, function(err){
       if(!err) {
         res.redirect("/");
       } else {
         res.send(err);
       }
     });
});


//Express routing params
app.get("/posts/:postID", function(req, res){
        Post.findById(req.params.postID, function(err, foundPost) {
          res.render("post.ejs", {
            content:  foundPost
          });
        });
});
