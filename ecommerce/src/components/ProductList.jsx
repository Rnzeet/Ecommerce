
import "./ProductList.css";
import ProductCard from "./ProductCard";

import img1 from "../assets/image3.jpg";
import img2 from "../assets/image2.jpg";
import img3 from "../assets/download.jpg";
import img4 from "../assets/image3.jpg";

function ProductList() {
  const products = [
       {
  id: 1,
  image: img1,
  title: "Cheesy Cheese",
  description: "Best in the world",
  price: 99,
},
    {
  id: 1,
  image: img1,
  title: "Cheesy Cheese",
  description: "Best in the world",
  price: 99,
},
     {
  id: 1,
  image: img1,
  title: "Cheesy Cheese",
  description: "Best in the world",
  price: 99,
},
     {
  id: 1,
  image: img1,
  title: "Cheesy Cheese",
  description: "Best in the world",
  price: 99,
},
     {
  id: 1,
  image: img1,
  title: "Cheesy Cheese",
  description: "Best in the world",
  price: 99,
},
     {
  id: 1,
  image: img1,
  title: "Cheesy Cheese",
  description: "Best in the world",
  price: 99,
},
     {
  id: 1,
  image: img1,
  title: "Cheesy Cheese",
  description: "Best in the world",
  price: 99,
},

  ];

  return (
    <div className="home">
      <div className="products-grid">
        {products.map((item, index) => (
        <ProductCard product={item} />

        ))}
      </div>
    </div>
  );
}

export default ProductList;
