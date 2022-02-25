const path = require("path");

const model = require(path.join(__dirname, "../models/list.js"));

let List = model.List;

exports.deleteListByid =
function (id, listName){
  List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: id}}}, function(err, foundList){
    if (err){
      console.log(err);
    } else{
      console.log(foundList);
    }
  });
}

exports.findOne =
function (customList, fn) {
  List.findOne({name: customList}, function(err, foundList){
    if(err){
      console.log(err);
    }else if (!foundList){
      const list = new List({
        name: customList,
        items: [item1, item2, item3]
      });

      list.save();
    }
    fn(foundList);
});
}
