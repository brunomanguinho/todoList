const path = require("path");

const model = require(path.join(__dirname, "../models/item.js"));

let Item = model.Item;

exports.insertItem =
function insertItem(description, post){
  const item = new Item({
    name: description
  });

  if (post){
    item.save();
  }

  return item;
}

exports.insertManyItems =
function (items){
  Item.insertMany(items, function(err, docs){
    if (err){
      console.log(err);
    }
    else {
      console.log(docs);
    }
  });
}

exports.deleteItemByid =
function (id){
  Item.deleteOne({_id: id}, function(err){
    if (err){
      console.log(err);
    } else console.log("Register Deleted");
  })
}

exports.findItems =
function (fn){
  Item.find({}, function(err, items){
    if (err){
      console.log(err);
    }
    console.log(items);
    fn(items);
  });
}
