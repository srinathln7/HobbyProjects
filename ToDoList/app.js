//jshint esversion:6

// Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();
const _ = require("lodash");

var day = date.getDate();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Start the backend-NodeJS server
app.listen(3000, function() {
  console.log("Server started on port 3000");
});


// Make a connection to the mongodb server
mongoose.connect("mongodb://localhost:27017/todoListDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a mongoose data schema
let itemsSchema = mongoose.Schema({
  name: String
});
//Create the mongoose model
let Item = mongoose.model("Item", itemsSchema);

//Custom list schema
const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema] // Has an array of item documents
});

// Create the schema Model
let List = mongoose.model("List", listSchema);

// Create default items
let item1 = new Item({
  name: "Welcome to the To Do List"
});
let item2 = new Item({
  name: "Add + button to add more items"
});

let defaultItemsArray = [item1, item2];

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems.length == 0) {
      Item.insertMany(defaultItemsArray, function(err, res) {
        if (err) {
          console.log(err);
        } else {
          console.log("Default items inserted to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: day,       //The key name 'listTitle' is specified in the list.ejs file
        newListItems: foundItems  //The key name 'newListItems' is specified in the list.ejs file
      });
    }
  });
});

app.post("/", function(req, res) {
  const newItem = req.body.newItem;
  const listName = req.body.listTitle;
  const item = new Item({
    name: newItem
  });

  if (listName === day) {
    item.save();
    res.redirect("/");
  } else {
        List.findOne({name: listName},  function(err, foundList) {
            if(!err) {
                foundList.items.push(item);
                foundList.save();
            }
            res.redirect("/"+ listName);
        });
    }
});

app.post("/delete", function(req, res) {
  let deleteItemID = req.body.checkBox; //Without the name field in the html tag, this will be empty
  let listName = req.body.hiddenListName; // Use the hidden input html tag - See list.ejs file

  console.log(listName);
  if (listName === day) {

    Item.findByIdAndRemove(deleteItemID, function(err, result) {
      if (!err) {
        console.log("Item deleted succesfully");
        res.redirect("/"); // - This will throw an error. You cannot call a express redirect function inside a mongoose function. It has to be outside the scope of a mongoose function.
      }
    });
    //res.redirect("/");
  } else {
      List.findOneAndUpdate({name: listName}, {$pull : {items: {_id: deleteItemID}}} ,
        function(err, newList) {
              if(!err) {
                    res.redirect("/"+listName);
              }
          });
      }
});

//Express routing to create custom lists
app.get("/:paramName", function(req, res) {
  let customListName =  _.capitalize(req.params.paramName);
  List.findOne({name: customListName}, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        let customListModel = new List({
          name: customListName,
          items: defaultItemsArray
        });
        customListModel.save();
        res.redirect("/" + customListName);
      } else {
              res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
    }
  });
});
