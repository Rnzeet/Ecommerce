import { useState } from "react";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import "./Products.css";

function Products() {
  const [search, setSearch] = useState("");

  return (
    <div className="products-page">
      {/* ── Page Hero ── */}
      <div className="products-hero">
        <span className="products-hero-tag">🍵 Our Collection</span>
        <h1 className="products-hero-title">All Products</h1>
        <p className="products-hero-sub">
          Handpicked teas sourced from the finest gardens around the world.
        </p>
        {/* Search Bar */}
        <div className="products-search-wrap">
          <span className="products-search-icon">🔍</span>
          <input
            className="products-search-input"
            type="text"
            placeholder="Search teas, blends, flavors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="products-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
      </div>

      {/* ── Product Listing ── */}
      <div className="products-body">
        <ProductList search={search} />
      </div>

      <Footer />
    </div>
  );
}

export default Products;

