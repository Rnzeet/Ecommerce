const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
  console.error("[FATAL] ADMIN_USERNAME, ADMIN_PASSWORD and JWT_SECRET must be set as environment variables.");
}

router.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

    const token = jwt.sign(
      { username: ADMIN_USERNAME },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token
    });
  }

  res.status(401).json({
    message: "Invalid credentials"
  });

});

module.exports = router;
