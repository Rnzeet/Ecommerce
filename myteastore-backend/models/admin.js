const express = require("express");
const supabase = require("../config/supabase"); // supabase client
const router = express.Router();

// Add product
router.post("/add-product", async (req, res) => {
  const { name, price, image } = req.body;

  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, image }]);

  if (error) return res.status(400).json(error);
  res.json(data);
});

// Get all products
router.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) return res.status(400).json(error);
  res.json(data);
});

module.exports = router; // ← make sure you export the router
