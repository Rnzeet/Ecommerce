import { useState, useEffect, useRef, useCallback } from "react";
import "./SlideShow.css";

const API = import.meta.env.VITE_API_URL;
const INTERVAL = 5000;

function Slideshow() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [direction, setDirection] = useState("next"); // "next" | "prev"
  const [animating, setAnimating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paused, setPaused] = useState(false);

  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const progressStart = useRef(null);

  // Fetch banners
  useEffect(() => {
    fetch(`${API}/api/banners`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setImages(data.map(b => b.url));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Animate to a slide
  const goTo = useCallback((index, dir = "next") => {
    if (animating || images.length < 2) return;
    setDirection(dir);
    setPrev(current => {
      return current;
    });
    setAnimating(true);
    setProgress(0);
    progressStart.current = null;

    // After transition duration, settle
    setTimeout(() => {
      setCurrent(index);
      setPrev(null);
      setAnimating(false);
    }, 600);

    // Update current immediately for logic
    setCurrent(index);
  }, [animating, images.length]);

  const nextSlide = useCallback(() => {
    setCurrent(c => {
      const next = (c + 1) % images.length;
      setDirection("next");
      setPrev(c);
      setAnimating(true);
      setProgress(0);
      progressStart.current = null;
      setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
      return next;
    });
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrent(c => {
      const next = c === 0 ? images.length - 1 : c - 1;
      setDirection("prev");
      setPrev(c);
      setAnimating(true);
      setProgress(0);
      progressStart.current = null;
      setTimeout(() => { setPrev(null); setAnimating(false); }, 600);
      return next;
    });
  }, [images.length]);

  // Progress bar animation
  useEffect(() => {
    if (images.length === 0 || paused) return;

    const animate = (ts) => {
      if (!progressStart.current) progressStart.current = ts;
      const elapsed = ts - progressStart.current;
      const pct = Math.min((elapsed / INTERVAL) * 100, 100);
      setProgress(pct);
      if (elapsed < INTERVAL) {
        progressRef.current = requestAnimationFrame(animate);
      } else {
        nextSlide();
      }
    };

    progressRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, paused, images.length, nextSlide]);

  // Touch swipe support
  const touchStart = useRef(null);
  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : prevSlide();
    touchStart.current = null;
  };

  if (loading) {
    return (
      <div className="ss-root ss-loading">
        <div className="ss-spinner" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="ss-root ss-empty">
        <div className="ss-empty-inner">
          <span className="ss-empty-icon">🍵</span>
          <p className="ss-empty-text">MyTeaStore</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="ss-root"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {images.map((src, i) => {
        let cls = "ss-slide";
        if (i === current) cls += animating ? ` ss-enter-${direction}` : " ss-active";
        else if (i === prev) cls += ` ss-exit-${direction}`;
        else cls += " ss-hidden";
        return (
          <div key={i} className={cls}>
            <img src={src} alt={`banner-${i}`} loading={i === 0 ? "eager" : "lazy"} />
            <div className="ss-vignette" />
          </div>
        );
      })}

      {/* Progress bar */}
      <div className="ss-progress-bar">
        <div className="ss-progress-fill" style={{ width: `${progress}%`, transition: paused ? "none" : undefined }} />
      </div>

      {/* Arrows */}
      <button className="ss-arrow ss-arrow-left" onClick={prevSlide} aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="ss-arrow ss-arrow-right" onClick={nextSlide} aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="ss-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`ss-dot ${i === current ? "ss-dot-active" : ""}`}
            onClick={() => { setDirection(i > current ? "next" : "prev"); setCurrent(i); setProgress(0); progressStart.current = null; }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="ss-counter">
        <span className="ss-counter-cur">{String(current + 1).padStart(2, "0")}</span>
        <span className="ss-counter-sep"> / </span>
        <span className="ss-counter-total">{String(images.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}

export default Slideshow;
