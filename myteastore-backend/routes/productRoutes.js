const express = require("express");
const multer = require("multer");
const { supabase, supabaseAdmin } = require("../config/supabase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// POST /upload-image -> upload to Supabase Storage, return public URL
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    // Sanitize filename
    const ext = req.file.originalname.split(".").pop().toLowerCase();
    const filename = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Use service-role client if available (bypasses RLS), else anon client
    const storageClient = (supabaseAdmin && supabaseAdmin !== supabase) ? supabaseAdmin : supabase;

    const { error: uploadError } = await storageClient.storage
      .from("product-images")
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error("[upload-image] Supabase storage error:", uploadError);
      return res.status(500).json({
        message: uploadError.message || "Image upload failed",
        hint: "Ensure the 'product-images' bucket exists in Supabase Storage and is set to public, and SUPABASE_SERVICE_ROLE_KEY is set in Render env vars.",
        details: uploadError,
      });
    }

    const { data } = storageClient.storage.from("product-images").getPublicUrl(filename);
    res.json({ url: data.publicUrl });
  } catch (err) {
    console.error("[upload-image] Unexpected error:", err);
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
    const { name, price, image, category, description, weight, stock } = req.body;
    if (!name || price === undefined || price === "") {
      return res.status(400).json({ message: "Name and price are required" });
    }
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, price: parseFloat(price), image, category, description, weight: weight || null, stock: stock !== undefined && stock !== "" ? parseInt(stock) : null }])
      .select();
    if (error) return res.status(400).json({ message: error.message, details: error.details });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /update-product/:id -> update product
router.put("/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, category, description, weight, stock } = req.body;
    const { data, error } = await supabase
      .from("products")
      .update({ name, price: parseFloat(price), image, category, description, weight: weight || null, stock: stock !== undefined && stock !== "" ? parseInt(stock) : null })
      .eq("id", id)
      .select();
    if (error) return res.status(400).json({ message: error.message, details: error.details });
    res.json({ message: "Product updated", data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /delete-product/:id -> delete product
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message, details: error.details });
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

