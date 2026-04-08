const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

// GET / -> list products
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) return res.status(400).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /add-product -> add new product
router.post("/add-product", async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, price, image, category, description }]);
    if (error) return res.status(400).json({ error });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /update-product/:id -> update product
router.put("/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, category, description } = req.body;
    const { data, error } = await supabase
      .from("products")
      .update({ name, price, image, category, description })
      .eq("id", id);
    if (error) return res.status(400).json({ error });
    res.json({ message: "Product updated", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /delete-product/:id -> delete product
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(400).json({ error });
    res.json({ message: "Product deleted", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");


// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ADD new product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE product
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
