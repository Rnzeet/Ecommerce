// // import "./Products.css"

// // function ProductCard({ image, title, description, price }) {
// //   return (
// //     <div className="product-card">
// //       <img src={image} alt={title} />

// //       <div className="card-content">
// //         <h3 style={{color:"red"}}>{title}</h3>
// //         <p>{description}</p>
// //         <div className="price-section">
// //           <span className="price">${price}</span>
// //           <button>Add to Cart</button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ProductCard;


// import { useCart } from "../context/CartContext";

// function ProductCard({ product }) {
//   const { addToCart } = useCart();

//   return (
//     <div>
//       <h3>{product.name}</h3>
//       <p>₹{product.price}</p>

//       <button onClick={() => addToCart(product)}>
//         Add to Cart
//       </button>
//     </div>
//   );
// }

// export default ProductCard;

import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>{product.description}</p>
      <h4>₹{product.price}</h4>

      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
