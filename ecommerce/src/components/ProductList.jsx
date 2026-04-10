import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./ProductList.css";
import ProductCard from "./ProductCard";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(
    () => searchParams.get("category") || "All"
  );

  const API = import.meta.env.VITE_API_URL 

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    const fetchedProducts = res.data.map(p => ({ ...p, title: p.name }));
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Sync active category when URL param changes (e.g. navigating from Home)
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setActiveCategory(cat);
      // Remove param from URL so back-navigation is clean
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleTabClick = (cat) => {
    setActiveCategory(cat);
  };

  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filtered = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="product-list-wrapper">
      {/* Category Filter Tabs */}
      {categories.length > 1 && (
        <div className="category-filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-tab ${activeCategory === cat ? "filter-tab-active" : ""}`}
              onClick={() => handleTabClick(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {filtered.length === 0 ? (
          <p className="no-products">No products in this category yet.</p>
        ) : filtered.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}

export default ProductList;

