const express = require("express");
const supabase = require("./config/supabase"); // make sure this exports the client
require('dotenv').config();

const app = express();

app.use(express.json());

// Add product
app.post("/add-product", async (req, res) => {
  const { name, price, image } = req.body;

  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, image }]);

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});

// Get products
app.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    return res.status(400).json(error);
  }

  res.json(data);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
