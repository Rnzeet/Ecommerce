import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slideshow from "../components/SlideShow";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import "./Home.css";

const API = import.meta.env.VITE_API_URL || "https://ecommerce-19y4.onrender.com";

const CATEGORY_ICONS = {
  default: "🍵",
  green: "🌿",
  black: "🖤",
  herbal: "🌸",
  white: "🤍",
  oolong: "🍃",
  chai: "☕",
  matcha: "🍵",
  fruit: "🍓",
  mint: "🌱",
  accessori: "🫖",
  gift: "🎁",
  blend: "🧪",
};

function getCategoryIcon(name) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key !== "default" && lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Read from localStorage first (set by Admin), then sync from API
    const stored = JSON.parse(localStorage.getItem("myteastore_categories") || "[]");
    if (stored.length > 0) setCategories(stored);

    axios.get(`${API}/api/products`).then(res => {
      const fromProducts = [...new Set(res.data.map(p => p.category).filter(Boolean))];
      if (fromProducts.length > 0) {
        const merged = [...new Set([...stored, ...fromProducts])];
        setCategories(merged);
        localStorage.setItem("myteastore_categories", JSON.stringify(merged));
      }
    }).catch(() => {});
  }, []);

  const testimonials = [
    { text: "Amazing tea and fast delivery!", name: "Priya" },
    { text: "Best flavors I have ever tasted.", name: "Rahul" },
    { text: "Lovely packaging and great service.", name: "Sneha" },
  ];

  return (
    <>
      <div className="slideshow-container">
        <Slideshow />
      </div>

      <section>
        <h2 style={{ color: "white" }}>Featured Products</h2>
        <ProductList />
      </section>

      <section className="categories-section">
        <h2 style={{ color: "white" }}>Shop by Category</h2>
        {categories.length === 0 ? (
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>No categories available yet.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="category-card"
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
              >
                <div className="cat-emoji">{getCategoryIcon(cat)}</div>
                <p className="cat-label">{cat}</p>
                <span className="cat-arrow">→</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="about">
        <h2 style={{ color: "white" }}>Why Choose MyStore?</h2>
        <p style={{ maxWidth: "600px", margin: "10px auto", lineHeight: "1.6", textAlign: "center" }}>
          We provide the finest quality teas sourced from the best gardens.
          Enjoy a wide range of flavors and blends that bring comfort and wellness to your day.
        </p>
      </section>

      <section className="testimonials">
        <h2 style={{ color: "white" }}>What Our Customers Say</h2>
        <div className="testimonials">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p>"{t.text}"</p>
              <strong>- {t.name}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <h2>Discover Your Perfect Tea Today</h2>
        <button onClick={() => window.location.href = "/#"}>Shop Now</button>
      </section>

      <Footer />
    </>
  );
}

export default Home;
