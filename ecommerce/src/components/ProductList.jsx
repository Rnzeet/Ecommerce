
import "./ProductList.css";
import ProductCard from "./Products";

import img1 from "../assets/image3.jpg";
import img2 from "../assets/image2.jpg";
import img3 from "../assets/download.jpg";
import img4 from "../assets/image3.jpg";

function ProductList() {
  const products = [
    {
      image: img1,
      title: "Chessy Cheese",
      description: "Best in the world",
      price: 99,
    },
    {
      image: img2,
      title: "Chessy Cheese",
     description: "Best in the world",
      price: 149,
    },
    {
      image: img3,
      title: "Chessy Cheese",
     description: "Best in the world",
      price: 79,
    },
      {
      image: img4,
        title: "Chessy Cheese",
     description: "Best in the world",
      price: 79,
    },
  ];

  return (
    <div className="home">
      <div className="products-grid">
        {products.map((item, index) => (
          <ProductCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
