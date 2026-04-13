
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./ProductCard.css"

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <div className="card-content">
        {product.category && (
          <p className="card-category">{product.category}</p>
        )}
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        {product.weight && <span className="product-weight">{product.weight}</span>}
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
