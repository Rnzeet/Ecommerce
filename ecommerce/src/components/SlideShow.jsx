import { useState, useEffect, useRef } from "react";
import "./SlideShow.css";

const API = import.meta.env.VITE_API_URL;

function Slideshow() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

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

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, 4000);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [images]);

  const goTo = (index) => {
    setCurrent(index);
    startInterval();
  };

  const prevSlide = () => goTo(current === 0 ? images.length - 1 : current - 1);
  const nextSlide = () => goTo((current + 1) % images.length);

  return (
    <div className="slideshow">
      {loading ? (
        <div className="slideshow-placeholder">
          <span className="slideshow-loader" />
        </div>
      ) : images.length === 0 ? (
        <div className="slideshow-placeholder">
          <span className="slideshow-no-banner">🍵 MyTeaStore</span>
        </div>
      ) : (
        <>
          <img src={images[current]} alt="banner" />
          <button className="arrow left" onClick={prevSlide}>❮</button>
          <button className="arrow right" onClick={nextSlide}>❯</button>
          <div className="dots">
            {images.map((_, index) => (
              <span
                key={index}
                className={index === current ? "dot active" : "dot"}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Slideshow;