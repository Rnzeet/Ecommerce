import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();
const API = import.meta.env.VITE_API_URL;

export function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Coupon state — shared between Cart and Checkout
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [couponMsg, setCouponMsg] = useState(null);

  // ✅ Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const applyCoupon = async (code, userEmail) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    try {
      const res = await axios.post(`${API}/api/coupons/validate`, { code: trimmed, userEmail });
      if (res.data.valid) {
        const saving = totalPrice * res.data.discount;
        setDiscount(saving);
        setCouponApplied(res.data.code);
        setCouponCode("");
        setCouponMsg({ type: "success", text: `"${res.data.code}" applied — you save ₹${saving.toFixed(0)}!` });
      } else {
        setDiscount(0);
        setCouponApplied("");
        setCouponMsg({ type: "error", text: res.data.message || "Invalid coupon code" });
      }
    } catch {
      setCouponMsg({ type: "error", text: "Could not validate coupon. Try again." });
    }
  };

  const removeCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    setCouponApplied("");
    setCouponMsg(null);
  };

  const clearCart = () => {
    setCart([]);
    removeCoupon();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        totalPrice,
        clearCart,
        couponCode,
        setCouponCode,
        discount,
        couponApplied,
        couponMsg,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
