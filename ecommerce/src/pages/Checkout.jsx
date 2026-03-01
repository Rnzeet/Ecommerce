import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./Checkout.css";

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
    <div className="checkout-container">
      <h2>Checkout</h2>

      <h3>Total: ₹{totalPrice}</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          required
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Delivery Address"
          required
          onChange={handleChange}
        />

        <button type="submit">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;
