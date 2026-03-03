import Slideshow from "../components/SlideShow";
import ProductList from "../components/ProductList";
import Footer from "../components/Footer";
import "./Home.css"; // import new CSS

function Home() {
  const categories = [
    { title: "Green Tea", img: "/assets/green-tea.jpg" },
    { title: "Black Tea", img: "/assets/black-tea.jpg" },
    { title: "Herbal Tea", img: "/assets/herbal-tea.jpg" },
    { title: "Tea Accessories", img: "/assets/tea-accessories.jpg" }
  ];

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
 

      <section className="categories">
        <h2 style={{ color: "white" }}>Shop by Category</h2>
        <div className="categories">
          {categories.map((cat, i) => (
            <div key={i} className="category-card">
              <img src={cat.img} alt={cat.title} />
              <p>{cat.title}</p>
            </div>
          ))}
        </div>
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
