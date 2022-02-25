const path = require("path");

const dao = require(path.join(__dirname, "../dao.js"));

const mongoose = dao.conn;

const itemsSchema = {
  name: String
};

exports.Item = mongoose.model("Item", itemsSchema);
