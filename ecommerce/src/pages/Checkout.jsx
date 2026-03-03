import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
 import "./Checkout.css";

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    alert("Order placed successfully 🎉");

    clearCart();
    navigate("/");
  };

  return (
  <div className="checkout-wrapper">
    <div className="checkout-container">

      {/* Left Side - Form */}
      <div className="checkout-form">
        <h2>Checkout</h2>

        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            required
            onChange={handleChange}
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            onChange={handleChange}
          />

          <label>Delivery Address</label>
          <textarea
            name="address"
            placeholder="Enter delivery address"
            required
            onChange={handleChange}
          />

          <button type="submit" className="place-order-btn">
            Place Order
          </button>
        </form>
      </div>

      {/* Right Side - Order Summary */}
      <div className="checkout-summary">
        <h3>Order Summary</h3>

        {cart.map((item) => (
          <div key={item.id} className="summary-item">
            <span>{item.title} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}

        <hr />

        <div className="summary-total">
          <h3>Total</h3>
          <h3>₹{totalPrice}</h3>
        </div>
      </div>

    </div>
  </div>
);

}

export default Checkout;
