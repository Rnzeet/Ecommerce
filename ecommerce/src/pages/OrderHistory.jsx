import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./OrderHistory.css";

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

function OrderTracker({ status }) {
  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="oh-tracker">
      {STATUS_STEPS.map((step, index) => (
        <div
          key={step}
          className={`oh-tracker-step${index <= currentIdx ? " done" : ""}${index === currentIdx ? " active" : ""}`}
        >
          <div className="oh-tracker-dot">
            <span>{STATUS_ICONS[step]}</span>
          </div>
          <p className="oh-tracker-label">{STATUS_LABELS[step]}</p>
          {index < STATUS_STEPS.length - 1 && (
            <div className={`oh-tracker-line${index < currentIdx ? " done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const statusIdx = Math.max(STATUS_STEPS.indexOf(order.status), 0);

  return (
    <article className={`oh-card${expanded ? " oh-card--open" : ""}`}>
      <button className="oh-card-header" onClick={() => setExpanded((v) => !v)}>
        <div className="oh-card-left">
          <span className="oh-order-id">#{(order.razorpay_order_id || "").slice(-10)}</span>
          <span className="oh-date">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </span>
        </div>

        <div className="oh-card-right">
          <span className="oh-amount">₹{parseFloat(order.total_amount || 0).toLocaleString("en-IN")}</span>
          <span className={`oh-status-badge oh-status-${order.status}`}>
            {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
          </span>
          <span className="oh-chevron">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      <div className="oh-progress-track">
        <div
          className="oh-progress-fill"
          style={{ width: `${((statusIdx + 1) / STATUS_STEPS.length) * 100}%` }}
        />
      </div>

      {expanded && (
        <div className="oh-card-body">
          <OrderTracker status={order.status} />

          <div className="oh-detail-grid">
            <section className="oh-section">
              <h4 className="oh-section-title">Items Ordered</h4>
              <div className="oh-items-list">
                {(order.items || []).map((item, index) => (
                  <div key={index} className="oh-item-row">
                    <span className="oh-item-name">{item.name}</span>
                    <span className="oh-item-qty">x {item.quantity}</span>
                    <span className="oh-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
                <div className="oh-item-row oh-total-row">
                  <span>Total</span>
                  <span />
                  <span className="oh-item-price">₹{parseFloat(order.total_amount || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </section>

            <section className="oh-section">
              <h4 className="oh-section-title">Delivery Address</h4>
              <p className="oh-delivery-addr">{order.delivery_address || "-"}</p>

              <h4 className="oh-section-title" style={{ marginTop: "1.2rem" }}>Payment</h4>
              <p className="oh-meta-row"><span>Payment ID</span><code>{order.razorpay_payment_id || "-"}</code></p>
              <p className="oh-meta-row"><span>Order ID</span><code>{order.razorpay_order_id || "-"}</code></p>
              <p className="oh-meta-row"><span>Tracking Number</span><code>{order.tracking_number || "Pending"}</code></p>

              <p className="oh-track-link-row">
                {/* <Link
                  className="oh-track-link"
                  to={`/track?orderId=${encodeURIComponent(order.razorpay_order_id || "")}&email=${encodeURIComponent(order.customer_email || "")}`}
                >
                  Track this order
                </Link> */}
              </p>
            </section>
          </div>
          <div><p><text>You will get tracking via mail/message once product is dispatch</text></p></div>
        </div>
      )}
    </article>
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
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/orders/my`, {
          params: { email: user.email },
        });
        setOrders(res.data || []);
      } catch {
        setError("Could not load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  const totalSpent = orders.reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0);

  return (
    <div className="oh-page">
      <div className="oh-container">
        <header className="oh-header">
          <div>
            <h1 className="oh-title">My Orders</h1>
            <p className="oh-subtitle">{user.email}</p>
          </div>

          {orders.length > 0 && (
            <div className="oh-summary">
              <div className="oh-summary-item">
                <span className="oh-summary-num">{orders.length}</span>
                <span className="oh-summary-lbl">Orders</span>
              </div>
              <div className="oh-summary-item">
                <span className="oh-summary-num">₹{totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                <span className="oh-summary-lbl">Total Spent</span>
              </div>
            </div>
          )}
        </header>

        {loading && (
          <div className="oh-loading">
            <div className="oh-spinner" />
            <p>Loading your orders...</p>
          </div>
        )}

        {error && <div className="oh-error">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="oh-empty">
            <div className="oh-empty-icon">🛍️</div>
            <h3>No orders yet</h3>
            <p>Your orders will appear here once you make a purchase.</p>
            <button className="oh-shop-btn" onClick={() => navigate("/products")}>Shop Now</button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="oh-list">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderHistory;
