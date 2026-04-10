
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const API = import.meta.env.VITE_API_URL;
const CATEGORIES_KEY = "myteastore_categories";

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [newCategory, setNewCategory] = useState("");
  const [banners, setBanners] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerUploading, setBannerUploading] = useState(false);
  const [categories, setCategories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CATEGORIES_KEY)) || [];
    } catch { return []; }
  });
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [form, setForm] = useState({
    name: "", price: "", image: "", category: "", description: "", imageName: "",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
      // Auto-sync categories from existing products
      setCategories(prev => {
        const fromProducts = res.data.map(p => p.category).filter(Boolean);
        const merged = [...new Set([...prev, ...fromProducts])];
        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(merged));
        return merged;
      });
    } catch {
      showToast("Failed to fetch products", "error");
    }
  };

  useEffect(() => { fetchProducts(); fetchBanners(); fetchOrders(); }, []);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await axios.get(`${API}/api/orders`);
      setOrders(res.data || []);
    } catch {
      // silent — orders table may not exist yet
    } finally {
      setOrdersLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${API}/api/orders/${id}/status`, { status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: res.data.status } : o));
      showToast(`Order marked as "${status}"`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API}/api/banners`);
      setBanners(res.data);
    } catch {
      // silent — banners table may not exist yet
    }
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleBannerUpload = async () => {
    if (!bannerFile) { showToast("Please select an image", "error"); return; }
    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("banner", bannerFile);
      await axios.post(`${API}/api/banners/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Banner uploaded successfully");
      setBannerFile(null);
      setBannerPreview(null);
      fetchBanners();
    } catch (err) {
      showToast("Upload failed: " + (err.response?.data?.message || err.message), "error");
    } finally {
      setBannerUploading(false);
    }
  };

  const handleBannerDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/banners/${encodeURIComponent(id)}`);
      showToast("Banner removed");
      fetchBanners();
    } catch (err) {
      showToast("Delete failed: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, imageName: file.name }));
  };

  const resetForm = () => {
    setForm({ name: "", price: "", image: "", category: "", description: "", imageName: "" });
    setImageFile(null);
    setImagePreview(null);
    setEditId(null);
  };

  const handleAdd = async () => {
    if (!form.name || !form.price) {
      showToast("Name and price are required", "error");
      return;
    }
    setUploading(true);
    try {
      let imageUrl = form.image;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await axios.post(`${API}/api/products/upload-image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.url;
      }
      const payload = {
        name: form.name, price: form.price, image: imageUrl,
        category: form.category, description: form.description,
      };
      if (editId) {
        await axios.put(`${API}/api/products/update-product/${editId}`, payload);
        showToast("Product updated successfully");
      } else {
        await axios.post(`${API}/api/products/add-product`, payload);
        showToast("Product added successfully");
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      showToast("Failed to save product. " + (err.response?.data?.message || err.message), "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, price: p.price, image: p.image, category: p.category, description: p.description || "", imageName: "" });
    setImagePreview(p.image || null);
    setEditId(p.id);
    setActiveTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/products/delete-product/${id}`);
      showToast("Product deleted");
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      showToast("Category already exists", "error");
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    setNewCategory("");
    showToast(`Category "${trimmed}" added`);
  };

  const handleDeleteCategory = (cat) => {
    const usedBy = products.filter(p => p.category === cat).length;
    if (usedBy > 0) {
      showToast(`Cannot delete — ${usedBy} product(s) use this category`, "error");
      return;
    }
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));
    showToast(`Category "${cat}" removed`);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login");
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-wrapper">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🍵</span>
          <span className="logo-text">MyTeaStore</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">OVERVIEW</div>
          <div className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
            <span className="nav-icon">📊</span> Dashboard
          </div>
          <div className={`nav-item ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>
            <span className="nav-icon">📋</span> Orders
          </div>
          <div className="nav-label" style={{ marginTop: 12 }}>MANAGEMENT</div>
          <div className={`nav-item ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
            <span className="nav-icon">📦</span> Products
          </div>
          <div className={`nav-item ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
            <span className="nav-icon">🏷️</span> Categories
          </div>
          <div className={`nav-item ${activeTab === "banners" ? "active" : ""}`} onClick={() => setActiveTab("banners")}>
            <span className="nav-icon">🖼️</span> Banners
          </div>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}>
          <span>⏻</span> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="admin-main">

        {/* Topbar */}
        <header className="admin-topbar">
          <div>
            <h1 className="topbar-title">
              {activeTab === "dashboard" ? "Dashboard" : activeTab === "orders" ? "Orders" : activeTab === "categories" ? "Category Management" : activeTab === "banners" ? "Banner Management" : "Product Management"}
            </h1>
            <p className="topbar-sub">
              {activeTab === "dashboard" ? "Store overview and revenue statistics" : activeTab === "orders" ? "View all customer orders" : activeTab === "categories" ? "Manage store categories" : activeTab === "banners" ? "Upload and manage homepage banners" : "Manage your store inventory"}
            </p>
          </div>
          <div className="topbar-stats">
            <div className="stat-chip">
              <span className="stat-num">{products.length}</span>
              <span className="stat-lbl">Products</span>
            </div>
            <div className="stat-chip">
              <span className="stat-num">{categories.length}</span>
              <span className="stat-lbl">Categories</span>
            </div>
          </div>
        </header>

        {/* ── DASHBOARD TAB ── */}
        {activeTab === "dashboard" && (() => {
          const totalRevenue = orders.reduce((s, o) => s + (parseFloat(o.total_amount) || 0), 0);
          const paidOrders = orders.filter(o => o.status === "paid");
          const avgOrder = paidOrders.length ? totalRevenue / paidOrders.length : 0;
          // Top products by revenue
          const productMap = {};
          orders.forEach(o => {
            (o.items || []).forEach(item => {
              const k = item.name || item.id;
              if (!productMap[k]) productMap[k] = { name: k, qty: 0, revenue: 0 };
              productMap[k].qty += item.quantity || 1;
              productMap[k].revenue += (item.price || 0) * (item.quantity || 1);
            });
          });
          const topProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
          return (
            <>
              {/* Stat cards */}
              <div className="dash-stats-grid">
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: "#eef2ff" }}>💰</div>
                  <div>
                    <p className="dash-stat-label">Total Revenue</p>
                    <p className="dash-stat-value">₹{totalRevenue.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: "#f0fdf4" }}>📋</div>
                  <div>
                    <p className="dash-stat-label">Total Orders</p>
                    <p className="dash-stat-value">{orders.length}</p>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: "#fff7ed" }}>📦</div>
                  <div>
                    <p className="dash-stat-label">Products Listed</p>
                    <p className="dash-stat-value">{products.length}</p>
                  </div>
                </div>
                <div className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: "#fdf4ff" }}>🧾</div>
                  <div>
                    <p className="dash-stat-label">Avg Order Value</p>
                    <p className="dash-stat-value">₹{avgOrder.toFixed(0)}</p>
                  </div>
                </div>
              </div>

              {/* Recent orders + top products */}
              <div className="dash-bottom-grid">
                <section className="admin-card">
                  <div className="card-header"><h2 className="card-title">Recent Orders</h2>
                    <button className="btn btn-sm btn-ghost" onClick={() => setActiveTab("orders")}>View All →</button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="empty-row">No orders yet.</p>
                  ) : (
                    <div className="table-wrap">
                      <table className="admin-table">
                        <thead><tr><th>Customer</th><th>Amount</th><th>Items</th><th>Status</th><th>Date</th></tr></thead>
                        <tbody>
                          {orders.slice(0, 5).map(o => (
                            <tr key={o.id}>
                              <td><span className="product-name">{o.customer_name || "—"}</span><p className="product-desc">{o.customer_email}</p></td>
                              <td className="price-cell">₹{parseFloat(o.total_amount || 0).toLocaleString("en-IN")}</td>
                              <td>{(o.items || []).length} item{(o.items || []).length !== 1 ? "s" : ""}</td>
                              <td><span className="order-status-badge order-status-paid">{o.status}</span></td>
                              <td className="order-date">{o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section className="admin-card">
                  <div className="card-header"><h2 className="card-title">Top Products</h2></div>
                  {topProducts.length === 0 ? (
                    <p className="empty-row">No sales data yet.</p>
                  ) : (
                    <div className="top-products-list">
                      {topProducts.map((p, i) => {
                        const maxRev = topProducts[0].revenue;
                        const pct = maxRev ? Math.round((p.revenue / maxRev) * 100) : 0;
                        return (
                          <div key={p.name} className="top-product-row">
                            <span className="top-product-rank">#{i + 1}</span>
                            <div className="top-product-info">
                              <div className="top-product-name-row">
                                <span className="top-product-name">{p.name}</span>
                                <span className="top-product-revenue">₹{p.revenue.toLocaleString("en-IN")}</span>
                              </div>
                              <div className="top-product-bar-wrap">
                                <div className="top-product-bar" style={{ width: `${pct}%` }} />
                              </div>
                              <span className="top-product-qty">{p.qty} sold</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>
            </>
          );
        })()}

        {/* ── ORDERS TAB ── */}
        {activeTab === "orders" && (
          <section className="admin-card">
            <div className="card-header">
              <h2 className="card-title">All Orders</h2>
              <span className="cat-count-badge">{orders.length} total</span>
            </div>
            {ordersLoading ? (
              <p className="empty-row">Loading orders...</p>
            ) : orders.length === 0 ? (
              <p className="empty-row">No orders yet. Orders will appear here after successful payments.</p>
            ) : (
              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Update Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => {
                      const STATUS_FLOW = ["received", "packed", "dispatched", "delivered"];
                      const currentIdx = STATUS_FLOW.indexOf(o.status);
                      const nextStatus = STATUS_FLOW[currentIdx + 1] || null;
                      const prevStatus = currentIdx > 0 ? STATUS_FLOW[currentIdx - 1] : (o.status === "received" ? "paid" : null);
                      const canAdvance = o.status !== "delivered";
                      const isNew = o.status === "paid";
                      return (
                        <tr key={o.id}>
                          <td><code className="order-id-code">{(o.razorpay_order_id || "").slice(-10)}</code></td>
                          <td><span className="product-name">{o.customer_name || "—"}</span><p className="product-desc">{o.customer_email}</p></td>
                          <td className="order-date">{o.customer_phone || "—"}</td>
                          <td><p className="product-desc" style={{ maxWidth: 180 }}>{o.delivery_address || "—"}</p></td>
                          <td>
                            {(o.items || []).map((item, i) => (
                              <div key={i} className="order-item-chip">{item.name} × {item.quantity}</div>
                            ))}
                          </td>
                          <td className="price-cell">₹{parseFloat(o.total_amount || 0).toLocaleString("en-IN")}</td>
                          <td><span className={`order-status-badge order-status-${o.status}`}>{o.status}</span></td>
                          <td>
                            <div className="order-action-btns">
                              {isNew && (
                                <button className="btn btn-sm order-btn-received" onClick={() => updateOrderStatus(o.id, "received")}>
                                  ✅ Received
                                </button>
                              )}
                              {!isNew && canAdvance && nextStatus && (
                                <button className="btn btn-sm order-btn-advance" onClick={() => updateOrderStatus(o.id, nextStatus)}>
                                  ▶ {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                                </button>
                              )}
                              {!isNew && prevStatus && o.status !== "delivered" && (
                                <button className="btn btn-sm order-btn-back" onClick={() => updateOrderStatus(o.id, prevStatus)}>
                                  ◀ Undo
                                </button>
                              )}
                              {o.status === "delivered" && (
                                <span className="order-delivered-tag">✅ Delivered</span>
                              )}
                            </div>
                          </td>
                          <td className="order-date">{o.created_at ? new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── CATEGORIES TAB ── */}
        {activeTab === "categories" && (
          <>
            <section className="admin-card">
              <div className="card-header">
                <h2 className="card-title">➕ Add New Category</h2>
              </div>
              <div className="cat-add-row">
                <input
                  className="form-input"
                  placeholder="e.g. Green Tea, Herbal, Accessories..."
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAddCategory()}
                />
                <button className="btn btn-primary" onClick={handleAddCategory}>Add Category</button>
              </div>
            </section>

            <section className="admin-card">
              <div className="card-header">
                <h2 className="card-title">All Categories</h2>
                <span className="cat-count-badge">{categories.length} total</span>
              </div>
              {categories.length === 0 ? (
                <p className="empty-row">No categories yet. Add one above.</p>
              ) : (
                <div className="cat-grid">
                  {categories.map((cat) => {
                    const count = products.filter(p => p.category === cat).length;
                    return (
                      <div key={cat} className="cat-card">
                        <div className="cat-card-left">
                          <span className="cat-icon">🏷️</span>
                          <div>
                            <span className="cat-name">{cat}</span>
                            <span className="cat-product-count">{count} product{count !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteCategory(cat)}
                          title={count > 0 ? "Cannot delete — products assigned" : "Delete category"}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {/* ── PRODUCTS TAB ── */}
        {activeTab === "products" && (
          <>
            {/* Form Card */}
            <section className="admin-card">
              <div className="card-header">
                <h2 className="card-title">{editId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
                {editId && <button className="btn btn-ghost" onClick={resetForm}>Cancel Edit</button>}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Product Name *</label>
                  <input className="form-input" name="name" placeholder="e.g. Chamomile Tea" value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input className="form-input" name="price" type="number" placeholder="e.g. 299" value={form.price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" name="category" value={form.category} onChange={handleChange}>
                    <option value="">— Select a category —</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <span className="form-hint">
                      No categories yet —{" "}
                      <button type="button" className="link-btn" onClick={() => setActiveTab("categories")}>create one first</button>
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <label className="file-upload-label">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="file-input-hidden" />
                    <span className="file-upload-btn">📁 Choose Image</span>
                    {form.imageName && <span className="file-name-tag">{form.imageName}</span>}
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "16px" }}>
                <label className="form-label">Description</label>
                <textarea className="form-input form-textarea" name="description" placeholder="Brief product description..." value={form.description} onChange={handleChange} />
              </div>

              {imagePreview && (
                <div className="image-preview-wrap">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <span className="preview-label">Image Preview</span>
                </div>
              )}

              <div className="form-actions">
                <button className={`btn ${editId ? "btn-warning" : "btn-primary"}`} onClick={handleAdd} disabled={uploading}>
                  {uploading ? "⏳ Saving..." : editId ? "Update Product" : "Add Product"}
                </button>
                {editId && <button className="btn btn-ghost" onClick={resetForm}>Cancel</button>}
              </div>
            </section>

            {/* Products Table */}
            <section className="admin-card">
              <div className="card-header">
                <h2 className="card-title">All Products</h2>
                <input
                  className="search-input"
                  placeholder="🔍 Search by name or category..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan="5" className="empty-row">No products found</td></tr>
                    ) : filtered.map((p) => (
                      <tr key={p.id}>
                        <td>
                          {p.image
                            ? <img src={p.image} alt={p.name} className="table-img" />
                            : <div className="table-img-placeholder">🍵</div>}
                        </td>
                        <td>
                          <span className="product-name">{p.name}</span>
                          {p.description && <p className="product-desc">{p.description}</p>}
                        </td>
                        <td><span className="category-badge">{p.category || "—"}</span></td>
                        <td className="price-cell">₹{p.price}</td>
                        <td>
                          <div className="action-btns">
                            <button className="btn btn-sm btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => setDeleteConfirm(p.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ── BANNERS TAB ── */}
        {activeTab === "banners" && (
          <>
            <section className="admin-card">
              <div className="card-header">
                <h2 className="card-title">🖼️ Upload New Banner</h2>
                <span className="cat-count-badge">{banners.length} banner{banners.length !== 1 ? "s" : ""}</span>
              </div>
              <p className="form-hint" style={{ marginBottom: 16 }}>
                Recommended size: <strong>1400 × 500px</strong> (wide landscape). Banners appear in the homepage slideshow.
              </p>

              <div className="banner-upload-zone">
                <label className="banner-drop-label">
                  <input type="file" accept="image/*" className="file-input-hidden" onChange={handleBannerFileChange} />
                  {bannerPreview ? (
                    <img src={bannerPreview} alt="Preview" className="banner-preview-img" />
                  ) : (
                    <div className="banner-drop-placeholder">
                      <span className="banner-drop-icon">🖼️</span>
                      <span className="banner-drop-text">Click to select a banner image</span>
                      <span className="banner-drop-sub">PNG, JPG, WEBP up to 10MB</span>
                    </div>
                  )}
                </label>
              </div>

              <div className="form-actions" style={{ marginTop: 16 }}>
                <button className="btn btn-primary" onClick={handleBannerUpload} disabled={bannerUploading || !bannerFile}>
                  {bannerUploading ? "⏳ Uploading..." : "Upload Banner"}
                </button>
                {bannerPreview && (
                  <button className="btn btn-ghost" onClick={() => { setBannerFile(null); setBannerPreview(null); }}>
                    Clear
                  </button>
                )}
              </div>
            </section>

            <section className="admin-card">
              <div className="card-header">
                <h2 className="card-title">Active Banners</h2>
              </div>
              {banners.length === 0 ? (
                <p className="empty-row">No banners uploaded yet. Upload one above to show it in the homepage slideshow.</p>
              ) : (
                <div className="banner-grid">
                  {banners.map((b, i) => (
                    <div key={b.id} className="banner-item">
                      <div className="banner-item-num">#{i + 1}</div>
                      <img src={b.url} alt={`Banner ${i + 1}`} className="banner-thumb" />
                      <div className="banner-item-actions">
                        <a href={b.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-edit">View</a>
                        <button className="btn btn-sm btn-danger" onClick={() => handleBannerDelete(b.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

      </main>

      {/* Toast notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Delete Product?</h3>
            <p className="modal-text">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;

