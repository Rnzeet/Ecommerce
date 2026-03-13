import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

// Hardcoded admin credentials (can be replaced with backend auth later)
// const ADMIN_USERNAME = "admin";
// const ADMIN_PASSWORD = "admin123";
const ADMIN_USERNAME=import.meta.env.REACT_APP_ADMIN_LOGIN;
const ADMIN_PASSWORD=import.meta.env.REACT_APP_ADMIN_PASS;

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      form.username === ADMIN_USERNAME &&
      form.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem("isAdminLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("❌ Invalid username or password");
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Icon / Logo */}
        <div className="admin-login-icon">🛡️</div>

        <h2 className="admin-login-title">Admin Login</h2>
        <p className="admin-login-subtitle">Sign in to access the dashboard</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter admin username"
              value={form.username}
              onChange={handleChange}
              required
              autoComplete="username"
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter admin password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" className="admin-login-btn">
            Login →
          </button>
        </form>

        <p className="admin-login-hint">
          🔒 Restricted area — authorized personnel only
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
