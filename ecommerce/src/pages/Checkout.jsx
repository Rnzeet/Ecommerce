import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Checkout.css";

const API = import.meta.env.VITE_API_URL || "https://ecommerce-19y4.onrender.com";
const RZP_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const STEPS = ["Delivery", "Payment"];

function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      navigate("/login?next=/checkout", { replace: true });
    }
  }, [user, navigate]);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null); // { orderId, paymentId }

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "",
  });

  const shipping = totalPrice > 499 ? 0 : 49;
  const finalTotal = totalPrice + shipping;
  const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validateDelivery = () => {
    const { name, email, phone, address, city, pincode } = form;
    if (!name || !email || !phone || !address || !city || !pincode) {
      setError("Please fill all required fields.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) { setError("Enter a valid 10-digit phone number."); return false; }
    if (!/^\d{6}$/.test(pincode)) { setError("Enter a valid 6-digit pincode."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return false; }
    setError(""); return true;
  };

  const handlePayment = async () => {
    if (cart.length === 0) { setError("Your cart is empty."); return; }
    setLoading(true);
    setError("");

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      setError("Failed to load payment gateway. Check your internet connection.");
      setLoading(false);
      return;
    }

    try {
      const { data: order } = await axios.post(`${API}/api/orders/create`, { amount: finalTotal });

      const options = {
        key: RZP_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "MyTeaStore",
        description: `Order of ${itemCount} item${itemCount !== 1 ? "s" : ""}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const { data } = await axios.post(`${API}/api/orders/verify`, {
              ...response,
              customerInfo: form,
              items: cart.map(i => ({ id: i.id, name: i.title || i.name, price: i.price, quantity: i.quantity, category: i.category })),
              totalAmount: finalTotal,
            });
            if (data.success) {
              clearCart();
              setSuccess({ orderId: order.id, paymentId: data.paymentId });
            } else {
              setError("Payment verification failed. Contact support.");
            }
          } catch {
            setError("Payment verification error. Contact support.");
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { address: `${form.address}, ${form.city}, ${form.pincode}` },
        theme: { color: "#4f46e5" },
        modal: { ondismiss: () => setLoading(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setError(`Payment failed: ${resp.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || "Could not initiate payment. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success Screen ──
  if (success) {
    return (
      <div className="chk-success-wrapper">
        <div className="chk-success-card">
          <div className="chk-success-icon">✅</div>
          <h2 className="chk-success-title">Order Confirmed!</h2>
          <p className="chk-success-sub">Thank you, {form.name}! Your order has been placed successfully.</p>
          <div className="chk-success-ids">
            <div className="chk-id-row"><span>Order ID</span><code>{success.orderId}</code></div>
            <div className="chk-id-row"><span>Payment ID</span><code>{success.paymentId}</code></div>
          </div>
          <p className="chk-success-note">A confirmation will be sent to <strong>{form.email}</strong></p>
          <button className="chk-home-btn" onClick={() => navigate("/")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="chk-wrapper">
      <div className="chk-header">
        <h1 className="chk-title">Checkout</h1>
        {/* Stepper */}
        <div className="chk-stepper">
          {STEPS.map((s, i) => (
            <div key={s} className="chk-step-wrap">
              <div className={`chk-step ${i < step ? "chk-step-done" : i === step ? "chk-step-active" : ""}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`chk-step-label ${i === step ? "chk-step-label-active" : ""}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`chk-step-line ${i < step ? "chk-step-line-done" : ""}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="chk-layout">
        {/* ── Left ── */}
        <div className="chk-main">

          {/* Step 0 – Delivery */}
          {step === 0 && (
            <div className="chk-card">
              <h2 className="chk-card-title">📦 Delivery Details</h2>
              {error && <div className="chk-error">{error}</div>}

              <div className="chk-field-row">
                <div className="chk-field">
                  <label>Full Name *</label>
                  <input name="name" placeholder="Rahul Sharma" value={form.name} onChange={handleChange} />
                </div>
                <div className="chk-field">
                  <label>Phone *</label>
                  <input name="phone" placeholder="10-digit mobile" value={form.phone} onChange={handleChange} maxLength={10} />
                </div>
              </div>

              <div className="chk-field">
                <label>Email *</label>
                <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
              </div>

              <div className="chk-field">
                <label>Address *</label>
                <input name="address" placeholder="Flat / House No, Street, Area" value={form.address} onChange={handleChange} />
              </div>

              <div className="chk-field-row">
                <div className="chk-field">
                  <label>City *</label>
                  <input name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} />
                </div>
                <div className="chk-field">
                  <label>State</label>
                  <input name="state" placeholder="Maharashtra" value={form.state} onChange={handleChange} />
                </div>
                <div className="chk-field chk-field-sm">
                  <label>Pincode *</label>
                  <input name="pincode" placeholder="400001" value={form.pincode} onChange={handleChange} maxLength={6} />
                </div>
              </div>

              <button className="chk-next-btn" onClick={() => { if (validateDelivery()) setStep(1); }}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step 1 – Payment */}
          {step === 1 && (
            <div className="chk-card">
              <h2 className="chk-card-title">💳 Payment</h2>
              {error && <div className="chk-error">{error}</div>}

              {/* Delivery summary */}
              <div className="chk-delivery-review">
                <div className="chk-review-row"><span>📍</span><span>{form.address}, {form.city}{form.state ? `, ${form.state}` : ""} – {form.pincode}</span></div>
                <div className="chk-review-row"><span>📞</span><span>{form.phone}</span></div>
                <div className="chk-review-row"><span>✉️</span><span>{form.email}</span></div>
                <button className="chk-edit-link" onClick={() => { setStep(0); setError(""); }}>Edit</button>
              </div>

              <div className="chk-payment-methods">
                <div className="chk-method-card chk-method-active">
                  <span className="chk-method-icon">⚡</span>
                  <div>
                    <p className="chk-method-name">Razorpay</p>
                    <p className="chk-method-sub">UPI · Cards · Net Banking · Wallets</p>
                  </div>
                  <span className="chk-method-check">●</span>
                </div>
              </div>

              <div className="chk-secure-note">
                🔒 Payments are 256-bit SSL encrypted and secured by Razorpay.
              </div>

              <button className="chk-pay-btn" onClick={handlePayment} disabled={loading}>
                {loading ? <span className="chk-spinner" /> : `Pay ₹${finalTotal.toFixed(0)} →`}
              </button>
              <button className="chk-back-btn" onClick={() => { setStep(0); setError(""); }}>← Back</button>
            </div>
          )}
        </div>

        {/* ── Right – Order Summary ── */}
        <div className="chk-summary">
          <div className="chk-summary-card">
            <h3 className="chk-summary-title">Order Summary</h3>
            <div className="chk-summary-items">
              {cart.map((item) => (
                <div key={item.id} className="chk-summary-item">
                  <div className="chk-s-img-wrap">
                    {item.image
                      ? <img src={item.image} alt={item.title} className="chk-s-img" />
                      : <div className="chk-s-img-ph">🍵</div>}
                    <span className="chk-s-qty-badge">{item.quantity}</span>
                  </div>
                  <div className="chk-s-info">
                    <p className="chk-s-name">{item.title || item.name}</p>
                    {item.category && <span className="chk-s-cat">{item.category}</span>}
                  </div>
                  <span className="chk-s-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="chk-summary-rows">
              <div className="chk-s-row"><span>Subtotal ({itemCount} items)</span><span>₹{totalPrice.toFixed(0)}</span></div>
              <div className="chk-s-row"><span>Shipping</span><span className={shipping === 0 ? "chk-free" : ""}>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
              <div className="chk-s-divider" />
              <div className="chk-s-row chk-s-total"><span>Total</span><span>₹{finalTotal.toFixed(0)}</span></div>
            </div>
            {shipping > 0 && (
              <p className="chk-free-hint">Add ₹{(500 - totalPrice).toFixed(0)} more for free shipping</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
