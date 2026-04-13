import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import "./Wishlist.css";

function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success("Added to cart 🛒");
  };

  if (wishlist.length === 0) {
    return (
      <div className="wl-root">
        <div className="wl-empty">
          <span className="wl-empty-icon">🤍</span>
          <h2>Your wishlist is empty</h2>
          <p>Save products you love by tapping the heart on any product card.</p>
          <button className="wl-shop-btn" onClick={() => navigate("/products")}>
            Browse Products
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wl-root">
      {/* Hero */}
      <section className="wl-hero">
        <span className="wl-hero-tag">❤️ Saved Items</span>
        <h1 className="wl-hero-title">My Wishlist</h1>
        <p className="wl-hero-sub">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved</p>
      </section>

      {/* Grid */}
      <section className="wl-body">
        <div className="wl-grid">
          {wishlist.map(product => (
            <div key={product.id} className="wl-card">
              <div className="wl-card-img-wrap">
                {product.image
                  ? <img src={product.image} alt={product.title} className="wl-card-img" />
                  : <div className="wl-card-img-placeholder">🍵</div>}
                <button
                  className="wl-card-remove"
                  onClick={() => toggleWishlist(product)}
                  title="Remove from wishlist"
                >❤️</button>
              </div>
              <div className="wl-card-body">
                {product.category && <span className="wl-card-cat">{product.category}</span>}
                <h3 className="wl-card-name">{product.title || product.name}</h3>
                {product.weight && <span className="wl-card-weight">{product.weight}</span>}
                <p className="wl-card-desc">{product.description}</p>
                <div className="wl-card-footer">
                  <span className="wl-card-price">₹{product.price}</span>
                  <button
                    className="wl-card-add-btn"
                    onClick={() => handleAddToCart(product)}
                  >Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Wishlist;
