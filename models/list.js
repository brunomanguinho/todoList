const path = require("path");
const dao = require(path.join(__dirname, "../dao.js"));

const mongoose = dao.conn;

const itemsSchema = {
  name: String
};

const listSchema = {
  name: String,
  items: [itemsSchema]
}

exports.List = mongoose.model("List", listSchema);
