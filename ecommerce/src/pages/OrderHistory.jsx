import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./OrderHistory.css";

const API = import.meta.env.VITE_API_URL

const STATUS_STEPS = ["paid", "received", "packed", "dispatched", "delivered"];

const STATUS_LABELS = {
  paid: "Order Placed",
  received: "Received",
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

function OrderTracker({ status }) {
  const currentIdx = STATUS_STEPS.indexOf(status);
  return (
    <div className="oh-tracker">
      {STATUS_STEPS.map((s, i) => (
        <div key={s} className={`oh-tracker-step ${i <= currentIdx ? "done" : ""} ${i === currentIdx ? "active" : ""}`}>
          <div className="oh-tracker-dot">
            <span>{STATUS_ICONS[s]}</span>
          </div>
          <div className="oh-tracker-label">{STATUS_LABELS[s]}</div>
          {i < STATUS_STEPS.length - 1 && (
            <div className={`oh-tracker-line ${i < currentIdx ? "done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`oh-card ${expanded ? "oh-card-open" : ""}`}>
      {/* Summary Row */}
      <div className="oh-card-header" onClick={() => setExpanded(e => !e)}>
        <div className="oh-card-left">
          <span className="oh-order-id">#{(order.razorpay_order_id || "").slice(-10)}</span>
          <span className="oh-date">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
              : "—"}
          </span>
        </div>
        <div className="oh-card-right">
          <span className="oh-amount">₹{parseFloat(order.total_amount || 0).toLocaleString("en-IN")}</span>
          <span className={`oh-status-badge oh-status-${order.status}`}>
            {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
          </span>
          <span className="oh-chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="oh-card-body">
          {/* Tracker */}
          <OrderTracker status={order.status} />

          <div className="oh-detail-grid">
            {/* Items */}
            <div className="oh-section">
              <h4 className="oh-section-title">Items Ordered</h4>
              <div className="oh-items-list">
                {(order.items || []).map((item, i) => (
                  <div key={i} className="oh-item-row">
                    <span className="oh-item-name">{item.name}</span>
                    <span className="oh-item-qty">× {item.quantity}</span>
                    <span className="oh-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="oh-item-row oh-total-row">
                  <span>Total</span>
                  <span></span>
                  <span className="oh-item-price">₹{parseFloat(order.total_amount || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div className="oh-section">
              <h4 className="oh-section-title">Delivery Address</h4>
              <p className="oh-delivery-addr">{order.delivery_address || "—"}</p>

              <h4 className="oh-section-title" style={{ marginTop: "1.25rem" }}>Payment</h4>
              <p className="oh-meta-row"><span>Payment ID</span><code>{order.razorpay_payment_id}</code></p>
              <p className="oh-meta-row"><span>Order ID</span><code>{order.razorpay_order_id}</code></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user === null) {
      navigate("/login?next=/orders", { replace: true });
      return;
    }
    if (!user) return; // still loading auth
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/orders/my`, {
        params: { email: user.email },
      });
      setOrders(res.data || []);
    } catch (err) {
      setError("Could not load your orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null; // auth loading

  return (
    <div className="oh-page">
      <div className="oh-container">
        <div className="oh-header">
          <h1 className="oh-title">My Orders</h1>
          <p className="oh-subtitle">{user.email}</p>
        </div>

        {loading && (
          <div className="oh-loading">
            <div className="oh-spinner" />
            <p>Loading your orders…</p>
          </div>
        )}

        {error && <div className="oh-error">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="oh-empty">
            <div className="oh-empty-icon">🛍️</div>
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you make a purchase.</p>
            <button className="oh-shop-btn" onClick={() => navigate("/products")}>
              Shop Now
            </button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="oh-list">
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
