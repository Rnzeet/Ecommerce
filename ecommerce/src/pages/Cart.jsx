import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cart, increaseQty, decreaseQty, totalPrice, clearCart,
          couponCode, setCouponCode, discount, couponApplied, couponMsg,
          applyCoupon, removeCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = totalPrice > 499 ? 0 : 49;
  const finalTotal = totalPrice - discount + shipping;
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-empty-wrapper">
        <div className="cart-empty-icon">🛒</div>
        <h2 className="cart-empty-title">Your cart is empty</h2>
        <p className="cart-empty-sub">Looks like you haven't added anything yet.</p>
        <button className="cart-shop-btn" onClick={() => navigate("/products")}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-header">
        <h1 className="cart-title">Your Cart</h1>
        <span className="cart-count">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
      </div>

      <div className="cart-layout">
        {/* Left — Items */}
        <div className="cart-items-col">
          <div className="cart-items-card">
            {cart.map((item, idx) => (
              <div key={item.id} className={`cart-item ${idx < cart.length - 1 ? "cart-item-border" : ""}`}>
                <div className="cart-item-img-wrap">
                  {item.image
                    ? <img src={item.image} alt={item.title} className="cart-item-img" />
                    : <div className="cart-item-img-placeholder">🍵</div>}
                </div>
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.title || item.name}</h3>
                  {item.category && <span className="cart-item-cat">{item.category}</span>}
                  <p className="cart-item-unit">₹{item.price} each</p>
                </div>
                <div className="cart-item-right">
                  <span className="cart-item-subtotal">₹{(item.price * item.quantity).toFixed(0)}</span>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => decreaseQty(item.id)}>−</button>
                    <span className="qty-num">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="cart-clear-btn" onClick={clearCart}>🗑 Clear Cart</button>
        </div>

        {/* Right — Summary */}
        <div className="cart-summary-col">

          {/* Coupon */}
          <div className="summary-card">
            {/* NEW10 offer banner */}
            {!couponApplied && !user?.hasOrdered && (
              <div className="coupon-offer-banner" onClick={() => { setCouponCode("NEW10"); }}>
                <div className="coupon-offer-left">
                  <span className="coupon-offer-tag">NEW USER</span>
                  <div>
                    <p className="coupon-offer-title">10% off your first order</p>
                    <p className="coupon-offer-sub">Use code <strong>NEW10</strong> at checkout</p>
                  </div>
                </div>
                <span className="coupon-offer-code">NEW10</span>
              </div>
            )}
            <h3 className="summary-section-title" style={{ marginTop: couponApplied ? 0 : 14 }}>Coupon Code</h3>
            {couponApplied ? (
              <div className="coupon-applied-row">
                <span className="coupon-applied-badge">✅ {couponApplied}</span>
                <button className="coupon-remove-btn" onClick={removeCoupon}>Remove</button>
              </div>
            ) : (
              <div className="coupon-row">
                <input
                  className="coupon-input"
                  placeholder="e.g. NEW10, TEA10"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && applyCoupon(couponCode, user?.email)}
                />
                <button className="coupon-apply-btn" onClick={() => applyCoupon(couponCode, user?.email)}>Apply</button>
              </div>
            )}
            {couponMsg && (
              <p className={`coupon-msg coupon-msg-${couponMsg.type}`}>{couponMsg.text}</p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="summary-card">
            <h3 className="summary-section-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal ({itemCount} items)</span>
              <span>₹{totalPrice.toFixed(0)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row summary-discount">
                <span>Coupon Discount</span>
                <span>−₹{discount.toFixed(0)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span className={shipping === 0 ? "summary-free" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="free-shipping-hint">Add ₹{(499 - totalPrice + 1).toFixed(0)} more for free shipping</p>
            )}
            <div className="summary-divider" />
            <div className="summary-row summary-total">
              <span>Total</span>
              <span>₹{finalTotal.toFixed(0)}</span>
            </div>

            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout →
            </button>
            <button className="continue-btn" onClick={() => navigate("/products")}>
              ← Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
