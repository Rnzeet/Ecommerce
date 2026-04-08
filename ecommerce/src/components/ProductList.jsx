import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductList.css";
import ProductCard from "./ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);

  const API = import.meta.env.VITE_API_URL || "https://ecommerce-19y4.onrender.com";

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    // Mapping "name" from API to "title" for ProductCard compatibility
    const fetchedProducts = res.data.map(p => ({ ...p, title: p.name }));
    setProducts(fetchedProducts);
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="home">
      <div className="products-grid">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;
