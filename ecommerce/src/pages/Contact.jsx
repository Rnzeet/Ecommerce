import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./Contact.css";

function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending (replace with real email API if needed)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="contact-root">

      {/* ── HERO ── */}
      <section className="contact-hero">
        <span className="contact-hero-tag">💬 Contact Us</span>
        <h1 className="contact-hero-title">We'd love to hear from you</h1>
        <p className="contact-hero-sub">Questions, feedback, wholesale enquiries — we reply within 24 hours.</p>
      </section>

      {/* ── MAIN ── */}
      <section className="contact-body">

        {/* Info cards */}
        <div className="contact-info-col">
          <div className="contact-info-card">
            <span className="contact-info-icon">📧</span>
            <h3>Email</h3>
            <p><a href="mailto:ranjitmahato548@gmail.com">ranjitmahato548@gmail.com</a></p>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-icon">📞</span>
            <h3>Phone</h3>
            <p><a href="tel:+919772983552">+91 97729 83552</a></p>
            <span className="contact-info-note">Mon–Sat, 10am–7pm IST</span>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-icon">📍</span>
            <h3>Location</h3>
            <p>Jaipur, Rajasthan<br />India — 302001</p>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-icon">⏱️</span>
            <h3>Response Time</h3>
            <p>We typically reply within<br /><strong>24 hours</strong> on business days.</p>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-col">
          {submitted ? (
            <div className="contact-success">
              <span className="contact-success-icon">✅</span>
              <h2>Message Sent!</h2>
              <p>Thank you, {form.name}! We've received your message and will get back to you shortly.</p>
              <button className="contact-btn" onClick={() => navigate("/products")}>Continue Shopping</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2 className="contact-form-title">Send us a message</h2>

              <div className="contact-form-row">
                <div className="contact-form-group">
                  <label>Full Name *</label>
                  <input name="name" placeholder="e.g. Ananya Singh" value={form.name} onChange={handleChange} required />
                </div>
                <div className="contact-form-group">
                  <label>Email Address *</label>
                  <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="contact-form-group">
                <label>Subject *</label>
                <select name="subject" value={form.subject} onChange={handleChange} required>
                  <option value="">— Select a topic —</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Product Query">Product Query</option>
                  <option value="Wholesale Enquiry">Wholesale Enquiry</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="contact-form-group">
                <label>Message *</label>
                <textarea name="message" rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={handleChange} required />
              </div>

              <button type="submit" className="contact-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Message →"}
              </button>
            </form>
          )}
        </div>

      </section>

      <Footer />
    </div>
  );
}

export default Contact;
