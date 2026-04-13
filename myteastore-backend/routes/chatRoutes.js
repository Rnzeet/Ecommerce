const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { supabase } = require("../config/supabase");
const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: "Message is required." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "AI service not configured." });
  }

  try {
    // 1. Fetch products — minimal fields to keep prompt small
    const { data: products, error } = await supabase
      .from("products")
      .select("name, price, category")
      .order("name");

    if (error) console.error("[chat] Supabase error:", error.message);

    const catalog = (products || [])
      .map(p => `${p.name} (${p.category || "Tea"}) ₹${p.price}`)
      .join(", ");

    // 2. Build compact system instruction
    const systemInstruction = `You are TeaBot for MyTeaStore (Jaipur). Be concise (2-3 sentences max).
Products: ${catalog || "loading"}
Policies: free ship >₹499, coupon NEW10=10% off new users, delivery 3-5 days pan-India.
Contact: ranjitmahato548@gmail.com | +91 97729 83552.
If asked unrelated topics, politely redirect to teas or the store.`;

    // 3. Call Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", systemInstruction });

    // Convert history to Gemini format
    const geminiHistory = history
      .filter(m => m.role && m.text)
      .map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(message.trim());
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("[chat] Gemini error:", err.message);
    res.status(500).json({ error: "AI is temporarily unavailable. Please try again." });
  }
});

module.exports = router;
