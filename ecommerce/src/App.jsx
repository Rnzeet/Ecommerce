import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Header from "./components/Header";
import Checkout from "./pages/Checkout";
import Products from "./pages/Products";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import OrderHistory from "./pages/OrderHistory";
import TrackOrder from "./pages/TrackOrder";
import ProtectedRoute from "./components/ProtectedRoute";
import FloatingActions from "./components/FloatingActions";

// Hide header on admin pages
function AppContent() {
  const location = useLocation();
  const isAdminPage =
    location.pathname === "/admin" || location.pathname === "/admin-login";

  return (
    <>
      {/* Hide header on admin pages */}
      {!isAdminPage && <Header />}

      <main style={{ marginTop: isAdminPage ? "0" : "80px", padding: "0 10px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />
      {!isAdminPage && <FloatingActions />}
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
