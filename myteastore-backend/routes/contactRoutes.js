const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.CONTACT_EMAIL_USER,
        pass: process.env.CONTACT_EMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"MyTeaStore Contact" <${process.env.CONTACT_EMAIL_USER}>`,
      replyTo: email,
      to: process.env.CONTACT_EMAIL_USER,
      subject: `[Contact Form] ${subject} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#f9f9f9;padding:32px;border-radius:8px">
          <h2 style="color:#2e7d32;margin-top:0">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#555;font-weight:600;width:110px">Name</td><td style="padding:8px 0;color:#222">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-weight:600">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2e7d32">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#555;font-weight:600">Subject</td><td style="padding:8px 0;color:#222">${subject}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #ddd;margin:20px 0"/>
          <p style="color:#555;font-weight:600;margin-bottom:8px">Message</p>
          <p style="color:#222;line-height:1.7;white-space:pre-wrap">${message}</p>
        </div>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err.message);
    res.status(500).json({ error: "Failed to send message. Please try again." });
  }
});

module.exports = router;
