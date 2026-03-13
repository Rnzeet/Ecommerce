// const express = require("express");
// const supabase = require("../config/supabase"); // supabase client
// const router = express.Router();

// // Add product
// router.post("/add-product", async (req, res) => {
//   const { name, price, image } = req.body;

//   const { data, error } = await supabase
//     .from("products")
//     .insert([{ name, price, image }]);

//   if (error) return res.status(400).json(error);
//   res.json(data);
// });

// // Get all products
// router.get("/products", async (req, res) => {
//   const { data, error } = await supabase
//     .from("products")
//     .select("*");

//   if (error) return res.status(400).json(error);
//   res.json(data);
// });

// module.exports = router; // ← make sure you export the router
const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

// GET PRODUCTS
router.get("/products", async (req, res) => {

  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) return res.status(400).json(error);

  res.json(data);

});

// ADD PRODUCT
router.post("/add-product", async (req, res) => {

  const { name, price, image, 
     category,
      description 
    } = req.body;

  const { data, error } = await supabase
    .from("products")
    .insert([{ name, price, image, category, description }]);

  if (error) return res.status(400).json(error);

  res.json(data);

});

// DELETE PRODUCT
router.delete("/delete-product/:id", async (req, res) => {

  const { id } = req.params;

  const { data, error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) return res.status(400).json(error);

  res.json({ message: "Deleted", data });

});
// UPDATE PRODUCT
router.put("/update-product/:id", async (req, res) => {

  const { id } = req.params;
  const { name, price, image, category, description } = req.body;

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      price,
      image,
       category,
       description
    })
    .eq("id", id);

  if (error) {
    return res.status(400).json(error);
  }

  res.json({
    message: "Product updated",
    data
  });

});

module.exports = router;
