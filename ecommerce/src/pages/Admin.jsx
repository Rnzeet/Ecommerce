
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL || "https://ecommerce-19y4.onrender.com";

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin-login");
  };
const [editId, setEditId] = useState(null);

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
     category: "",
     description: "",
    imageName: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get(`${API}/api/products`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result, imageName: file.name }));
    };
    reader.readAsDataURL(file);
  };

const handleAdd = async () => {

  if (editId) {

    await axios.put(`${API}/api/products/update-product/${editId}`, form);

    setEditId(null);

  } else {

    await axios.post(`${API}/api/products/add-product`, form);

  }

  setForm({
    name: "",
    price: "",
    image: "",
     category: "",
     description: "",
    imageName: "",
  });

  fetchProducts();
};


  const handleDelete = async (id) => {
    await axios.delete(`${API}/api/products/delete-product/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h2>Admin Dashboard</h2>

        <button
          onClick={handleLogout}
          style={{
            background: "#e74c3c",
            color: "white",
            border: "none",
            padding: "8px 18px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Logout
        </button>
      </div>

      {/* Add Product */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h3>Add Product</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
          />

          <div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {form.imageName && (
              <div style={{ marginTop: 8,color:'red' }} className="file-name">{form.imageName}</div>
            )}
          </div>

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          style={{ width: "100%", marginTop: "10px" }}
        />

       <button
  onClick={handleAdd}
  style={{
    marginTop: "10px",
    background: "#2ecc71",
    border: "none",
    padding: "10px 18px",
    color: "white",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  {editId ? "Update Product" : "Add Product"}
</button>

      </div>

      {/* Product Table */}

      <h3>Products List</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ background: "#f1f1f1" }}>
            <th style={{ padding: "10px",color: "black" }}>Image</th>
            <th style={{ padding: "10px",color: "black" }}>Name</th>
            <th style={{ padding: "10px",color: "black" }}>Price</th>
            <th style={{ padding: "10px",color: "black" }}>Category</th>
            <th style={{ padding: "10px",color: "black" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
              
              <td style={{ padding: "10px" }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: "50px", borderRadius: "6px" }}
                />
              </td>

              <td>{p.name}</td>

              <td>₹{p.price}</td>

              <td>{p.category}</td>
<button
  onClick={() => {
    setForm({
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
      description: p.description
    });
    setEditId(p.id);
  }}
>
Edit
</button>

              <td>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    background: "#e74c3c",
                    border: "none",
                    padding: "6px 12px",
                    color: "white",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Admin;
