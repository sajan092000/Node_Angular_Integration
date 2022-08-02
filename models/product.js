const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productsSchema, "products");

module.exports = Product;
