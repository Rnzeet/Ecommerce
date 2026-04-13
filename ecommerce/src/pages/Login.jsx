import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

const FEATURES = [
  { icon: "🚚", label: "Free delivery on orders over ₹499" },
  { icon: "🍃", label: "100% natural & organic teas" },
  { icon: "⭐", label: "Rated 5★ by our customers" },
];

function Login() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";

  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  return (
    <div className="login-root">
      {/* ── Left panel ── */}
      <div className="login-left">
        <div className="login-left-inner">
          <Link to="/" className="login-brand">
            <span className="login-brand-icon">🍵</span>
            <span className="login-brand-name">MyTeaStore</span>
          </Link>

          <h1 className="login-headline">
            Every cup tells<br />a story.
          </h1>
          <p className="login-tagline">
            Sourced from the finest gardens across India. Delivered fresh to your door.
          </p>

          <ul className="login-features">
            {FEATURES.map(f => (
              <li key={f.label}>
                <span className="login-feature-icon">{f.icon}</span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        {/* decorative blobs */}
        <div className="login-blob login-blob-1" />
        <div className="login-blob login-blob-2" />
      </div>

      {/* ── Right panel (card) ── */}
      <div className="login-right">
        <div className="login-card">
          <div className="login-card-icon">☕</div>

          <h2 className="login-card-title">Welcome back</h2>
          <p className="login-card-sub">
            Sign in to track orders, save your cart, and unlock exclusive offers.
          </p>

          <button className="login-google-btn" onClick={() => signInWithGoogle(next)}>
            <svg className="login-google-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="login-divider">
            <span>secure sign-in</span>
          </div>

          <p className="login-privacy">
            By signing in you agree to our{" "}
            <Link to="/about" className="login-link">Terms</Link> &amp;{" "}
            <Link to="/about" className="login-link">Privacy Policy</Link>.
            We never store passwords.
          </p>

          <p className="login-back">
            Just browsing? <Link to="/products" className="login-link">Shop without account →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
