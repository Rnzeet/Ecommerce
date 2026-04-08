import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductList.css";
import ProductCard from "./ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/products`);
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
