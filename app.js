const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const serverless = require("serverless-http");
var cors = require("cors");

const app = new express();

// Routers
const productsRouter = require("./controllers/products");

//middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.static("ecommerce-frontend"));
app.use("/api/v1/products", productsRouter);

mongoose
  .connect("mongodb://localhost:27017/ECommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((data) => {
    console.log("Database Connected Successfully!");
  })
  .catch((err) => {
    console.log("Error Occured", err);
  });

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

module.exports = app;
module.exports.handler = serverless(app);
