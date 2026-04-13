const express = require("express");
const { supabase } = require("../config/supabase");

const router = express.Router();

// Static coupons (client-validated, no DB needed)
const STATIC_COUPONS = {
  TEA10: { discount: 0.10, label: "10% off" },
  SAVE20: { discount: 0.20, label: "20% off" },
};

// DB-backed one-time coupon
const ONE_TIME_COUPONS = {
  NEW10: { discount: 0.10, label: "10% off for new users" },
};

// POST /api/coupons/validate
router.post("/validate", async (req, res) => {
  try {
    const { code, userEmail } = req.body;
    if (!code) return res.status(400).json({ valid: false, message: "No coupon code provided" });

    const upper = code.trim().toUpperCase();

    // Static coupons
    if (STATIC_COUPONS[upper]) {
      return res.json({ valid: true, discount: STATIC_COUPONS[upper].discount, code: upper });
    }

    // One-time coupons — require email
    if (ONE_TIME_COUPONS[upper]) {
      if (!userEmail) return res.status(400).json({ valid: false, message: "Login required to use this coupon" });

      // Check if already used
      const { data: existing } = await supabase
        .from("coupon_usage")
        .select("id")
        .eq("coupon_code", upper)
        .eq("user_email", userEmail.toLowerCase())
        .maybeSingle();

      if (existing) {
        return res.json({ valid: false, message: "You have already used this coupon" });
      }

      return res.json({ valid: true, discount: ONE_TIME_COUPONS[upper].discount, code: upper });
    }

    return res.json({ valid: false, message: "Invalid coupon code" });
  } catch (err) {
    res.status(500).json({ valid: false, message: err.message });
  }
});

// POST /api/coupons/mark-used  (called after successful payment)
router.post("/mark-used", async (req, res) => {
  try {
    const { code, userEmail } = req.body;
    if (!code || !userEmail) return res.status(400).json({ message: "code and userEmail required" });

    const upper = code.trim().toUpperCase();
    if (!ONE_TIME_COUPONS[upper]) return res.json({ skipped: true }); // static coupons don't need recording

    await supabase.from("coupon_usage").insert([{
      coupon_code: upper,
      user_email: userEmail.toLowerCase(),
    }]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
