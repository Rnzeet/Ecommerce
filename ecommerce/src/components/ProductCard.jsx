
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { toast } from "react-toastify";
import "./ProductCard.css"

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="product-card">
      <div className="card-img-wrap">
        <img src={product.image} alt={product.title} />
        <button
          className={`card-wishlist-btn${wishlisted ? " wishlisted" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
            toast(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️", {
              autoClose: 1200,
              position: "bottom-right",
            });
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? "❤️" : "🤍"}
        </button>
      </div>
      <div className="card-content">
        {product.category && (
          <p className="card-category">{product.category}</p>
        )}
        <h3>{product.title}</h3>
        {product.weight && <span className="product-weight">{product.weight}</span>}
        <p>{product.description}</p>
        <div className="price-section">
          <span className="price"><span>₹</span>{product.price}</span>
          <button
            className="card-add-btn"
            onClick={() => {
              addToCart(product);
              toast.success("Added to cart 🛒");
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
