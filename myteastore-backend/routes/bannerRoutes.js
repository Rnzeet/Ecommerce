const express = require("express");
const multer = require("multer");
const { supabaseAdmin } = require("../config/supabase");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// GET / -> list all banners from storage folder
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("product-images")
      .list("banners", { sortBy: { column: "created_at", order: "desc" } });

    if (error) return res.status(400).json({ message: error.message });

    const banners = (data || [])
      .filter(f => f.name !== ".emptyFolderPlaceholder")
      .map(file => ({
        id: file.name,
        url: supabaseAdmin.storage.from("product-images").getPublicUrl(`banners/${file.name}`).data.publicUrl,
        created_at: file.created_at,
      }));

    res.json(banners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /upload -> upload banner image to storage
router.post("/upload", upload.single("banner"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const filename = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
    const storagePath = `banners/${filename}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(storagePath, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) return res.status(400).json({ message: uploadError.message });

    const { data } = supabaseAdmin.storage.from("product-images").getPublicUrl(storagePath);

    res.json({ id: filename, url: data.publicUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:filename -> delete banner from storage
router.delete("/:filename", async (req, res) => {
  try {
    const storagePath = `banners/${req.params.filename}`;

    const { error } = await supabaseAdmin.storage
      .from("product-images")
      .remove([storagePath]);

    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;


// GET / -> list all banners
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("banners")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /upload -> upload banner image and save URL to DB
router.post("/upload", upload.single("banner"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });

    const filename = `banners/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("product-images")
      .upload(filename, req.file.buffer, { contentType: req.file.mimetype });

    if (uploadError) return res.status(400).json({ message: uploadError.message });

    const { data: urlData } = supabaseAdmin.storage
      .from("product-images")
      .getPublicUrl(filename);

    const { data, error: dbError } = await supabaseAdmin
      .from("banners")
      .insert([{ url: urlData.publicUrl, storage_path: filename }])
      .select();

    if (dbError) return res.status(400).json({ message: dbError.message });

    res.json(data[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:id -> delete banner from DB and storage
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: banner, error: fetchError } = await supabaseAdmin
      .from("banners")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (fetchError) return res.status(404).json({ message: "Banner not found" });

    if (banner.storage_path) {
      await supabaseAdmin.storage.from("product-images").remove([banner.storage_path]);
    }

    const { error } = await supabaseAdmin.from("banners").delete().eq("id", id);
    if (error) return res.status(400).json({ message: error.message });

    res.json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
