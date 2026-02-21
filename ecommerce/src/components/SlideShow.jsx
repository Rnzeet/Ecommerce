import { useState, useEffect } from "react";
import "./SlideShow.css";

import banner1 from "../assets/image3.jpg";
import banner2 from "../assets/image2.jpg";
import banner3 from "../assets/download.jpg";
import banner4 from "../assets/image4.jpg";

function Slideshow() {
  const images = [banner1, banner2, banner3];

  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="slideshow">
      {/* Image */}
      <img src={images[current]} alt="banner" />

      {/* Arrows */}
      <button className="arrow left" onClick={prevSlide}>
        ❮
      </button>
      <button className="arrow right" onClick={nextSlide}>
        ❯
      </button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === current ? "dot active" : "dot"}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Slideshow;
