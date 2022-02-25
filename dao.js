const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

exports.conn = mongoose;
