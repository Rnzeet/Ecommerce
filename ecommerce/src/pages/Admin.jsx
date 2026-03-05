import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    description: "",
  });

  const fetchProducts = async () => {
    const res = await axios.get("http://localhost:5000/admin/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    await axios.post("http://localhost:5000/admin/add-product", form);
    setForm({ name: "", price: "", image: "", category: "", description: "" });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/admin/delete-product/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <button onClick={handleAdd}>Add Product</button>
      </div>

      <h3>Products List</h3>
      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          <span>{p.name} - ₹{p.price}</span>
          <button onClick={() => handleDelete(p.id)} style={{ marginLeft: "10px" }}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Admin;
