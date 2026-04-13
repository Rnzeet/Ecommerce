import { useState, useEffect } from "react";
import FloatingChat from "./FloatingChat";
import "./FloatingActions.css";

function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      {/* AI Chat widget (self-contained, positioned fixed bottom-right) */}
      <FloatingChat />

      {/* Back to top */}
      <button
        className={`fab fab-top${showTop ? " fab-top--visible" : ""}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </>
  );
}

export default FloatingActions;
