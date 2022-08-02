const express = require("express");
const Product = require("../models/product");
const multer = require("multer");
const router = express.Router();

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });

router.get("/", async (req, res) => {
  let productList = await Product.find();
  if (!productList) {
    res.json({ msg: "Products not found" });
  } else {
    res.send({ msg: "Availabel Products", details: productList });
  }
});

router.get("/:id", (req, res) => {
  Product.findById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/create", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  console.log(req.file);
  if (!file) return res.status(400).send("No image in the request");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  let product = new Product({
    name: req.body.name,
    image: `${basePath}${fileName}`,
    category: req.body.category,
    description: req.body.description,
    price: req.body.price,
    brand: req.body.brand,
  });

  product = await product.save();
  if (product) {
    res.json({
      status: 200,
      msg: "Product created successfully!",
      details: product,
    });
  } else {
    res.json({ msg: "Product not created!" });
  }
});

router.delete("/delete/:id", (req, res) => {
  console.log(req.params.id);
  Product.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.json({ msg: "Product Deleted successfully!", details: data });
    })
    .catch((err) => {
      res.json({ msg: "Product Not Deleted!", Error: err });
    });
});

router.put("/update/:id", uploadOptions.single("image"), async (req, res) => {
  const file = req.file;
  const product = await Product.findById(req.params.id);

  if (file) {
    const fileName = req.file.filename;
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    imagepath = `${basePath}${fileName}`;
  } else {
    imagepath = product.image;
  }

  const updateProduct = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name,
      image: imagepath,
      category: req.body.category,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
    },
    {
      new: true,
    }
  );

  if (updateProduct) {
    res.json({ msg: "Product Updated successfully!", details: updateProduct });
  } else {
    res.json({ msg: "Product Not Updated!" });
  }
});

module.exports = router;
