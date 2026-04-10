import { useState, useEffect, useRef } from "react";
import "./SlideShow.css";

import banner1 from "../assets/image3.jpg";
import banner2 from "../assets/image2.jpg";
import banner3 from "../assets/download.jpg";

const STATIC_BANNERS = [banner1, banner2, banner3];
const API = import.meta.env.VITE_API_URL || "https://ecommerce-19y4.onrender.com";

function Slideshow() {
  const [images, setImages] = useState(STATIC_BANNERS);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    axios_fetch();
  }, []);

  const axios_fetch = async () => {
    try {
      const res = await fetch(`${API}/api/banners`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setImages(data.map(b => b.url));
        setCurrent(0);
      }
    } catch {
      // keep static fallback
    }
  };

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
      {/* Image */}
      <img src={images[current]} alt="banner" />

      {/* Arrows */}
      <button className="arrow left" onClick={prevSlide}>❮</button>
      <button className="arrow right" onClick={nextSlide}>❯</button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => goTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slideshow;
