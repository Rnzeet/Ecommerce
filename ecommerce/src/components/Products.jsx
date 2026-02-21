import "./Products.css"

function ProductCard({ image, title, description, price }) {
  return (
    <div className="product-card">
      <img src={image} alt={title} />

      <div className="card-content">
        <h3 style={{color:"red"}}>{title}</h3>
        <p>{description}</p>
        <div className="price-section">
          <span className="price">${price}</span>
          <button>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
