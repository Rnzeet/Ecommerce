import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "./TrackOrder.css";

const API = import.meta.env.VITE_API_URL;

const STATUS_STEPS = ["paid", "received", "packed", "dispatched", "delivered"];
const STATUS_LABELS = {
  paid: "Order Placed",
  received: "Confirmed",
  packed: "Packed",
  dispatched: "Dispatched",
  delivered: "Delivered",
};
const STATUS_ICONS = {
  paid: "🛒",
  received: "✅",
  packed: "📦",
  dispatched: "🚚",
  delivered: "🏠",
};
const STATUS_DESC = {
  paid: "Your order has been placed and payment received.",
  received: "We've received your order and are preparing it.",
  packed: "Your order is packed and ready to ship.",
  dispatched: "Your order is on its way!",
  delivered: "Your order has been delivered. Enjoy your tea! 🍵",
};

function TrackTimeline({ status, trackingNumber }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="to-timeline">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className={`to-step${i <= currentIdx ? " done" : ""}${i === currentIdx ? " active" : ""}`}>
          {/* connector */}
          {i > 0 && <div className={`to-connector${i <= currentIdx ? " done" : ""}`} />}
          <div className="to-dot">
            <span className="to-dot-icon">{STATUS_ICONS[s]}</span>
          </div>
          <div className="to-step-info">
            <p className="to-step-label">{STATUS_LABELS[s]}</p>
            {i === currentIdx && <p className="to-step-desc">{STATUS_DESC[s]}</p>}
            {i === currentIdx && s === "dispatched" && trackingNumber && (
              <p className="to-tracking-num">Tracking: <code>{trackingNumber}</code></p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!orderId.trim() || !email.trim()) {
      setError("Please enter both Order ID and email.");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const { data } = await axios.get(`${API}/api/orders/track`, {
        params: { orderId: orderId.trim(), email: email.trim() },
      });
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || "Order not found. Please check your Order ID and email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="to-page">
      <div className="to-container">
        {/* Header */}
        <div className="to-header">
          <h1 className="to-title">Track Your Order</h1>
          <p className="to-sub">Enter your Order ID and email to see real-time status</p>
        </div>

        {/* Search Form */}
        <form className="to-form" onSubmit={handleTrack}>
          <div className="to-form-row">
            <div className="to-form-group">
              <label className="to-label">Order ID</label>
              <input
                className="to-input"
                placeholder="e.g. order_Qkx..."
                value={orderId}
                onChange={e => setOrderId(e.target.value)}
                autoComplete="off"
              />
              <span className="to-hint">Find this in your order confirmation email</span>
            </div>
            <div className="to-form-group">
              <label className="to-label">Email Address</label>
              <input
                className="to-input"
                type="email"
                placeholder="e.g. you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <span className="to-hint">Email used at checkout</span>
            </div>
          </div>
          <button className="to-btn" type="submit" disabled={loading}>
            {loading ? <span className="to-spinner" /> : "🔍 Track Order"}
          </button>
        </form>

        {/* Error */}
        {error && <div className="to-error">{error}</div>}

        {/* Result */}
        {order && (
          <div className="to-result">
            <div className="to-result-header">
              <div className="to-result-meta">
                <p className="to-result-id">#{(order.razorpay_order_id || "").slice(-12)}</p>
                <p className="to-result-date">
                  {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : ""}
                </p>
              </div>
              <div className="to-result-right">
                <span className="to-amount">₹{parseFloat(order.total_amount || 0).toLocaleString("en-IN")}</span>
                <span className={`to-status-badge to-status-${order.status}`}>
                  {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <TrackTimeline status={order.status} trackingNumber={order.tracking_number} />

            {/* Items summary */}
            <div className="to-items">
              <h4 className="to-items-title">Items</h4>
              {(order.items || []).map((item, i) => (
                <div key={i} className="to-item-row">
                  <span>{item.name}</span>
                  <span>× {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>

            {order.delivery_address && (
              <div className="to-address">
                <span className="to-address-label">📍 Delivery Address</span>
                <p>{order.delivery_address}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackOrder;
