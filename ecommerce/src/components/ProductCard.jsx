
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "./ProductsCard.css"
function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <div className="card-content">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
        <div className="price-section">
          <span className="price">₹{product.price}</span>
          <button
            onClick={() => {
              addToCart(product);
              toast.success("Item added to cart 🛒");
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
