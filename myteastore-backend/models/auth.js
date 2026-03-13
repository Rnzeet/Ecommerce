const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const ADMIN_EMAIL = "admin@myteastore.com";
const ADMIN_PASSWORD = "myteastore123";

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {

    const token = jwt.sign(
      { email: ADMIN_EMAIL },
      "mysecretkey",
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
