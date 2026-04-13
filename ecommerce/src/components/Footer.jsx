import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-section">
          <h2 className="footer-logo">Tea Store</h2>
          <p>Your one-stop shop for quality products.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: ranjitmahato548@gmail.com</p>
          <p>Phone: +91 9772983552</p>
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
        © {new Date().getFullYear()} TeaStore. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
