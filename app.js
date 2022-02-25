//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _  = require("lodash");

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

//Schemas & Models
const itemsSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

// Default list
item1 = insertItem("Wake up", false);
item2 = insertItem("Get Coffee", false);
item3 = insertItem("Go to work", false);

//DB Call functions
function findItems(){
  foundItems = Item.find({}, function(err, items){
    if (err){
      console.log(err);
    }
  });

  console.log(foundItems);

  return foundItems;
}

function insertItem(description, post){
  const item = new Item({
    name: description
  });

  if (post){
    item.save();
  }

  return item;
}

function insertManyItems(items){
  Item.insertMany(items, function(err, docs){
    if (err){
      console.log(err);
    }
    else {
      console.log(docs);
    }
  });
}

function deleteItemByid(id){
  Item.deleteOne({_id: id}, function(err){
    if (err){
      console.log(err);
    } else console.log("Register Deleted");
  })
}

function deleteListByid(id, listName){
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, function(err, foundList){
    if (err){
      console.log(err);
    } else{
      console.log(foundList);
    }
  });
}


//get methods
app.get("/", function(req, res) {
  const day = date.getDate();

  Item.find({}, function(err, items){
    if (err){
      console.log(err);
    }else{
      if (items.length === 0){
        insertManyItems([item1, item2, item3]);
        res.redirect("/")
      }else res.render("list", {listTitle: "Today", newListItems: items});
    }
  });

});

app.get("/:route", function(req, res){
  const customList = _.capitalize(req.params.route);

  List.findOne({name: customList}, function(err, foundList){
    if(err){
      console.log(err);
    }else if (!foundList){
      const list = new List({
        name: customList,
        items: [item1, item2, item3]
      });

      list.save();

      res.redirect("/" + customList);
    }else{
      res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
    }
  })
})

app.get("/about", function(req, res){
  res.render("about");
});

//post methods
app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName = _.capitalize(req.body.list);

  if (listName === "Today"){
    insertItem(item, true);
    res.redirect("/");
  }else {
    List.findOne({name: listName}, function(err, foundList){
      if(!err){
        if (foundList){
          newItem = insertItem(item, false);
          foundList.items.push(newItem);
          foundList.save();
          res.redirect("/"+listName);
        }
      }
    })
  }
});

app.post("/delete", function(req, res){
  const listName = req.body.listName;

  if (listName === "Today"){
    deleteItemByid(req.body.checkbox);
    res.redirect("/");
  }else {
    deleteListByid(req.body.checkbox, listName);
    res.redirect("/" + listName);
  }


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
