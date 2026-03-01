import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Checkout from "./pages/Checkout";

function App() {
  return (
    <>
      {/* Header stays fixed at top */}
      <Header />

      {/* Main content pushed below header */}
      <main style={{ marginTop: "80px", padding: "0 10px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <ToastContainer 
        position="top-right"
        autoClose={2000}
        theme="colored"
      />
    </>
  );
}

export default App;
