
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

const API = import.meta.env.VITE_API_URL || "https://ecommerce-19y4.onrender.com";

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
    } catch {
      showToast("Failed to fetch products", "error");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login");
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="admin-wrapper">

      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">🍵</span>
          <span className="logo-text">MyTeaStore</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-label">MANAGEMENT</div>
          <div className="nav-item active">
            <span className="nav-icon">📦</span> Products
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
            <h1 className="topbar-title">Product Management</h1>
            <p className="topbar-sub">Manage your store inventory</p>
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
              <input className="form-input" name="category" placeholder="e.g. Herbal" value={form.category} onChange={handleChange} />
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

