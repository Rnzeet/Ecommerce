import { useState, useEffect } from "react";
import { FaShoppingCart, FaBars, FaTimes, FaHeart } from "react-icons/fa";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import "./Header.css";

const NAV_ITEMS = [
  { to: "/", label: "Home", exact: true },
  { to: "/products", label: "Products" },
  // { to: "/track", label: "Track Order" },
  { to: "/about", label: "About" },
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useCart();
  const { user, signOut } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    navigate("/");
  };

  const close = () => setMenuOpen(false);

  return (
    <header className={`header${scrolled ? " header--scrolled" : ""}`}>

      {/* Brand */}
      <Link to="/" className="header-logo" onClick={close}>
        <span className="header-logo-icon">🍵</span>
        <span className="header-logo-text">MyTeaStore</span>
      </Link>

      {/* Desktop nav */}
      <nav className={`header-nav${menuOpen ? " header-nav--open" : ""}`}>
        <ul className="header-nav-list">
          {NAV_ITEMS.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  "header-nav-link" + (isActive ? " header-nav-link--active" : "")
                }
                onClick={close}
              >
                {label}
              </NavLink>
            </li>
          ))}
          {/* Sign out inside hamburger menu (mobile only) */}
          {user && (
            <li className="header-nav-signout">
              <button className="header-nav-signout-btn" onClick={handleSignOut}>
                Sign out
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Right actions */}
      <div className="header-actions">
        {/* Wishlist */}
        <Link to="/wishlist" className="header-cart" aria-label="Wishlist" onClick={close}>
          <FaHeart />
          {wishlist.length > 0 && <span className="header-cart-badge">{wishlist.length}</span>}
        </Link>

        {/* Cart */}
        <Link to="/cart" className="header-cart" aria-label="Cart" onClick={close}>
          <FaShoppingCart />
          {cartCount > 0 && <span className="header-cart-badge">{cartCount}</span>}
        </Link>

        {/* User area */}
        {user ? (
          <div className="header-user">
            <div className="header-avatar-wrap" title={user.user_metadata?.full_name || "User"}>
              {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                <img
                  src={user.user_metadata.avatar_url || user.user_metadata.picture}
                  alt={user.user_metadata?.full_name || "User"}
                  className="header-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="header-avatar-initial">
                  {(user.user_metadata?.full_name || user.email || "U")[0].toUpperCase()}
                </span>
              )}
              <span className="header-avatar-online" />
            </div>
            <span className="header-username">
              {user.user_metadata?.full_name?.split(" ")[0] || "User"}
            </span>
            {/* <Link to="/track" className="header-orders-btn" onClick={close}>Track Order</Link> */}
            <Link to="/orders" className="header-orders-btn" onClick={close}>My Orders</Link>
            <button className="header-signout-btn" onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (
          <Link to="/login" className="header-login-btn" onClick={close}>Sign in</Link>
        )}

        {/* Hamburger */}
        <button
          className="header-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile overlay */}
      {menuOpen && <div className="header-overlay" onClick={close} />}
    </header>
  );
}

export default Header;

