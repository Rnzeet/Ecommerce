const express = require("express");
const multer = require("multer");
const supabase = require("../config/supabase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /upload-image -> upload to Supabase Storage, return public URL
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) return res.status(400).json({ error: uploadError });

    const { data } = supabase.storage.from("product-images").getPublicUrl(filename);

    res.json({ url: data.publicUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

