//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");

const date = require(__dirname + "/date.js");

const itemModel = require(__dirname + "/models/item.js");
const listModel = require(__dirname + "/models/list.js");

const itemDAO = require(__dirname + "/dao/itemDAO.js");
const listDAO = require(__dirname + "/dao/listDAO.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// Default list
item1 = itemDAO.insertItem("Wake up", false);
item2 = itemDAO.insertItem("Get Coffee", false);
item3 = itemDAO.insertItem("Go to work", false);

//get methods
app.get("/", function(req, res) {
  itemDAO.findItems(function(items){
    if (items.length > 0){
      res.render("list", {listTitle: "Today", newListItems: items});
    }
  });
});

app.get("/:route", function(req, res){
  const customList = _.capitalize(req.params.route);
  listDAO.findOne(customList, function(foundList){
    if (!foundList){
      res.redirect("/" + customList);
    }else{
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    }
  });

})

app.get("/about", function(req, res){
  res.render("about");
});

//post methods
app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName = _.capitalize(req.body.list);

  if (listName === "Today"){
    itemDAO.insertItem(item, true);
    res.redirect("/");
  }else {
    listDAO.findOne(listName, function(foundList){
      if (foundList){
        newItem = itemDAO.insertItem(item, false);
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/"+listName);
      }
    });
  }
});

app.post("/delete", function(req, res){
  const listName = req.body.listName;

  if (listName === "Today"){
    itemDAO.deleteItemByid(req.body.checkbox);
    res.redirect("/");
  }else {
    listDAO.deleteListByid(req.body.checkbox, listName);
    res.redirect("/" + listName);
  }

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
