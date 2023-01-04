const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "default category description" },   //default if we forget to add property
  image: { type: String, default: "/images/tablets-category.png" },        //default if we forget to add property
  attrs: [{ key: { type: String }, value: [{ type: String }] }],
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
