import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Slideshow from "../components/SlideShow";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import "./Home.css";

const API = import.meta.env.VITE_API_URL;

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

const CATEGORY_GRADIENTS = [
  "linear-gradient(135deg,#1b5e20,#388e3c)",
  "linear-gradient(135deg,#1a237e,#3949ab)",
  "linear-gradient(135deg,#4a148c,#7b1fa2)",
  "linear-gradient(135deg,#bf360c,#e64a19)",
  "linear-gradient(135deg,#006064,#00838f)",
  "linear-gradient(135deg,#33691e,#558b2f)",
  "linear-gradient(135deg,#880e4f,#c2185b)",
  "linear-gradient(135deg,#e65100,#ef6c00)",
];

function getCategoryIcon(name) {
  const lower = name.toLowerCase();
  for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
    if (key !== "default" && lower.includes(key)) return icon;
  }
  return CATEGORY_ICONS.default;
}

const STATS = [
  { value: "10+", label: "Happy Customers" },
  { value: "20+", label: "Tea Varieties" },
  { value: "4.9★", label: "Average Rating" },
  { value: "Free", label: "Shipping Above ₹499" },
];

const FEATURES = [
  {
    icon: "🌿",
    title: "100% Natural",
    desc: "Sourced from certified organic gardens. No artificial flavors or preservatives.",
  },
  {
    icon: "🚚",
    title: "Fast Delivery",
    desc: "Same-day dispatch on orders before 2 PM. Pan-India delivery in 3–5 days.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "SSL-encrypted checkout. Pay with UPI, cards, wallets, or COD.",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    desc: "Our tea experts are always available to help you pick the perfect blend.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Browse Our Collection", desc: "Explore 200+ varieties of premium teas filtered by flavor, origin, or wellness benefit." },
  { step: "02", title: "Add to Cart", desc: "Pick your favorites, choose quantity and package size, and add them with one click." },
  { step: "03", title: "Fast Delivery", desc: "We pack and dispatch your order within 24 hours and deliver right to your door." },
];

const TESTIMONIALS = [
  { text: "The Darjeeling First Flush is absolutely divine. My mornings have completely changed!", name: "Priya S.", rating: 5, role: "Tea Enthusiast" },
  { text: "Best chai masala I've ever had. The blend is perfectly balanced — not too spicy, not too mild.", name: "Rahul M.", rating: 5, role: "Verified Buyer" },
  { text: "Gorgeous packaging, fast delivery, and the green tea collection is outstanding. Highly recommend!", name: "Sneha K.", rating: 5, role: "Loyal Customer" },
  { text: "I ordered the herbal wellness bundle and it arrived beautifully packed. Great gift option too!", name: "Arjun P.", rating: 4, role: "Verified Buyer" },
];

function StarRating({ count }) {
  return (
    <div className="star-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "star filled" : "star"}>★</span>
      ))}
    </div>
  );
}

function AnimatedCounter({ target }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ""));
  const suffix = target.replace(/[0-9.]/g, "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const duration = 1600;
          const step = numericTarget / (duration / 16);
          const timer = setInterval(() => {
            start += step;
            if (start >= numericTarget) {
              setCount(numericTarget);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericTarget]);

  const display = Number.isInteger(numericTarget) ? count : count.toFixed(1);
  return <span ref={ref}>{display}{suffix}</span>;
}

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myteastore_categories") || "[]");
    if (stored.length > 0) setCategories(stored);

    axios.get(`${API}/api/products`).then(res => {
      const list = Array.isArray(res.data) ? res.data : [];
      const fromProducts = [...new Set(list.map(p => p.category).filter(Boolean))];
      if (fromProducts.length > 0) {
        const merged = [...new Set([...stored, ...fromProducts])];
        setCategories(merged);
        localStorage.setItem("myteastore_categories", JSON.stringify(merged));
      }
    }).catch(() => {});
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="home-root">

      {/* ── HERO ── */}
      <section className="hero-section">
        <Slideshow />
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="hero-badge">🌿 Premium Quality Tea</span>
            <h1 className="hero-title">
              Discover the <span className="hero-accent">Finest Teas</span><br />
              From Around the World
            </h1>
            <p className="hero-subtitle">
              Handpicked blends from the best gardens — delivered fresh to your doorstep.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => navigate("/products")}>
                Shop Now
              </button>
              <button className="btn-outline" onClick={() => navigate("/about")}>
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="stats-strip">
        {STATS.map((s, i) => (
          <div key={i} className="stat-item">
            <span className="stat-value">
              {/^\d/.test(s.value) ? <AnimatedCounter target={s.value} /> : s.value}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">Why Us</span>
          <h2 className="section-title">The TeaStore Promise</h2>
          <p className="section-subtitle">We put quality, trust, and your satisfaction first — every single time.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="products-section">
        <div className="section-header">
          <span className="section-tag">Bestsellers</span>
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Curated favorites loved by thousands of tea drinkers.</p>
        </div>
        <ProductList limit={8} />
        <div className="view-all-wrap">
          <button className="btn-outline-green" onClick={() => navigate("/products")}>
            View All Products →
          </button>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="categories-section">
        <div className="section-header">
          <span className="section-tag">Explore</span>
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find the perfect tea for every mood and moment.</p>
        </div>
        {categories.length === 0 ? (
          <p className="empty-text">No categories available yet.</p>
        ) : (
          <div className="categories-grid">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="category-card"
                style={{ background: CATEGORY_GRADIENTS[i % CATEGORY_GRADIENTS.length] }}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat)}`)}
              >
                <div className="cat-emoji">{getCategoryIcon(cat)}</div>
                <p className="cat-label">{cat}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-header">
          <span className="section-tag">Simple & Easy</span>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Getting your perfect tea delivered is as easy as 1-2-3.</p>
        </div>
        <div className="how-grid">
          {HOW_IT_WORKS.map((h, i) => (
            <div key={i} className="how-card">
              <div className="how-step-badge">{h.step}</div>
              {i < HOW_IT_WORKS.length - 1 && <div className="how-connector" />}
              <h3 className="how-title">{h.title}</h3>
              <p className="how-desc">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="section-tag">Reviews</span>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real tea lovers.</p>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <StarRating count={t.rating} />
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <strong className="author-name">{t.name}</strong>
                  <span className="author-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section">
        <div className="newsletter-inner">
          <span className="newsletter-icon">📬</span>
          <h2 className="newsletter-title">Get 10% Off Your First Order</h2>
          <p className="newsletter-sub">Subscribe to our newsletter for exclusive deals, brewing tips, and new arrivals.</p>
          {subscribed ? (
            <p className="newsletter-success">🎉 Thank you! Your discount code has been sent to your email.</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2 className="cta-title">Your Perfect Cup is Waiting</h2>
          <p className="cta-sub">Join thousands of happy customers who start their day with TeaStore.</p>
          <div className="cta-actions">
            <button className="btn-primary" onClick={() => navigate("/products")}>
              Shop the Collection
            </button>
            <button className="btn-outline" onClick={() => navigate("/about")}>
              Our Story
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
