import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-section">
          <h2 className="footer-logo">SurpiStore</h2>
          <p>Your one-stop shop for quality products.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>Cart</li>
            <li>Login</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@surpistore.com</p>
          <p>Phone: +91 98765 43210</p>
        </div>

        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SurpiStore. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
