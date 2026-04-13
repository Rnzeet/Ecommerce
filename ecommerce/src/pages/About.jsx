import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "./About.css";

function About() {
  const navigate = useNavigate();

  const team = [
    { name: "Ranjit Mahato", role: "Founder & Tea Curator", emoji: "🧑‍🌾", bio: "Ranjit grew up watching his grandmother brew fresh leaves every morning. That ritual sparked a lifelong obsession with finding the world's best teas and making them accessible to everyone." },
    // { name: "Priya Sharma", role: "Head of Sourcing", emoji: "🌿", bio: "With 8 years of experience travelling through Darjeeling, Assam and Nilgiri estates, Priya handpicks every lot we carry — if it doesn't make her smile, it doesn't make the shelf." },
    // { name: "Arjun Verma", role: "Brewing Expert", emoji: "☕", bio: "Arjun is our in-house tea sommelier. He writes our brewing guides, trains our support team, and is probably steeping something amazing right now." },
  ];

  const values = [
    { icon: "🌱", title: "Farm to Cup", desc: "We partner directly with certified gardens in Assam, Darjeeling, Nilgiri and beyond — cutting middlemen and keeping quality intact." },
    { icon: "🔬", title: "Quality Tested", desc: "Every batch is tested for pesticide residues, freshness and flavour profile before it ships to your door." },
    { icon: "♻️", title: "Sustainably Packed", desc: "Our packaging is 100% recyclable. We use minimal plastic and are working towards fully compostable materials by 2026." },
    { icon: "🤝", title: "Fair Trade", desc: "We pay farmers above market rate and invest a portion of each sale back into their community welfare programmes." },
  ];

  const milestones = [
    { year: "2020", event: "Founded in a small apartment kitchen in Jaipur with 6 teas and a dream." },
    { year: "2021", event: "Crossed 1,000 happy customers. Started direct partnerships with 3 Darjeeling gardens." },
    { year: "2022", event: "Launched subscription boxes and expanded to 12 states across India." },
    { year: "2023", event: "Introduced our award-winning Winter Spice Chai blend — sold out in 48 hours." },
    { year: "2024", event: "Reached 10,000 orders milestone. Added Nilgiri and Assam estate partners." },
    { year: "2025", event: "Moved to our dedicated fulfilment centre. Now shipping across all of India."},
  ];

  return (
    <div className="about-root">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="about-hero-tag">🍵 Our Story</span>
          <h1 className="about-hero-title">We believe a great cup of tea<br />can change your whole day.</h1>
          <p className="about-hero-sub">
            MyTeaStore started as a simple idea: bring the finest, freshest teas straight from India's best gardens to your doorstep — without fuss, without compromise.
          </p>
          <div className="about-hero-actions">
            <button className="about-btn-primary" onClick={() => navigate("/products")}>Explore Our Teas</button>
            <button className="about-btn-outline" onClick={() => navigate("/contact")}>Get in Touch</button>
          </div>
        </div>
        <div className="about-hero-stats">
          <div className="about-stat"><span className="about-stat-num">10+</span><span className="about-stat-lbl">Happy Customers</span></div>
          <div className="about-stat-divider" />
          <div className="about-stat"><span className="about-stat-num">50+</span><span className="about-stat-lbl">Tea Varieties</span></div>
          <div className="about-stat-divider" />
          <div className="about-stat"><span className="about-stat-num">12</span><span className="about-stat-lbl">Garden Partners</span></div>
          <div className="about-stat-divider" />
          <div className="about-stat"><span className="about-stat-num">5★</span><span className="about-stat-lbl">Average Rating</span></div>
        </div>
      </section>

      {/* ── ORIGIN STORY ── */}
      <section className="about-section">
        <div className="about-story">
          <div className="about-story-img">
            <span className="about-story-emoji">🌄</span>
          </div>
          <div className="about-story-text">
            <span className="about-section-tag">How it started</span>
            <h2 className="about-section-title">Born from a love for the ritual</h2>
            <p>Every morning in Ranjit's childhood home began the same way — the sound of water heating, the aroma of fresh leaves, and a quiet 10 minutes before the day began. Tea wasn't a drink. It was a pause. A breath. A moment of calm.</p>
            <p>When he moved to the city, he noticed that the teas available were either too expensive, too stale, or too anonymous. He knew the names of the estates his grandmother trusted. He missed that connection.</p>
            <p>So in 2020, he started making calls — to farmers, to estate managers, to people who shared the same obsession. MyTeaStore was born from those conversations.</p>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="about-section about-section-alt">
        <div className="about-section-inner">
          <span className="about-section-tag centered">What we stand for</span>
          <h2 className="about-section-title centered">Our Values</h2>
          <div className="about-values-grid">
            {values.map(v => (
              <div key={v.title} className="about-value-card">
                <span className="about-value-icon">{v.icon}</span>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-section">
        <div className="about-section-inner">
          <span className="about-section-tag centered">The people behind the leaves</span>
          <h2 className="about-section-title centered">Meet the Team</h2>
          <div className="about-team-grid">
            {team.map(t => (
              <div key={t.name} className="about-team-card">
                <div className="about-team-avatar">{t.emoji}</div>
                <h3 className="about-team-name">{t.name}</h3>
                <p className="about-team-role">{t.role}</p>
                <p className="about-team-bio">{t.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      {/* <section className="about-section about-section-alt">
        <div className="about-section-inner">
          <span className="about-section-tag centered">Our journey</span>
          <h2 className="about-section-title centered">From idea to India's favourite tea shop</h2>
          <div className="about-timeline">
            {milestones.map((m, i) => (
              <div key={m.year} className={`about-timeline-item ${i % 2 === 0 ? "left" : "right"}`}>
                <div className="about-timeline-year">{m.year}</div>
                <div className="about-timeline-dot" />
                <div className="about-timeline-content">{m.event}</div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA ── */}
      <section className="about-cta">
        <h2 className="about-cta-title">Ready to find your perfect cup?</h2>
        <p className="about-cta-sub">Join thousands of tea lovers who have made MyTeaStore their daily ritual.</p>
        <button className="about-btn-primary" onClick={() => navigate("/products")}>Shop All Teas →</button>
      </section>

      <Footer />
    </div>
  );
}

export default About;

