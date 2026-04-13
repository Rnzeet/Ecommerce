const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

// GET / -> list all categories
router.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) return res.status(400).json({ message: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST / -> add a category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: "Category name is required" });
    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: name.trim() }])
      .select()
      .single();
    if (error) {
      if (error.code === "23505") return res.status(409).json({ message: "Category already exists" });
      return res.status(400).json({ message: error.message });
    }
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /:name -> remove a category by name
router.delete("/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const { error } = await supabase.from("categories").delete().eq("name", name);
    if (error) return res.status(400).json({ message: error.message });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
