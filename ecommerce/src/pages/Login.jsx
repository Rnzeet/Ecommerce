import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/";

  // If already logged in, redirect to intended destination
  useEffect(() => {
    if (user) navigate(next, { replace: true });
  }, [user, navigate, next]);

  const handleGoogleLogin = () => {
    signInWithGoogle(next);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🍵</div>
        <h1 className="login-title">Welcome to TeaStore</h1>
        <p className="login-subtitle">Sign in to continue to checkout</p>

        <button className="google-signin-btn" onClick={handleGoogleLogin}>
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="google-icon"
          />
          Continue with Google
        </button>

        <p className="login-note">
          We only use your Google account to identify you. No passwords stored.
        </p>
      </div>
    </div>
  );
}

export default Login;
