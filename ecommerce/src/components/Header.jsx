import { useState } from "react";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        TeaStore
      </Link>

      <nav className={`nav ${menuOpen ? "active" : ""}`}>
        <ul className="nav-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link></li>
          <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        </ul>
      </nav>

      <div className="right-section">
        <Link to="/cart" className="cart">
          <FaShoppingCart />
          <span className="cart-count">{cartCount}</span>
        </Link>

        {user ? (
          <div className="header-user">
            {user.user_metadata?.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="avatar"
                className="header-avatar"
              />
            )}
            <span className="header-username">
              {user.user_metadata?.full_name?.split(" ")[0] || "User"}
            </span>
            <Link to="/orders" className="my-orders-btn" onClick={() => setMenuOpen(false)}>My Orders</Link>
            <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}

        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
}

export default Header;
