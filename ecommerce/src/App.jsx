import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Header from "./components/Header";

function App() {
  return (
    <>
      {/* 👇 Header is now global */}
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>

      <ToastContainer 
        position="top-right"
        autoClose={2000}
        theme="colored"
      />
    </>
  );
}

export default App;
